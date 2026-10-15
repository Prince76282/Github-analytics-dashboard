import { AxiosError } from 'axios';
import { AppError } from './AppError.js';

export function parseGitHubError(error: unknown, context?: string): AppError {
  if (error instanceof AppError) {
    return error;
  }

  const err = error as AxiosError<{ message?: string; documentation_url?: string }>;

  if (err.isAxiosError && err.response) {
    const status = err.response.status;
    const responseData = err.response.data;
    const githubMsg = responseData?.message || err.message;
    const rateLimitRemaining = err.response.headers?.['x-ratelimit-remaining'];
    const rateLimitReset = err.response.headers?.['x-ratelimit-reset'];
    const retryAfter = err.response.headers?.['retry-after'];

    if (status === 403 || status === 429) {
      if (rateLimitRemaining === '0' || githubMsg.toLowerCase().includes('rate limit')) {
        const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset, 10) * 1000).toLocaleTimeString() : undefined;
        const msg = resetTime
          ? `GitHub API rate limit exceeded. Reset expected at approximately ${resetTime}.`
          : 'GitHub API rate limit exceeded. Please try again shortly or configure GITHUB_TOKEN.';
        return new AppError(msg, 429, {
          rateLimited: true,
          rateLimitRemaining,
          rateLimitReset,
          retryAfter,
        });
      }
      return new AppError(`GitHub API access forbidden: ${githubMsg}`, 403);
    }

    if (status === 404) {
      const entity = context || 'GitHub resource';
      return new AppError(`${entity} not found or is private.`, 404);
    }

    if (status >= 500) {
      return new AppError('GitHub API is currently experiencing downtime or service disruptions.', 502, {
        upstreamStatus: status,
      });
    }

    return new AppError(`GitHub API request failed: ${githubMsg}`, status);
  }

  if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
    return new AppError('GitHub API request timed out. Please try again.', 504);
  }

  if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    return new AppError('Unable to connect to GitHub API. Please check your network connection.', 503);
  }

  return new AppError(err.message || 'An unexpected error occurred while communicating with GitHub.', 500);
}
