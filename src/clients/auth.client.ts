import type { APIRequestContext, APIResponse } from "@playwright/test";
import { addRequestOptions } from './http.helpers';

/**
 * Represents the login request payload.
 * @typedef {Object} LoginPayload
 * @property {string} username - The user's username
 * @property {string} password - The user's password
 */
export type LoginPayload = {
  username: string;
  password: string;
};

/**
 * HTTP client for authentication-related API endpoints.
 * Provides methods for user login and token generation.
 *
 * @const {Object} AuthClient
 * Authenticates a user and retrieves a JWT token.
 * Sends login credentials to the authentication endpoint.
 */

/**
 * @async
 * @param {APIRequestContext} request - Playwright API request context
 * @param {LoginPayload} payload - Login credentials containing username and password
 * @returns {Promise<APIResponse>} The API response containing authentication token
 */
export const AuthClient = {
  login: async (
    request: APIRequestContext,
    payload: LoginPayload
  ): Promise<APIResponse> => {
    const opts = addRequestOptions(payload);
    return request.post("/auth/login", opts);
  },
};
