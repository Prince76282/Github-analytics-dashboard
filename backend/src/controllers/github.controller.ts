import { Request, Response } from 'express';
import { gitHubService } from '../services/github.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const searchRepositories = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const perPage = req.query.per_page ? parseInt(req.query.per_page as string, 10) : 20;
  const sort = (req.query.sort as 'stars' | 'updated' | 'forks' | '') || 'stars';
  const order = (req.query.order as 'asc' | 'desc') || 'desc';

  const result = await gitHubService.searchRepositories(query, page, perPage, sort, order);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getRepositoryDetails = asyncHandler(async (req: Request, res: Response) => {
  const { owner, repo } = req.params;
  const repository = await gitHubService.getRepository(owner, repo);

  res.status(200).json({
    success: true,
    data: repository,
  });
});

export const getLatestCommits = asyncHandler(async (req: Request, res: Response) => {
  const { owner, repo } = req.params;
  const perPage = req.query.per_page ? parseInt(req.query.per_page as string, 10) : 5;

  const commits = await gitHubService.getLatestCommits(owner, repo, perPage);

  res.status(200).json({
    success: true,
    data: commits,
  });
});

export const getTopContributors = asyncHandler(async (req: Request, res: Response) => {
  const { owner, repo } = req.params;
  const perPage = req.query.per_page ? parseInt(req.query.per_page as string, 10) : 5;

  const contributors = await gitHubService.getTopContributors(owner, repo, perPage);

  res.status(200).json({
    success: true,
    data: contributors,
  });
});

export const getIssuesSummary = asyncHandler(async (req: Request, res: Response) => {
  const { owner, repo } = req.params;
  const summary = await gitHubService.getIssuesSummary(owner, repo);

  res.status(200).json({
    success: true,
    data: summary,
  });
});
