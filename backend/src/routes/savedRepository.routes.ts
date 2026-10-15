import { Router } from 'express';
import {
  getSavedRepositories,
  getSavedRepositoryStatus,
  saveRepository,
  removeSavedRepository,
} from '../controllers/savedRepository.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createSavedRepositorySchema,
  savedRepositoryParamsSchema,
} from '../schemas/savedRepository.schema.js';

const router = Router();

// GET /api/saved-repositories
router.get('/', getSavedRepositories);

// GET /api/saved-repositories/:owner/:repo
router.get('/:owner/:repo', validateRequest(savedRepositoryParamsSchema), getSavedRepositoryStatus);

// POST /api/saved-repositories
router.post('/', validateRequest(createSavedRepositorySchema), saveRepository);

// DELETE /api/saved-repositories/:owner/:repo
router.delete('/:owner/:repo', validateRequest(savedRepositoryParamsSchema), removeSavedRepository);

export const savedRepositoryRoutes = router;
