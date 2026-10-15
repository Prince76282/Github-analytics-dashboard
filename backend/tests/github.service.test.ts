import { describe, it, expect, vi } from 'vitest';
import { GitHubService } from '../src/services/github.service.js';
import { parseGitHubError } from '../src/utils/parseGitHubError.js';
import { AxiosError } from 'axios';

describe('GitHubService Unit Tests', () => {
  const service = new GitHubService();

  describe('normalizeRepository', () => {
    it('accurately normalizes raw GitHub repository data with defaults', () => {
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
        topics: ['declarative', 'frontend', 'javascript', 'react', 'ui'],
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
      expect(normalized.topics).toEqual(['declarative', 'frontend', 'javascript', 'react', 'ui']);
    });

    it('handles null description and missing optional fields safely', () => {
      const raw = {
        id: 999,
        name: 'minimal-repo',
        full_name: 'user/minimal-repo',
        owner: null,
        description: null,
        html_url: 'https://github.com/user/minimal-repo',
      };

      const normalized = service.normalizeRepository(raw);
      expect(normalized.description).toBeNull();
      expect(normalized.language).toBeNull();
      expect(normalized.stars).toBe(0);
      expect(normalized.topics).toEqual([]);
      expect(normalized.license).toBeNull();
      expect(normalized.defaultBranch).toBe('main');
    });
  });

  describe('parseGitHubError', () => {
    it('maps 403 / 429 rate limit errors with header information', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 403,
          data: { message: 'API rate limit exceeded for 127.0.0.1' },
          headers: {
            'x-ratelimit-remaining': '0',
            'x-ratelimit-reset': '1790000000',
          },
        },
      } as unknown as AxiosError;

      const appError = parseGitHubError(axiosError);
      expect(appError.statusCode).toBe(429);
      expect(appError.message).toContain('rate limit exceeded');
    });

    it('maps 404 to user-friendly resource not found message', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: { message: 'Not Found' },
          headers: {},
        },
      } as unknown as AxiosError;

      const appError = parseGitHubError(axiosError, 'Repository facebook/nonexistent');
      expect(appError.statusCode).toBe(404);
      expect(appError.message).toContain('not found or is private');
    });

    it('maps 500+ GitHub upstream failures to 502 Bad Gateway', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 503,
          data: { message: 'Service Unavailable' },
          headers: {},
        },
      } as unknown as AxiosError;

      const appError = parseGitHubError(axiosError);
      expect(appError.statusCode).toBe(502);
      expect(appError.message).toContain('service disruptions');
    });
  });
});
