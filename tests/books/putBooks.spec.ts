import {
  request as playwrightRequest,
  type APIRequestContext,
} from "@playwright/test";
import { test, expect } from "../../src/fixtures/auth.fixture";
import { createBook, deleteBook, getBookById, updateBook } from "../../src/services/books.service";
import type { CreateBookPayload } from "../../src/types/book.dto";
import { BASE_URL } from "../../src/utils/env";
import { BookSchema, BookResponseSchema, PartialBookSchema } from "../../src/schemas/book.schema";
import { validateOrThrow } from "../../src/utils/schema-helpers";

test.describe("Update Book", () => {
  let apiRequestContext: APIRequestContext | null;

  test.beforeAll(async () => {
    apiRequestContext = await playwrightRequest.newContext({
      baseURL: BASE_URL,
    });
  });

  test.afterAll(async () => {
    if (apiRequestContext) await apiRequestContext.dispose();
  });

  test("Verify updating the availability field of a book reflects correctly when fetched", async ({ token }) => {
    if (!apiRequestContext) throw new Error("apiRequestContext not initialized");
    // 1) create
    const payload: CreateBookPayload = {
      title: `Update single field - ${Date.now()}`,
      author: "Author A",
      isbn: "111-1111111111",
      publishedYear: 2021,
      available: true,
    };

    const createResult = await createBook(apiRequestContext, payload, token);
    expect(createResult.ok).toBeTruthy();
    expect(createResult.status).toBe(201);
    validateOrThrow(BookResponseSchema, createResult.body, "createBook response");
    const created = BookSchema.parse(createResult.body.data);
    const createdId = created.id;

    // 2) update available -> false
    const updatePayload = { available: false };
    const updateResult = await updateBook(apiRequestContext, createdId, updatePayload, token);

    expect(updateResult.ok).toBeTruthy();
    expect(updateResult.status).toBe(200);
    expect(updateResult.body).toBeTruthy();
    
    validateOrThrow(PartialBookSchema, updateResult.body, "updateBook response");
    
    expect(updateResult.body.success).toBe(true);
    expect(updateResult.body.message).toBe("Book updated successfully");
    
    expect(updateResult.body.data).toMatchObject(updatePayload);
    expect(updateResult.body.data.id.toString()).toBe(createdId.toString());

    // 3) fetch and assert value changed
    const getResult = await getBookById(apiRequestContext, createdId);
    expect(getResult.ok).toBeTruthy();
    expect(getResult.status).toBe(200);
    expect(getResult.body.data.id.toString()).toBe(createdId.toString());
    
    expect(getResult.body.data).toMatchObject(updatePayload);

    // 4) delete the created book
    const deleteResult = await deleteBook(apiRequestContext, createdId, token);
    expect(deleteResult.status).toBe(200); 
    expect(deleteResult.body.success).toBe(true);
    expect(deleteResult.body.message).toBe("Book deleted successfully");  
    expect(deleteResult.body.deletedId.toString()).toBe(createdId.toString());
  });

  test("Verify updating multiple fields of a book persists all changes successfully", async ({ token }) => {
    if (!apiRequestContext) throw new Error("apiRequestContext not initialized");
    // 1) create
    const payload: CreateBookPayload = {
      title: `Update multiple - ${Date.now()}`,
      author: "Author B",
      isbn: "222-2222222222",
      publishedYear: 2010,
      available: true,
    };

    const createResult = await createBook(apiRequestContext, payload, token);
    expect(createResult.ok).toBeTruthy();
    expect(createResult.status).toBe(201);
    validateOrThrow(BookResponseSchema, createResult.body, "createBook response (multi fields)");
    const created = BookSchema.parse(createResult.body.data);
    const createdId = created.id;

    // 2) update multiple fields
    const updatePayload = {
      title: "Updated Title - Multi",
      publishedYear: 2020,
      available: false,
    };
    const updateResult = await updateBook(apiRequestContext, createdId, updatePayload, token);

    expect(updateResult.ok).toBeTruthy();
    expect(updateResult.status).toBe(200);
    expect(updateResult.body).toBeTruthy();
    
    validateOrThrow(PartialBookSchema, updateResult.body, "updateBook response");
    
    expect(updateResult.body.success).toBe(true);
    expect(updateResult.body.message).toBe("Book updated successfully");
    
    expect(updateResult.body.data).toMatchObject(updatePayload);
    expect(updateResult.body.data.id.toString()).toBe(createdId.toString());

    // 3) fetch and assert all changes
    const getResult = await getBookById(apiRequestContext, createdId);
    expect(getResult.ok).toBeTruthy();
    expect(getResult.status).toBe(200);
    expect(getResult.body.data.id.toString()).toBe(createdId.toString());
    
    expect(getResult.body.data).toMatchObject(updatePayload);

    // 4) delete the created book
    const deleteResult = await deleteBook(apiRequestContext, createdId, token);
    expect(deleteResult.status).toBe(200); 
    expect(deleteResult.body.success).toBe(true);
    expect(deleteResult.body.message).toBe("Book deleted successfully");  
    expect(deleteResult.body.deletedId.toString()).toBe(createdId.toString());
  });

  test("Verify updating a non-existent book returns a 404 not-found error", async ({ token }) => {
    if (!apiRequestContext) throw new Error("apiRequestContext not initialized");

    const nonExistentId = 999; 
    const updatePayload = { title: "Will not be found" };

    const updateResult = await updateBook(apiRequestContext, nonExistentId, updatePayload, token);

    expect(updateResult.ok).toBeFalsy();
    expect(updateResult.status).toBe(404);
    expect(updateResult.body).toBeTruthy();
    expect(updateResult.body.error).toBe("Not Found");
    expect(updateResult.body.message).toBe(`Book with ID ${nonExistentId} not found`);
    expect(updateResult.body.message).toMatch(new RegExp(String(nonExistentId)));
  });
});
