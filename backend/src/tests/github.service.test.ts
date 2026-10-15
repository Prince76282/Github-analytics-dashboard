import { describe, it, expect } from 'vitest';
import { GitHubService } from '../services/github.service.js';

describe('GitHubService Unit Tests', () => {
  const service = new GitHubService();

  describe('normalizeRepository', () => {
    it('normalizes GitHub repository data with defaults', () => {
      const raw = {
        id: 10270250,
        name: 'react',
        full_name: 'facebook/react',
        owner: {
          login: 'facebook',
          avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
          html_url: 'https://github.com/facebook',
        },
        description: 'The library for web and native user interfaces.',
        html_url: 'https://github.com/facebook/react',
        stargazers_count: 228000,
        forks_count: 45000,
        open_issues_count: 980,
        watchers_count: 6700,
        language: 'JavaScript',
        created_at: '2013-05-24T16:15:54Z',
        updated_at: '2026-10-13T10:00:00Z',
        pushed_at: '2026-10-13T09:30:00Z',
        default_branch: 'main',
        license: {
          key: 'mit',
          name: 'MIT License',
          spdx_id: 'MIT',
        },
        topics: ['frontend', 'javascript', 'react', 'ui'],
        private: false,
        fork: false,
        size: 320000,
      };

      const normalized = service.normalizeRepository(raw);

      expect(normalized.id).toBe(10270250);
      expect(normalized.name).toBe('react');
      expect(normalized.fullName).toBe('facebook/react');
      expect(normalized.owner.login).toBe('facebook');
      expect(normalized.stars).toBe(228000);
      expect(normalized.forks).toBe(45000);
      expect(normalized.language).toBe('JavaScript');
      expect(normalized.license?.key).toBe('mit');
      expect(normalized.topics).toEqual(['frontend', 'javascript', 'react', 'ui']);
    });

    it('handles null description and missing optional fields safely', () => {
      const raw = {
        id: 999,
        name: 'minimal-repo',
        full_name: 'user/minimal-repo',
        owner: null,
        description: null,
        html_url: 'https://github.com/user/minimal-repo',
        stargazers_count: null,
        forks_count: null,
        open_issues_count: null,
        watchers_count: null,
        language: null,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
        pushed_at: null,
        default_branch: null,
        license: null,
        topics: null,
        private: null,
        fork: null,
      };

      const normalized = service.normalizeRepository(raw);

      expect(normalized.id).toBe(999);
      expect(normalized.description).toBeNull();
      expect(normalized.stars).toBe(0);
      expect(normalized.forks).toBe(0);
      expect(normalized.defaultBranch).toBe('main');
      expect(normalized.topics).toEqual([]);
      expect(normalized.owner.login).toBe('');
    });
  });
});
