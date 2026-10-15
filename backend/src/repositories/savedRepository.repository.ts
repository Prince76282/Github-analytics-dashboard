import { SavedRepositoryModel, ISavedRepository } from '../models/SavedRepository.model.js';

export interface CreateSavedRepoDTO {
  owner: string;
  name: string;
  fullName: string;
  description?: string | null;
  htmlUrl: string;
  stars?: number;
  forks?: number;
  language?: string | null;
  githubId?: number;
}

export class SavedRepositoryRepository {
  public async findAll(): Promise<ISavedRepository[]> {
    return SavedRepositoryModel.find().sort({ savedAt: -1 }).exec();
  }

  public async findByOwnerAndName(owner: string, name: string): Promise<ISavedRepository | null> {
    return SavedRepositoryModel.findOne({
      owner: owner.trim().toLowerCase(),
      name: name.trim().toLowerCase(),
    }).exec();
  }

  public async create(dto: CreateSavedRepoDTO): Promise<ISavedRepository> {
    const doc = new SavedRepositoryModel({
      ...dto,
      owner: dto.owner.trim().toLowerCase(),
      name: dto.name.trim().toLowerCase(),
      fullName: `${dto.owner.trim().toLowerCase()}/${dto.name.trim().toLowerCase()}`,
      savedAt: new Date(),
    });
    return doc.save();
  }

  public async deleteByOwnerAndName(owner: string, name: string): Promise<boolean> {
    const result = await SavedRepositoryModel.deleteOne({
      owner: owner.trim().toLowerCase(),
      name: name.trim().toLowerCase(),
    }).exec();

    return result.deletedCount > 0;
  }

  public async count(): Promise<number> {
    return SavedRepositoryModel.countDocuments().exec();
  }
}

export const savedRepositoryRepository = new SavedRepositoryRepository();
