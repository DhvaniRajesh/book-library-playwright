import type { APIRequestContext } from '@playwright/test';

/**
 * Build common headers for API requests.
 * Adds Content-Type by default and Authorization when token is provided.
 */
export function buildHeaders(token?: string, contentType = 'application/json'): Record<string, string> {
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = contentType;
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

/**
 * Compact request options builder used by clients.
 * - attaches `data` when provided
 * - merges headers produced by `buildHeaders` with any additional headers
 */
export function addRequestOptions(data?: any, token?: string, headers?: Record<string, string>) {
  const base = buildHeaders(token);
  const merged = headers ? { ...base, ...headers } : base;

  const opts: Record<string, any> = {};
  if (data !== undefined) opts.data = data;
  if (Object.keys(merged).length) opts.headers = merged;
  return opts;
}
