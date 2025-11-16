import {
  test,
  expect,
  request as playwrightRequest,
  type APIRequestContext,
} from "@playwright/test";
import { BASE_URL, AUTH_USERNAME, AUTH_PASSWORD } from "../../src/utils/env";
import { authenticate } from "../../src/services/auth.service";
import { createBook, deleteBook, updateBook } from "../../src/services/books.service";
import { CreateBookPayload } from "../../src/types/book.dto";
import { LoginPayload } from "../../src/clients/auth.client";

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
    } as LoginPayload);

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


test.describe("Auth protection - protected endpoints", () => {
  let apiRequestContext: APIRequestContext | null;

  test.beforeAll(async () => {
    apiRequestContext = await playwrightRequest.newContext({ baseURL: BASE_URL });
  });

  test.afterAll(async () => {
    if (apiRequestContext) await apiRequestContext.dispose();
  });

  test("POST /books should reject when no token provided", async () => {
    if (!apiRequestContext) throw new Error("apiRequestContext not initialized");

    const payload: Partial<CreateBookPayload> = {
      title: `Unauth test ${Date.now()}`,
      author: "No Auth",
    };

    const res = await createBook(apiRequestContext, payload);

    expect(res.ok).toBe(false);
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Access denied. No token provided.");
    expect(res.body.message).toBe("Authorization header with Bearer token is required");
  });

  test("PUT /books/:id should reject when no token provided", async () => {
    if (!apiRequestContext) throw new Error("apiRequestContext not initialized");
    const updateResult = await updateBook(apiRequestContext, "1", { title: "updated" } as Partial<CreateBookPayload>);

    expect(updateResult.ok).toBe(false);
    expect(updateResult.status).toBe(401);
    expect(updateResult.body.error).toBe("Access denied. No token provided.");
    expect(updateResult.body.message).toBe("Authorization header with Bearer token is required");
  });

  test("DELETE /books/:id should reject when no token provided", async () => {
    if (!apiRequestContext) throw new Error("apiRequestContext not initialized");

    const delResult = await deleteBook(apiRequestContext, "1"); 
    expect(delResult.ok).toBe(false);
    expect(delResult.status).toBe(401);
    expect(delResult.body.error).toBe("Access denied. No token provided.");
    expect(delResult.body.message).toBe("Authorization header with Bearer token is required");
  });
});
