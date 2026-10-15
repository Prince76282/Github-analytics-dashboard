export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: number | string;
    details?: unknown;
  };
  meta?: Record<string, unknown>;
}
