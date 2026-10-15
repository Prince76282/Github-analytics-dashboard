import { apiClient } from './httpClient';
import { ApiResponse } from '@/types/api';
import {
  Repository,
  CommitItem,
  ContributorItem,
  IssuesSummary,
} from '@/types/repository';

export async function getRepositoryDetails(owner: string, repo: string): Promise<Repository> {
  const response = await apiClient.get<ApiResponse<Repository>>(
    `/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
  );
  if (!response.data.data) {
    throw new Error('Repository details not returned');
  }
  return response.data.data;
}

export async function getLatestCommits(
  owner: string,
  repo: string,
  perPage = 5
): Promise<CommitItem[]> {
  const response = await apiClient.get<ApiResponse<CommitItem[]>>(
    `/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits`,
    { params: { per_page: perPage } }
  );
  return response.data.data || [];
}

export async function getTopContributors(
  owner: string,
  repo: string,
  perPage = 5
): Promise<ContributorItem[]> {
  const response = await apiClient.get<ApiResponse<ContributorItem[]>>(
    `/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contributors`,
    { params: { per_page: perPage } }
  );
  return response.data.data || [];
}

export async function getIssuesSummary(owner: string, repo: string): Promise<IssuesSummary> {
  const response = await apiClient.get<ApiResponse<IssuesSummary>>(
    `/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues-summary`
  );
  if (!response.data.data) {
    throw new Error('Issues summary not returned');
  }
  return response.data.data;
}
