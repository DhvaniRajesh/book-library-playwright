import type { APIRequestContext } from '@playwright/test';
import { AuthClient, type LoginPayload } from '../clients/auth.client';

/**
 * Authentication service that handles login operations.
 * Processes user credentials and manages JWT token extraction and handling.
 */

/**
 * Authenticates a user with provided credentials.
 * Calls the AuthClient to login and extracts the JWT token from the response.
 * Validates that the response contains a valid token.
 *
 * @async
 * @param {APIRequestContext} request - Playwright API request context
 * @param {LoginPayload} payload - Login credentials containing username and password
 * @returns {Promise<Object>} Authentication result object
 * @returns {number} .status - HTTP status code from the response
 * @returns {boolean} .ok - Whether the response indicates success (2xx status)
 * @returns {Object} .body - The complete response body
 * @returns {string} .token - The JWT token for authenticated requests
 * @throws {Error} If the response body is invalid or not valid JSON
 */
export async function authenticate(request: APIRequestContext, payload: LoginPayload) {
  const res = await AuthClient.login(request, payload);
  const body = await res.json().catch(() => null);

  if (!body || typeof body !== 'object') {
    throw new Error(`Login failed: response body is not valid JSON`);
  }
  
  const token = body.token;

  return {
    status: res.status(),
    ok: res.ok(),
    body,
    token
  };
}
