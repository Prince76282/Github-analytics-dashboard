import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../app.js';

describe('GitHub Routes Integration Tests', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('Validation on GitHub endpoints', () => {
    it('rejects search requests with missing or empty query with 400', async () => {
      const res = await request(app).get('/api/github/search?q=');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('Validation failed');
    });

    it('rejects invalid page parameters with 400', async () => {
      const res = await request(app).get('/api/github/search?q=react&page=0');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects per_page greater than 100 with 400', async () => {
      const res = await request(app).get('/api/github/search?q=react&per_page=200');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
