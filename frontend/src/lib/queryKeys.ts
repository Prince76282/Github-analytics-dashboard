export const queryKeys = {
  health: ['health'] as const,
  githubSearch: (query: string, page: number, perPage: number, sort: string) =>
    ['github-search', query, page, perPage, sort] as const,
  repository: (owner: string, repo: string) =>
    ['repository', owner.toLowerCase(), repo.toLowerCase()] as const,
  repositoryCommits: (owner: string, repo: string, perPage = 5) =>
    ['repository-commits', owner.toLowerCase(), repo.toLowerCase(), perPage] as const,
  repositoryContributors: (owner: string, repo: string, perPage = 5) =>
    ['repository-contributors', owner.toLowerCase(), repo.toLowerCase(), perPage] as const,
  repositoryIssuesSummary: (owner: string, repo: string) =>
    ['repository-issues-summary', owner.toLowerCase(), repo.toLowerCase()] as const,
  savedRepositories: ['saved-repositories'] as const,
  savedRepositoryStatus: (owner: string, repo: string) =>
    ['saved-repository-status', owner.toLowerCase(), repo.toLowerCase()] as const,
};
