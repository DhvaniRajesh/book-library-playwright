import type { APIRequestContext } from '@playwright/test';
import { AuthClient, type LoginPayload } from '../clients/auth.client';

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
