import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env.js';
import { parseGitHubError } from '../utils/parseGitHubError.js';
import {
  NormalizedRepository,
  NormalizedCommit,
  NormalizedContributor,
  SearchRepositoriesResult,
  IssuesSummary,
} from '../types/github.js';
import { searchCache } from './githubCache.service.js';

export class GitHubService {
  private client: AxiosInstance;

  constructor(baseURL = env.GITHUB_API_BASE_URL, token = env.GITHUB_TOKEN) {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'GitHub-Analytics-Dashboard-App/1.0',
    };

    if (token && token.trim().length > 0) {
      headers.Authorization = `Bearer ${token.trim()}`;
    }

    this.client = axios.create({
      baseURL,
      headers,
      timeout: 10000,
    });
  }

  /**
   * Normalizes a raw GitHub repository item into the application structure
   */
  public normalizeRepository(raw: any): NormalizedRepository {
    return {
      id: raw.id,
      name: raw.name,
      fullName: raw.full_name,
      owner: {
        login: raw.owner?.login || '',
        avatarUrl: raw.owner?.avatar_url || '',
        htmlUrl: raw.owner?.html_url || '',
      },
      description: raw.description ?? null,
      htmlUrl: raw.html_url,
      stars: raw.stargazers_count ?? 0,
      forks: raw.forks_count ?? 0,
      openIssuesCount: raw.open_issues_count ?? 0,
      watchers: raw.watchers_count ?? 0,
      language: raw.language ?? null,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
      pushedAt: raw.pushed_at,
      defaultBranch: raw.default_branch || 'main',
      license: raw.license
        ? {
            key: raw.license.key,
            name: raw.license.name,
            spdxId: raw.license.spdx_id ?? null,
          }
        : null,
      topics: Array.isArray(raw.topics) ? raw.topics : [],
      isPrivate: Boolean(raw.private),
      isFork: Boolean(raw.fork),
      size: raw.size ?? 0,
    };
  }

  /**
   * Searches repositories on GitHub with 5-minute bounded in-memory caching
   */
  public async searchRepositories(
    query: string,
    page = 1,
    perPage = 20,
    sort: 'stars' | 'updated' | 'forks' | '' = 'stars',
    order: 'asc' | 'desc' = 'desc'
  ): Promise<SearchRepositoriesResult> {
    const cacheKey = BoundedMemoryCacheSearchKey(query, page, perPage, sort, order);

    return (
      await searchCache.getOrFetch(cacheKey, async () => {
        try {
          const params: Record<string, string | number> = {
            q: query,
            page,
            per_page: perPage,
            order,
          };

          if (sort && sort.length > 0) {
            params.sort = sort;
          }

          const response = await this.client.get('/search/repositories', { params });
          const data = response.data;

          const totalCount = data.total_count ?? 0;
          // GitHub caps search results at 1,000 items
          const cappedTotal = Math.min(totalCount, 1000);
          const totalPages = Math.max(1, Math.ceil(cappedTotal / perPage));

          const items: NormalizedRepository[] = (data.items || []).map((item: any) =>
            this.normalizeRepository(item)
          );

          return {
            totalCount,
            incompleteResults: Boolean(data.incomplete_results),
            page,
            perPage,
            totalPages,
            items,
          };
        } catch (error) {
          throw parseGitHubError(error, `Repository search "${query}"`);
        }
      })
    ).data;
  }

  /**
   * Fetches single repository metadata
   */
  public async getRepository(owner: string, repo: string): Promise<NormalizedRepository> {
    try {
      const response = await this.client.get(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
      return this.normalizeRepository(response.data);
    } catch (error) {
      throw parseGitHubError(error, `Repository ${owner}/${repo}`);
    }
  }

  /**
   * Fetches latest commits (up to perPage)
   */
  public async getLatestCommits(
    owner: string,
    repo: string,
    perPage = 5
  ): Promise<NormalizedCommit[]> {
    try {
      const response = await this.client.get(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits`,
        { params: { per_page: perPage } }
      );

      if (!Array.isArray(response.data)) {
        return [];
      }

      return response.data.map((item: any) => ({
        sha: item.sha,
        shortSha: item.sha ? item.sha.substring(0, 7) : '',
        message: item.commit?.message || 'No commit message',
        authorName: item.commit?.author?.name || item.author?.login || 'Unknown',
        authorDate: item.commit?.author?.date || item.commit?.committer?.date || '',
        authorAvatarUrl: item.author?.avatar_url,
        htmlUrl: item.html_url,
      }));
    } catch (error: any) {
      // 409 Conflict indicates an empty repository (no commits)
      if (error?.response?.status === 409) {
        return [];
      }
      throw parseGitHubError(error, `Commits for ${owner}/${repo}`);
    }
  }

  /**
   * Fetches top contributors (up to perPage)
   */
  public async getTopContributors(
    owner: string,
    repo: string,
    perPage = 5
  ): Promise<NormalizedContributor[]> {
    try {
      const response = await this.client.get(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contributors`,
        { params: { per_page: perPage } }
      );

      if (!Array.isArray(response.data)) {
        return [];
      }

      return response.data.map((item: any) => ({
        id: item.id,
        login: item.login,
        avatarUrl: item.avatar_url,
        htmlUrl: item.html_url,
        contributions: item.contributions ?? 0,
      }));
    } catch (error: any) {
      // 204 No Content indicates an empty repo with no contributors
      if (error?.response?.status === 204) {
        return [];
      }
      throw parseGitHubError(error, `Contributors for ${owner}/${repo}`);
    }
  }

  /**
   * Fetches open issues summary with distinct issue counting
   */
  public async getIssuesSummary(owner: string, repo: string): Promise<IssuesSummary> {
    try {
      // Step 1: Get standard repo open_issues_count (which includes open pull requests in GitHub's REST API)
      const repoDetails = await this.getRepository(owner, repo);
      const totalCombinedIssues = repoDetails.openIssuesCount;

      // Step 2: Use GitHub Issues Search to get the exact count of pure open issues (is:issue is:open)
      try {
        const issueSearchResponse = await this.client.get('/search/issues', {
          params: {
            q: `repo:${owner}/${repo} is:issue is:open`,
            per_page: 1,
          },
        });
        const pureCount = issueSearchResponse.data?.total_count ?? totalCombinedIssues;
        const pullRequestsCount = Math.max(0, totalCombinedIssues - pureCount);

        return {
          pureOpenIssuesCount: pureCount,
          openIssuesCount: totalCombinedIssues,
          openPullRequestsCount: pullRequestsCount,
          note: 'GitHub repository metadata open_issues_count includes pull requests. The pureOpenIssuesCount represents issues strictly filtered without pull requests.',
        };
      } catch (searchErr) {
        // Fallback to repository metadata count if issue search fails or is rate limited
        return {
          pureOpenIssuesCount: totalCombinedIssues,
          openIssuesCount: totalCombinedIssues,
          note: 'Filtered issue search unavailable; value reflects repository open_issues_count.',
        };
      }
    } catch (error) {
      throw parseGitHubError(error, `Issues for ${owner}/${repo}`);
    }
  }
}

function BoundedMemoryCacheSearchKey(
  query: string,
  page: number,
  perPage: number,
  sort: string,
  order: string
) {
  return `search:${query.trim().toLowerCase()}:p${page}:sz${perPage}:s${sort}:o${order}`;
}

export const gitHubService = new GitHubService();
