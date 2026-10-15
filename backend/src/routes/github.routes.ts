import { Router } from 'express';
import {
  searchRepositories,
  getRepositoryDetails,
  getLatestCommits,
  getTopContributors,
  getIssuesSummary,
} from '../controllers/github.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  searchRepositoriesSchema,
  repositoryParamsSchema,
  listQuerySchema,
} from '../schemas/github.schema.js';

const router = Router();

// GET /api/github/search?q=...&page=1&per_page=20&sort=stars
router.get('/search', validateRequest(searchRepositoriesSchema), searchRepositories);

// GET /api/github/repos/:owner/:repo
router.get(
  '/repos/:owner/:repo',
  validateRequest(repositoryParamsSchema),
  getRepositoryDetails
);

// GET /api/github/repos/:owner/:repo/commits?per_page=5
router.get(
  '/repos/:owner/:repo/commits',
  validateRequest(repositoryParamsSchema),
  validateRequest(listQuerySchema),
  getLatestCommits
);

// GET /api/github/repos/:owner/:repo/contributors?per_page=5
router.get(
  '/repos/:owner/:repo/contributors',
  validateRequest(repositoryParamsSchema),
  validateRequest(listQuerySchema),
  getTopContributors
);

// GET /api/github/repos/:owner/:repo/issues-summary
router.get(
  '/repos/:owner/:repo/issues-summary',
  validateRequest(repositoryParamsSchema),
  getIssuesSummary
);

export const githubRoutes = router;
