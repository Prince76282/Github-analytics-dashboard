import {
  SavedRepositoryRepository,
  savedRepositoryRepository,
  CreateSavedRepoDTO,
} from '../repositories/savedRepository.repository.js';
import { ISavedRepository } from '../models/SavedRepository.model.js';
import { AppError } from '../utils/AppError.js';

export class SavedRepositoryService {
  constructor(private repo: SavedRepositoryRepository = savedRepositoryRepository) {}

  public async getSavedRepositories(): Promise<ISavedRepository[]> {
    return this.repo.findAll();
  }

  public async getSavedRepository(owner: string, name: string): Promise<ISavedRepository | null> {
    return this.repo.findByOwnerAndName(owner, name);
  }

  public async isSaved(owner: string, name: string): Promise<boolean> {
    const existing = await this.repo.findByOwnerAndName(owner, name);
    return Boolean(existing);
  }

  public async saveRepository(dto: CreateSavedRepoDTO): Promise<ISavedRepository> {
    const existing = await this.repo.findByOwnerAndName(dto.owner, dto.name);
    if (existing) {
      throw new AppError(
        `Repository "${dto.owner}/${dto.name}" is already in your saved list.`,
        409,
        { existingId: existing._id }
      );
    }

    try {
      return await this.repo.create(dto);
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new AppError(
          `Repository "${dto.owner}/${dto.name}" is already saved in the database.`,
          409
        );
      }
      throw error;
    }
  }

  public async removeSavedRepository(owner: string, name: string): Promise<void> {
    const deleted = await this.repo.deleteByOwnerAndName(owner, name);
    if (!deleted) {
      throw new AppError(`Repository "${owner}/${name}" was not found in your saved list.`, 404);
    }
  }
}

export const savedRepositoryService = new SavedRepositoryService();
