export interface RepositoryOwner {
  login: string;
  avatarUrl: string;
  htmlUrl: string;
}

export interface RepositoryLicense {
  key: string;
  name: string;
  spdxId: string | null;
}

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  owner: RepositoryOwner;
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
  license: RepositoryLicense | null;
  topics: string[];
  isPrivate: boolean;
  isFork: boolean;
  size: number;
}

export interface CommitItem {
  sha: string;
  shortSha: string;
  message: string;
  authorName: string;
  authorDate: string;
  authorAvatarUrl?: string;
  htmlUrl: string;
}

export interface ContributorItem {
  id: number;
  login: string;
  avatarUrl: string;
  htmlUrl: string;
  contributions: number;
}

export interface IssuesSummary {
  pureOpenIssuesCount: number;
  openIssuesCount: number;
  openPullRequestsCount?: number;
  note: string;
}

export interface SearchRepositoriesData {
  totalCount: number;
  incompleteResults: boolean;
  page: number;
  perPage: number;
  totalPages: number;
  items: Repository[];
  cached?: boolean;
}
