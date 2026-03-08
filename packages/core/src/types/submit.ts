export interface SubmitResult {
  success: boolean;
  data?: unknown;
  error?: string;
  itemId?: string | number;
}

export type SubmitHandler = (
  values: Record<string, unknown>,
  config?: SubmitHandlerConfig,
) => Promise<SubmitResult>;

export interface SubmitHandlerConfig {
  type: string;
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  listId?: string;
  [key: string]: unknown;
}
