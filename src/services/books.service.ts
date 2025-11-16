import type { APIRequestContext } from "@playwright/test";
import { BooksClient } from "../clients/books.client";
import type {
  CreateBookPayload,
  CreateBookResponse,
  Book,
} from "../types/book.dto";

/**
 * Books service module providing high-level business logic for book operations.
 * Handles API communication and response processing for CRUD operations on books.
 */

/**
 * Creates a new book in the library.
 * Validates the response and extracts book data from the response payload.
 *
 * @async
 * @param {APIRequestContext} request - Playwright API request context
 * @param {CreateBookPayload | Partial<CreateBookPayload>} payload - Book data to create
 * @param {string} [token] - Optional JWT token for authorization
 * @returns {Promise<Object>} Result object
 * @returns {number} .status - HTTP status code
 * @returns {boolean} .ok - Whether the request was successful
 * @returns {Object} .body - Response body
 * @returns {Book} [.book] - The created book object if successful
 */
export async function createBook(
  request: APIRequestContext,
  payload: CreateBookPayload | Partial<CreateBookPayload>,
  token?: string
): Promise<{
  status: number;
  ok: boolean;
  body: CreateBookResponse | any;
  book?: Book;
}> {
  const res = await BooksClient.createBook(request, payload, token);

  const status = res.status();
  const ok = res.ok();
  const body = await res.json().catch(() => null);

  return {
    status,
    ok,
    body,
    book: body && body.data ? body.data : undefined,
  };
}

/**
 * Retrieves a specific book by ID from the library.
 *
 * @async
 * @param {APIRequestContext} request - Playwright API request context
 * @param {string | number} id - The unique identifier of the book to retrieve
 * @returns {Promise<Object>} Result object
 * @returns {number} .status - HTTP status code
 * @returns {boolean} .ok - Whether the request was successful
 * @returns {Object} .body - Response body
 * @returns {Book} [.book] - The book object if found
 */
export async function getBookById(
  request: APIRequestContext,
  id: string | number
): Promise<{ status: number; ok: boolean; body: any; book?: Book }> {
  const res = await BooksClient.getBookById(request, id);

  const status = res.status();
  const ok = res.ok();
  const body = await res.json().catch(() => null);

  return {
    status,
    ok,
    body,
    book: body && body.data ? body.data : undefined,
  };
}

/**
 * Updates an existing book in the library.
 * Sends partial book data to update specific fields.
 *
 * @async
 * @param {APIRequestContext} request - Playwright API request context
 * @param {string | number} id - The unique identifier of the book to update
 * @param {Partial<CreateBookPayload>} payload - Partial book data to update
 * @param {string} [token] - Optional JWT token for authorization
 * @returns {Promise<Object>} Result object
 * @returns {number} .status - HTTP status code
 * @returns {boolean} .ok - Whether the request was successful
 * @returns {Object} .body - Response body
 * @returns {Book} [.book] - The updated book object if successful
 */
export async function updateBook(
  request: APIRequestContext,
  id: string | number,
  payload: Partial<CreateBookPayload>,
  token?: string
): Promise<{ status: number; ok: boolean; body: any; book?: Book }> {
  const res = await BooksClient.updateBook(request, id, payload, token);

  const status = res.status();
  const ok = res.ok();
  const body = await res.json().catch(() => null);

  return {
    status,
    ok,
    body,
    book: body && body.data ? body.data : undefined,
  };
}

/**
 * Deletes a book from the library.
 * Removes a book by ID and returns confirmation of deletion.
 *
 * @async
 * @param {APIRequestContext} request - Playwright API request context
 * @param {string | number} id - The unique identifier of the book to delete
 * @param {string} [token] - Optional JWT token for authorization
 * @returns {Promise<Object>} Result object
 * @returns {number} .status - HTTP status code
 * @returns {boolean} .ok - Whether the request was successful
 * @returns {Object} .body - Response body
 * @returns {string | number} [.deletedId] - The ID of the deleted book if successful
 */
export async function deleteBook(
  request: APIRequestContext,
  id: string | number,
  token?: string
): Promise<{
  status: number;
  ok: boolean;
  body: any;
  deletedId?: string | number;
}> {
  const res = await BooksClient.deleteBook(request, id, token);

  const status = res.status();
  const ok = res.ok();
  const body = await res.json().catch(() => null);

  return {
    status,
    ok,
    body,
    deletedId: (body && (body.deletedId || body.data?.id)) ?? undefined,
  };
}
/**
 * Partially updates a book resource using HTTP PATCH.
 * Accepts an optional payload and returns the raw response details.
 *
 * @async
 * @param {APIRequestContext} request - Playwright API request context
 * @param {string | number} id - The unique identifier of the book to patch
 * @param {Partial<CreateBookPayload>} [payload] - Partial fields to update
 * @param {string} [token] - Optional bearer token for authorization
 * @returns {Promise<Object>} Result object containing `status`, `ok`, and `body`
 *
 * @example
 * const result = await patchBook(request, 42, { title: 'Updated' }, token);
 * if (result.ok) console.log(result.body);
 */
export async function patchBook(
  request: APIRequestContext,
  id: string | number,
  payload?: Partial<CreateBookPayload>,
  token?: string
): Promise<{ status: number; ok: boolean; body: any }> {
  const res = await BooksClient.patchBook(request, id, payload, token);
  const status = res.status();
  const ok = res.ok();
  const body = await res.json().catch(() => null);
  return { status, ok, body };
}

/**
 * Sends a raw HTTP request via the BooksClient.requestRaw helper.
 * Useful for exercising endpoints that don't have a dedicated service method
 * or for ad-hoc requests in tests.
 *
 * @async
 * @param {APIRequestContext} request - Playwright API request context
 * @param {"get"|"post"|"put"|"patch"|"delete"|"head"} method - HTTP method to use
 * @param {string} path - Request path relative to the configured base URL
 * @param {Object} [options] - Optional request options (data, token, headers)
 * @returns {Promise<Object>} Result object containing `status`, `ok`, and `body`
 *
 * @example
 * const result = await rawRequest(request, 'get', '/books?limit=10');
 */
export async function rawRequest(
  request: APIRequestContext,
  method: "get" | "post" | "put" | "patch" | "delete" | "head",
  path: string,
  options?: { data?: any; token?: string; headers?: Record<string, string> }
): Promise<{ status: number; ok: boolean; body: any }> {
  const res = await BooksClient.requestRaw(request, method, path, options);
  const status = res.status();
  const ok = res.ok();
  const body = await res.json().catch(() => null);
  return { status, ok, body };
}
