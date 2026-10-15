import { apiClient } from './httpClient';
import { ApiResponse } from '@/types/api';
import { SavedRepository, SavedRepositoryStatus } from '@/types/savedRepository';
import { Repository } from '@/types/repository';

export async function getSavedRepositories(): Promise<SavedRepository[]> {
  const response = await apiClient.get<ApiResponse<SavedRepository[]>>('/saved-repositories');
  return response.data.data || [];
}

export async function getSavedRepositoryStatus(
  owner: string,
  repo: string
): Promise<SavedRepositoryStatus> {
  const response = await apiClient.get<ApiResponse<SavedRepositoryStatus>>(
    `/saved-repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
  );
  return response.data.data || { isSaved: false, savedRepository: null };
}

export async function saveRepository(repo: Repository): Promise<SavedRepository> {
  const payload = {
    owner: repo.owner.login,
    name: repo.name,
    fullName: repo.fullName,
    description: repo.description,
    htmlUrl: repo.htmlUrl,
    stars: repo.stars,
    forks: repo.forks,
    language: repo.language,
    githubId: repo.id,
  };

  const response = await apiClient.post<ApiResponse<SavedRepository>>(
    '/saved-repositories',
    payload
  );
  if (!response.data.data) {
    throw new Error('Failed to save repository');
  }
  return response.data.data;
}

export async function removeSavedRepository(owner: string, repo: string): Promise<void> {
  await apiClient.delete<ApiResponse<void>>(
    `/saved-repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
  );
}
