import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../src/app.js';
import { SavedRepositoryModel } from '../src/models/SavedRepository.model.js';

describe('API Integration Tests', () => {
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

  beforeEach(async () => {
    await SavedRepositoryModel.deleteMany({});
  });

  describe('GET /api/health', () => {
    it('returns 200 with status ok and database connection state', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('ok');
      expect(res.body.data.database.connected).toBe(true);
    });
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
  });

  describe('Saved Repositories Endpoints (MongoDB)', () => {
    const sampleRepo = {
      owner: 'facebook',
      name: 'react',
      fullName: 'facebook/react',
      description: 'The library for web and native user interfaces.',
      htmlUrl: 'https://github.com/facebook/react',
      stars: 228000,
      forks: 45000,
      language: 'JavaScript',
      githubId: 10270250,
    };

    it('successfully saves a new repository with 201 Created', async () => {
      const res = await request(app)
        .post('/api/saved-repositories')
        .send(sampleRepo);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.owner).toBe('facebook');
      expect(res.body.data.name).toBe('react');

      const savedCount = await SavedRepositoryModel.countDocuments();
      expect(savedCount).toBe(1);
    });

    it('prevents duplicate saved entries and returns 409 Conflict', async () => {
      // First save
      const res1 = await request(app)
        .post('/api/saved-repositories')
        .send(sampleRepo);
      expect(res1.status).toBe(201);

      // Attempt duplicate save (same owner and repo name)
      const res2 = await request(app)
        .post('/api/saved-repositories')
        .send(sampleRepo);

      expect(res2.status).toBe(409);
      expect(res2.body.success).toBe(false);
      expect(res2.body.error.message).toContain('already');

      // Database should still only have 1 document
      const count = await SavedRepositoryModel.countDocuments();
      expect(count).toBe(1);
    });

    it('retrieves saved repositories ordered by newest first', async () => {
      await request(app).post('/api/saved-repositories').send(sampleRepo);
      await request(app).post('/api/saved-repositories').send({
        ...sampleRepo,
        owner: 'vuejs',
        name: 'core',
        fullName: 'vuejs/core',
        htmlUrl: 'https://github.com/vuejs/core',
      });

      const res = await request(app).get('/api/saved-repositories');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].owner).toBe('vuejs');
    });

    it('checks if a specific repository is saved', async () => {
      await request(app).post('/api/saved-repositories').send(sampleRepo);

      const resExisting = await request(app).get('/api/saved-repositories/facebook/react');
      expect(resExisting.status).toBe(200);
      expect(resExisting.body.data.isSaved).toBe(true);

      const resNotSaved = await request(app).get('/api/saved-repositories/vercel/next.js');
      expect(resNotSaved.status).toBe(200);
      expect(resNotSaved.body.data.isSaved).toBe(false);
    });

    it('removes a saved repository and returns 404 on subsequent removal', async () => {
      await request(app).post('/api/saved-repositories').send(sampleRepo);

      const deleteRes = await request(app).delete('/api/saved-repositories/facebook/react');
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.success).toBe(true);

      const checkRes = await request(app).get('/api/saved-repositories/facebook/react');
      expect(checkRes.body.data.isSaved).toBe(false);

      // Subsequent delete returns 404
      const secondDelete = await request(app).delete('/api/saved-repositories/facebook/react');
      expect(secondDelete.status).toBe(404);
    });
  });
});
