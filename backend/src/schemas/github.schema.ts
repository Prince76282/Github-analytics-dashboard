import { z } from 'zod';

export const searchRepositoriesSchema = z.object({
  query: z.object({
    q: z
      .string({ required_error: 'Search query parameter "q" is required' })
      .trim()
      .min(1, 'Search query cannot be empty')
      .max(256, 'Search query is too long'),
    page: z
      .string()
      .optional()
      .default('1')
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val >= 1 && val <= 100, {
        message: 'Page must be an integer between 1 and 100',
      }),
    per_page: z
      .string()
      .optional()
      .default('20')
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val >= 1 && val <= 100, {
        message: 'per_page must be an integer between 1 and 100',
      }),
    sort: z
      .enum(['stars', 'updated', 'forks', ''])
      .optional()
      .default('stars'),
    order: z
      .enum(['asc', 'desc'])
      .optional()
      .default('desc'),
  }),
});

export const repositoryParamsSchema = z.object({
  params: z.object({
    owner: z
      .string()
      .trim()
      .min(1, 'Repository owner is required')
      .regex(/^[a-zA-Z0-9._-]+$/, 'Invalid repository owner format'),
    repo: z
      .string()
      .trim()
      .min(1, 'Repository name is required')
      .regex(/^[a-zA-Z0-9._-]+$/, 'Invalid repository name format'),
  }),
});

export const listQuerySchema = z.object({
  query: z.object({
    per_page: z
      .string()
      .optional()
      .default('5')
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val >= 1 && val <= 30, {
        message: 'per_page must be between 1 and 30',
      }),
  }),
});
