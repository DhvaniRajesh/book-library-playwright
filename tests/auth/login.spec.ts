import {
  test,
  expect,
  request as playwrightRequest,
  type APIRequestContext,
} from "@playwright/test";
import { BASE_URL, AUTH_USERNAME, AUTH_PASSWORD } from "../../src/utils/env";
import { authenticate } from "../../src/services/auth.service";

test.describe("Auth - login", () => {
  let apiRequestContext: APIRequestContext | null;

  test.beforeAll(async () => {
    apiRequestContext = await playwrightRequest.newContext({
      baseURL: BASE_URL,
    });
  });

  test.afterAll(async () => {
    if (apiRequestContext) await apiRequestContext.dispose();
  });

  test("should login and return a valid JWT token for valid credentials", async () => {
    if (!apiRequestContext)
      throw new Error("API request context not initialized");

    const result = await authenticate(apiRequestContext, {
      username: AUTH_USERNAME,
      password: AUTH_PASSWORD,
    });

    expect(result.ok).toBeTruthy();
    expect(result.status).toBe(200);

    expect(result.token).toBeTruthy();

    expect(result.body.message).toBe("Login successful");
    expect(result.body.user.username).toBe("admin");
  });

  test("should return 401 for invalid credentials", async () => {
    if (!apiRequestContext)
      throw new Error("API request context not initialized");

    const result = await authenticate(apiRequestContext, {
      username: AUTH_USERNAME,
      password: "password123",
    });

    expect(result.status).toBe(401);

    expect(result.body.message).toBe("Invalid username or password");
    expect(result.token).toBeUndefined();
    expect(result.body.error).toBe("Unauthorized");
  });

  test("should return 400 for missing credentials", async () => {
    if (!apiRequestContext)
      throw new Error("API request context not initialized");

    const result = await authenticate(apiRequestContext, {} as any);

    expect(result.status).toBe(400);

    expect(result.body.message).toBe("Username and password are required");
    expect(result.token).toBeUndefined();
    expect(result.body.error).toBe("Bad Request");
  });
});
