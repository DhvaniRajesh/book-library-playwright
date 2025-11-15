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

test.describe("Books API", () => {
  let apiRequestContext: APIRequestContext | null;

  test.beforeAll(async () => {
    apiRequestContext = await playwrightRequest.newContext({
      baseURL: BASE_URL,
    });
  });

  test.afterAll(async () => {
    if (apiRequestContext) await apiRequestContext.dispose();
  });

  test("Create book with valid data should create a book and retrieve it by id", async ({
    token,
  }) => {
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

    expect(createResult.ok).toBeTruthy();
    expect(createResult.status).toBe(201);
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
    // publishedYear and available might be sanitized by server but assert if present
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

  test("Create book with missing data should return Bad request", async ({
    token,
  }) => {
    if (!apiRequestContext)
      throw new Error("apiRequestContext not initialized");

    // 1) Prepare payload with missing required fields

    const payload: Partial<CreateBookPayload> = {
      title: `Incomplete Book - test ${Date.now()}`,
      // author: missing
      // isbn: missing
    } as any;

    // 2) Create book (requires auth)
    const createResult = await createBook(apiRequestContext, payload, token);

    // verify status 400
    expect(createResult.status).toBe(400);
    expect(createResult.body).toBeTruthy();

    expect(createResult.body.error).toBe("Bad Request");
    expect(createResult.body.message).toBe(
      "Missing required fields: title, author, and isbn are required"
    );
  });

  test("Create book with invalid isbn should return Bad request", async ({
    token,
  }) => {
    if (!apiRequestContext)
      throw new Error("apiRequestContext not initialized");

    // 1) Prepare payload with invalid isbn
    const payload: CreateBookPayload = {
      title: `Playwright Programmer - test ${Date.now()}`,
      author: "Andy Hunt and Dave Thomas",
      isbn: "978",
      publishedYear: 2023,
      available: true,
    };

    // 2) Create book (requires auth)
    const createResult = await createBook(apiRequestContext, payload, token);

    // verify status 400
    expect(createResult.status).toBe(400);
    expect(createResult.body).toBeTruthy();

    expect(createResult.body.error).toBe("Bad Request");
    expect(createResult.body.message).toBe(
      "Invalid ISBN format. ISBN should be 10 or 13 digits (hyphens and spaces allowed)"
    );
  });
});
