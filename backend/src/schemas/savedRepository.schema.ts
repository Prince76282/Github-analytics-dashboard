import { z } from 'zod';

export const createSavedRepositorySchema = z.object({
  body: z.object({
    owner: z.string().trim().min(1, 'Owner is required'),
    name: z.string().trim().min(1, 'Name is required'),
    fullName: z.string().trim().min(1, 'Full name is required'),
    description: z.string().nullable().optional(),
    htmlUrl: z.string().url('Invalid GitHub URL'),
    stars: z.number().int().min(0).default(0),
    forks: z.number().int().min(0).default(0),
    language: z.string().nullable().optional(),
    githubId: z.number().optional(),
  }),
});

export const savedRepositoryParamsSchema = z.object({
  params: z.object({
    owner: z.string().trim().min(1, 'Owner is required'),
    repo: z.string().trim().min(1, 'Repo is required'),
  }),
});
