import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;
let memoryServer: any = null;

export async function connectDatabase(): Promise<void> {
  if (isConnected) return;

  mongoose.set('strictQuery', true);

  try {
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('Connected to MongoDB successfully.');
    return;
  } catch (error: any) {
    // If SRV lookup failed (common on Windows networks when local DNS refuses SRV queries), retry with public DNS
    if (error?.message?.includes('querySrv') || error?.code === 'ECONNREFUSED') {
      try {
        console.log('Retrying MongoDB connection with public DNS servers (8.8.8.8, 1.1.1.1)...');
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        await mongoose.connect(env.MONGODB_URI, {
          serverSelectionTimeoutMS: 6000,
        });
        isConnected = true;
        console.log('Connected to MongoDB Atlas successfully.');
        return;
      } catch (dnsRetryError: any) {
        console.warn(`Could not connect to MongoDB Atlas: ${dnsRetryError.message}`);
      }
    } else {
      console.warn(`Could not connect to MongoDB Atlas: ${error.message}`);
    }

    // In development or test, fall back to in-memory MongoDB instance
    if (env.NODE_ENV !== 'production') {
      try {
        console.log('Starting in-memory MongoDB database...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const uri = memoryServer.getUri();
        await mongoose.connect(uri);
        isConnected = true;
        console.log(`Connected to local in-memory MongoDB at ${uri}`);
        return;
      } catch (memErr) {
        console.error('Failed to launch in-memory MongoDB fallback:', memErr);
      }
    }

    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
  isConnected = false;
  console.log('Disconnected from MongoDB.');
}

export function getDatabaseStatus(): { isConnected: boolean; state: string } {
  const stateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return {
    isConnected: mongoose.connection.readyState === 1,
    state: stateMap[mongoose.connection.readyState] || 'unknown',
  };
}
