import {
  request as playwrightRequest,
  type APIRequestContext,
} from "@playwright/test";
import { test, expect } from "../../src/fixtures/auth.fixture";
import { createBook, getBookById } from "../../src/services/books.service";
import type { CreateBookPayload } from "../../src/types/book.dto";
import { BASE_URL } from "../../src/utils/env";
import { BookSchema, BookResponseSchema } from "../../src/schemas/book.schema";
import { validateOrThrow } from "../../src/utils/schema-helpers";

test.describe("Books API - create & get by id", () => {
  let apiRequestContext: APIRequestContext | null;

  test.beforeAll(async () => {
    apiRequestContext = await playwrightRequest.newContext({
      baseURL: BASE_URL,
    });
  });

  test.afterAll(async () => {
    if (apiRequestContext) await apiRequestContext.dispose();
  });
  test("should create a book and retrieve it by id", async ({ token }) => {
    if (!apiRequestContext)
      throw new Error("apiRequestContext not initialized");

    // 1) Prepare payload
    const payload: CreateBookPayload = {
      title: `Playwright Programmer - test ${Date.now()}`,
      author: "Andy Hunt and Dave Thomas",
      isbn: "978-0135957059",
      publishedYear: 2023,
      available: true,
    };

    // 2) Create book (requires auth)
    const createResult = await createBook(apiRequestContext, payload, token);

    // Basic HTTP success
    expect(createResult.ok).toBeTruthy();
    expect(createResult.status).toBe(201);

    // Prefer API contract: { success: true, data: { ... } }
    expect(createResult.body).toBeTruthy();

    validateOrThrow(
      BookResponseSchema,
      createResult.body,
      "createBook response"
    );
    const created = BookSchema.parse(createResult.body.data); // parse returns typed Book

    expect(createResult.body.success).toBe(true);
    
    const createdId = created.id;

    // Fields should match payload
    expect(created.title).toBe(payload.title);
    expect(created.author).toBe(payload.author);
    expect(created.isbn).toBe(payload.isbn);
    // publishedYear and available might be sanitized/typed by server but assert if present
    if (created.publishedYear !== undefined)
      expect(created.publishedYear).toBe(payload.publishedYear);
    if (created.available !== undefined)
      expect(created.available).toBe(payload.available);

    // 3) Retrieve by ID
    const getResult = await getBookById(apiRequestContext, createdId);

    expect(getResult.ok).toBeTruthy();
    expect(getResult.status).toBe(200);

    validateOrThrow(BookResponseSchema, getResult.body, "getBookById response");
    const fetched = BookSchema.parse(getResult.body.data);

    // Check the returned shape matches expected example
    expect(fetched.id.toString()).toBe(createdId.toString());
    expect(fetched.title).toBe(payload.title);
    expect(fetched.author).toBe(payload.author);
    // isbn, publishedYear, available checks if provided
    if (payload.isbn) expect(fetched.isbn).toBe(payload.isbn);
    if (payload.publishedYear !== undefined)
      expect(fetched.publishedYear).toBe(payload.publishedYear);
    if (payload.available !== undefined)
      expect(fetched.available).toBe(payload.available);
  });
});
