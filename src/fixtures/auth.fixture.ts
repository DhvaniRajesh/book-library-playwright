import { test as base, request as playwrightRequest } from '@playwright/test';
import { authenticate } from '../services/auth.service';
import { BASE_URL, AUTH_USERNAME, AUTH_PASSWORD } from '../utils/env';
import { LoginPayload } from '../clients/auth.client';

// Extend Playwright base test
export const test = base.extend<{
  token: string;
}>({
  token: [
    async ({}, use) => {
      // Create an isolated API request context
      const api = await playwrightRequest.newContext({
        baseURL: BASE_URL,
      });

      // Login using our AuthService
      const result = await authenticate(api, {
        username: AUTH_USERNAME,
        password: AUTH_PASSWORD,
      } as LoginPayload);

      if (!result.token) {
        throw new Error(
          'Authentication failed: no token returned from /auth/login'
        );
      }

      // Expose token to the test
      await use(result.token);

      // Cleanup
      await api.dispose();
    },
    { scope: 'test' } 
  ],
});

export const expect = test.expect;
