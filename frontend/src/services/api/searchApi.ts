import { apiClient } from './httpClient';
import { ApiResponse } from '@/types/api';
import { SearchRepositoriesData } from '@/types/repository';

export interface SearchParams {
  q: string;
  page?: number;
  per_page?: number;
  sort?: 'stars' | 'updated' | 'forks' | '';
  order?: 'asc' | 'desc';
}

export async function searchRepositories(params: SearchParams): Promise<SearchRepositoriesData> {
  const response = await apiClient.get<ApiResponse<SearchRepositoriesData>>('/github/search', {
    params,
  });
  if (!response.data.data) {
    throw new Error('No repository data received from server');
  }
  return response.data.data;
}
