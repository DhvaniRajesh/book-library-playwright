import type { APIRequestContext, APIResponse } from '@playwright/test';

export type LoginPayload = {
  username: string;
  password: string;
};

export const AuthClient = {
  login: async (request: APIRequestContext, payload: LoginPayload): Promise<APIResponse> => {
    return request.post('/auth/login', {
      data: payload,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
