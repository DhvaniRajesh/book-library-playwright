// tests/books/errorHandling.spec.ts
import {
  request as playwrightRequest,
  type APIRequestContext,
} from "@playwright/test";
import { test, expect } from "../../src/fixtures/auth.fixture";
import {
  createBook,
  patchBook,
  rawRequest,
} from "../../src/services/books.service";
import type { CreateBookPayload } from "../../src/types/book.dto";
import { BASE_URL } from "../../src/utils/env";

test.describe("Error handling - API edge cases", () => {
  let apiRequestContext: APIRequestContext | null;

  test.beforeAll(async () => {
    apiRequestContext = await playwrightRequest.newContext({
      baseURL: BASE_URL,
    });
  });

  test.afterAll(async () => {
    if (apiRequestContext) await apiRequestContext.dispose();
  });

  test("Verify invalid endpoint returns 404 Not Found with availableEndpoints", async () => {
    if (!apiRequestContext)
      throw new Error("apiRequestContext not initialized");

    const result = await rawRequest(apiRequestContext, "get", "/invalid");
    expect(result.status).toBe(404);
    expect(result.body).toBeTruthy();
    expect(result.body.error).toBe("Not Found");
    expect(result.body.message).toContain("/invalid");
    expect(Array.isArray(result.body.availableEndpoints)).toBe(true);
  });

  test("Verify invalid token returns 401 Invalid or expired token", async () => {
    if (!apiRequestContext)
      throw new Error("apiRequestContext not initialized");

    const payload: CreateBookPayload = {
      title: `Negative invalid-token ${Date.now()}`,
      author: "Tester",
      isbn: "9780000000000",
    };

    const invalidTokenResult = await createBook(
      apiRequestContext,
      payload,
      "invalid-token"
    );
    expect(invalidTokenResult.status).toBe(401);
    expect(invalidTokenResult.body.error).toBe("Invalid or expired token");
    expect(invalidTokenResult.body.message).toContain("jwt malformed");
  });

  test("Verify invalid HTTP method (PATCH) returns 404/Not Found for unsupported method", async ({
    token,
  }) => {
    if (!apiRequestContext)
      throw new Error("apiRequestContext not initialized");
    const updatePayload: Partial<CreateBookPayload> = { available: false };
    const patchResult = await patchBook(
      apiRequestContext,
      "1",
      updatePayload,
      token
    );
    expect(patchResult).toBeTruthy();
    expect(patchResult.status).toBe(404);
    expect(patchResult.body.error).toBe("Not Found");
    expect(patchResult.body.message).toContain("Cannot PATCH /books/");
  });
});
