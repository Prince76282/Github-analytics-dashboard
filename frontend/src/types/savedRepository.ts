export interface SavedRepository {
  _id: string;
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  forks: number;
  language: string | null;
  githubId?: number;
  savedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SavedRepositoryStatus {
  isSaved: boolean;
  savedRepository: SavedRepository | null;
}
