import { Request, Response } from 'express';
import { savedRepositoryService } from '../services/savedRepository.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getSavedRepositories = asyncHandler(async (_req: Request, res: Response) => {
  const saved = await savedRepositoryService.getSavedRepositories();

  res.status(200).json({
    success: true,
    data: saved,
    meta: {
      total: saved.length,
    },
  });
});

export const getSavedRepositoryStatus = asyncHandler(async (req: Request, res: Response) => {
  const { owner, repo } = req.params;
  const savedItem = await savedRepositoryService.getSavedRepository(owner, repo);

  res.status(200).json({
    success: true,
    data: {
      isSaved: Boolean(savedItem),
      savedRepository: savedItem,
    },
  });
});

export const saveRepository = asyncHandler(async (req: Request, res: Response) => {
  const saved = await savedRepositoryService.saveRepository(req.body);

  res.status(201).json({
    success: true,
    message: `Repository ${saved.fullName} successfully saved to favourites.`,
    data: saved,
  });
});

export const removeSavedRepository = asyncHandler(async (req: Request, res: Response) => {
  const { owner, repo } = req.params;
  await savedRepositoryService.removeSavedRepository(owner, repo);

  res.status(200).json({
    success: true,
    message: `Repository ${owner}/${repo} successfully removed from saved favourites.`,
  });
});
