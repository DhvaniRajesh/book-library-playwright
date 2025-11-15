import {
  request as playwrightRequest,
  type APIRequestContext,
} from "@playwright/test";
import { test, expect } from "../../src/fixtures/auth.fixture";
import {
  createBook,
  deleteBook,
  getBookById,
} from "../../src/services/books.service";
import type { CreateBookPayload } from "../../src/types/book.dto";
import { BASE_URL } from "../../src/utils/env";
import { BookSchema, BookResponseSchema, PartialBookResponseSchema } from "../../src/schemas/book.schema";
import { validateOrThrow } from "../../src/utils/schema-helpers";

test.describe("Create Book", () => {
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

    // 2) Create book 
    const createResult = await createBook(apiRequestContext, payload, token);

    expect(createResult.ok).toBeTruthy();
    expect(createResult.status).toBe(201);
    expect(createResult.body).toBeTruthy();

    validateOrThrow(
      BookResponseSchema,
      createResult.body,
      "createBook response"
    );

    expect(createResult.body.success).toBe(true);
    expect(createResult.body.message).toBe("Book created successfully");
    
    const createdId = createResult.body.data.id;

    // Fields should match payload
    expect(createResult.body.data).toMatchObject(payload);

    // 3) Retrieve by ID
    const getResult = await getBookById(apiRequestContext, createdId);

    expect(getResult.ok).toBeTruthy();
    expect(getResult.status).toBe(200);

    validateOrThrow(PartialBookResponseSchema, getResult.body, "getBookById response");
    const fetched = BookSchema.parse(getResult.body.data);

    // Check the returned shape matches expected example
    expect(fetched.id.toString()).toBe(createdId.toString());
    expect(getResult.body.data).toMatchObject(payload);

    const deleteResult = await deleteBook(apiRequestContext, createdId, token);
    expect(deleteResult.status).toBe(200);
    expect(deleteResult.body.success).toBe(true);
    expect(deleteResult.body.message).toBe("Book deleted successfully");
    expect(deleteResult.body.deletedId.toString()).toBe(createdId.toString());
  });

  test("Create book with missing author and isbn should return Bad request", async ({
    token,
  }) => {
    if (!apiRequestContext)
      throw new Error("apiRequestContext not initialized");

    // 1) Prepare payload with missing required fields

    const payload: Partial<CreateBookPayload> = {
      title: `Incomplete Book - test ${Date.now()}`,
      // author: missing
      // isbn: missing
    };

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

  test("Create book with missing title and isbn should return Bad request", async ({
    token,
  }) => {
    if (!apiRequestContext)
      throw new Error("apiRequestContext not initialized");

    // 1) Prepare payload with missing required fields

    const payload: Partial<CreateBookPayload> = {
      // title: missing,
      author: "Andy Hunt and Dave Thomas",
      // isbn: missing
    };

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

  test("Create book with missing title and author should return Bad request", async ({
    token,
  }) => {
    if (!apiRequestContext)
      throw new Error("apiRequestContext not initialized");

    // 1) Prepare payload with missing required fields

    const payload: Partial<CreateBookPayload> = {
      // title: missing,
      // author: missing
      isbn: "978-0135957059",
    };

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
