export interface GitHubRepoOwner {
  login: string;
  avatarUrl: string;
  htmlUrl: string;
}

export interface NormalizedRepository {
  id: number;
  name: string;
  fullName: string;
  owner: GitHubRepoOwner;
  description: string | null;
  htmlUrl: string;
  stars: number;
  forks: number;
  openIssuesCount: number;
  watchers: number;
  language: string | null;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  defaultBranch: string;
  license: {
    key: string;
    name: string;
    spdxId: string | null;
  } | null;
  topics: string[];
  isPrivate: boolean;
  isFork: boolean;
  size: number;
}

export interface NormalizedCommit {
  sha: string;
  shortSha: string;
  message: string;
  authorName: string;
  authorDate: string;
  authorAvatarUrl?: string;
  htmlUrl: string;
}

export interface NormalizedContributor {
  id: number;
  login: string;
  avatarUrl: string;
  htmlUrl: string;
  contributions: number;
}

export interface IssuesSummary {
  openIssuesCount: number;
  openPullRequestsCount?: number;
  pureOpenIssuesCount: number;
  note: string;
}

export interface SearchRepositoriesResult {
  totalCount: number;
  incompleteResults: boolean;
  page: number;
  perPage: number;
  totalPages: number;
  items: NormalizedRepository[];
  cached?: boolean;
}
