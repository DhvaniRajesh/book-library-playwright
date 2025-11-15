import {
  request as playwrightRequest,
  type APIRequestContext,
} from "@playwright/test";
import { test, expect } from "../../src/fixtures/auth.fixture";
import { createBook, deleteBook, getBookById } from "../../src/services/books.service";
import type { CreateBookPayload } from "../../src/types/book.dto";
import { BASE_URL } from "../../src/utils/env";
import { BookSchema, BookResponseSchema } from "../../src/schemas/book.schema";
import { validateOrThrow } from "../../src/utils/schema-helpers";

test.describe("Delete Book", () => {
  let apiRequestContext: APIRequestContext | null;

  test.beforeAll(async () => {
    apiRequestContext = await playwrightRequest.newContext({
      baseURL: BASE_URL,
    });
  });

  test.afterAll(async () => {
    if (apiRequestContext) await apiRequestContext.dispose();
  });

  test("Verify new book gets deleted successfully", async ({ token }) => {
    if (!apiRequestContext) throw new Error("apiRequestContext not initialized");

    // 1) create
    const payload: CreateBookPayload = {
      title: `Delete positive - ${Date.now()}`,
      author: "Delete Author",
      isbn: "333-3333333333",
      publishedYear: 2015,
      available: true,
    };

    const createResult = await createBook(apiRequestContext, payload, token);
    expect(createResult.ok).toBeTruthy();
    expect(createResult.status).toBe(201);
    validateOrThrow(BookResponseSchema, createResult.body, "createBook response");
    const created = BookSchema.parse(createResult.body.data);
    const createdId = created.id;

    // 2) verify created book exists
    const getResult = await getBookById(apiRequestContext, createdId);
    expect(getResult.ok).toBeTruthy();
    expect(getResult.status).toBe(200);
    expect(getResult.body.data.id.toString()).toBe(createdId.toString());
    expect(getResult.body.data).toMatchObject(payload);

    // 3) delete the created book
    const deleteResult = await deleteBook(apiRequestContext, createdId, token);

    // Keep assertions consistent with the curl example / expected response
    expect(deleteResult.ok).toBeTruthy();
    expect(deleteResult.status).toBe(200);
    expect(deleteResult.body).toMatchObject({
      success: true,
      message: "Book deleted successfully",
      deletedId: createdId.toString(),
    });

    // 4) confirm fetching the deleted book returns 404
    const getAfterDelete = await getBookById(apiRequestContext, createdId);
    expect(getAfterDelete.ok).toBeFalsy();
    expect(getAfterDelete.status).toBe(404);
    expect(getAfterDelete.body).toBeTruthy();
    expect(getAfterDelete.body.error).toBe("Not Found");
    expect(getAfterDelete.body.message).toMatch(new RegExp(String(createdId)));
  });

  test("Verify non existent book deletion returns 404 error", async ({ token }) => {
    if (!apiRequestContext) throw new Error("apiRequestContext not initialized");

    const nonExistentId = 999999; 
    const deleteResult = await deleteBook(apiRequestContext, nonExistentId, token);

    expect(deleteResult.ok).toBeFalsy();
    expect(deleteResult.status).toBe(404);
    expect(deleteResult.body).toBeTruthy();

    expect(deleteResult.body).toMatchObject({
      error: "Not Found",
      message: `Book with ID ${nonExistentId} not found`,
    });
  });
});
