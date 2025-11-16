import type { APIRequestContext, APIResponse } from "@playwright/test";
import type { CreateBookPayload } from "../types/book.dto";
import { addRequestOptions } from './http.helpers';

/**
 * HTTP client for book-related API endpoints.
 * Provides methods for CRUD operations on books in the library.
 *
 * @const {Object} BooksClient
 */

/**
 * Creates a new book in the library.
 * Sends a POST request with book details. Requires authentication token for authorized endpoints.
 *
 * @async
 * @param {APIRequestContext} request - Playwright API request context
 * @param {CreateBookPayload | Partial<CreateBookPayload>} payload - Book data to create
 * @param {string} [token] - Optional JWT token for authorization
 * @returns {Promise<APIResponse>} API response with created book details
 */
export const BooksClient = {
  createBook: async (
    request: APIRequestContext,
    payload: CreateBookPayload | Partial<CreateBookPayload>,
    token?: string
  ): Promise<APIResponse> => {
    const opts = addRequestOptions(payload, token);
    return request.post("/books", opts);
  },

  /**
   * Retrieves a specific book by ID.
   * Fetches book details from the library.
   *
   * @async
   * @param {APIRequestContext} request - Playwright API request context
   * @param {string | number} id - The unique identifier of the book
   * @returns {Promise<APIResponse>} API response with book details
   */
  getBookById: async (request: APIRequestContext, id: string | number) => {
    return request.get(`/books/${id}`);
  },

  /**
   * Updates an existing book in the library.
   * Sends a PUT request to update book details. Requires authentication token for authorized endpoints.
   *
   * @async
   * @param {APIRequestContext} request - Playwright API request context
   * @param {string | number} id - The unique identifier of the book to update
   * @param {Partial<CreateBookPayload>} payload - Partial book data to update
   * @param {string} [token] - Optional JWT token for authorization
   * @returns {Promise<APIResponse>} API response with updated book details
   */
  updateBook: async (
    request: APIRequestContext,
    id: string | number,
    payload: Partial<CreateBookPayload>,
    token?: string
  ): Promise<APIResponse> => {
    const opts = addRequestOptions(payload, token);
    return request.put(`/books/${id}`, opts);
  },

  /**
   * Deletes a book from the library.
   * Sends a DELETE request to remove a book. Requires authentication token for authorized endpoints.
   *
   * @async
   * @param {APIRequestContext} request - Playwright API request context
   * @param {string | number} id - The unique identifier of the book to delete
   * @param {string} [token] - Optional JWT token for authorization
   * @returns {Promise<APIResponse>} API response confirming deletion
   */
  deleteBook: async (
    request: APIRequestContext,
    id: string | number,
    token?: string
  ): Promise<APIResponse> => {
    const opts = addRequestOptions(undefined, token);
    return request.delete(`/books/${id}`, opts);
  },

  /**
   * Updates an existing book in the library.
   * Sends a PATCH request to update book details. Requires authentication token for authorized endpoints.
   *
   * @async
   * @param {APIRequestContext} request - Playwright API request context
   * @param {string | number} id - The unique identifier of the book to update
   * @param {Partial<CreateBookPayload>} payload - Partial book data to update
   * @param {string} [token] - Optional JWT token for authorization
   * @returns {Promise<APIResponse>} API response with updated book details
   */
  patchBook: async (
    request: APIRequestContext,
    id: string | number,
    payload?: Partial<CreateBookPayload>,
    token?: string
  ): Promise<APIResponse> => {
    const opts = addRequestOptions(payload, token);
    return request.patch(`/books/${id}`, opts);
  },

  /**
   * Generic raw request helper for arbitrary HTTP methods and paths.
   * Useful for exercising endpoints that don't have a dedicated client method
   * or for tests that need to craft custom requests.
   *
   * @async
   * @param {APIRequestContext} request - Playwright API request context
   * @param {"get"|"post"|"put"|"patch"|"delete"|"head"} method - HTTP method to use
   * @param {string} path - Request path (relative to baseURL)
   * @param {Object} [options] - Optional request options
   * @param {any} [options.data] - Optional body payload for methods that accept a body
   * @param {string} [options.token] - Optional bearer token for Authorization header
   * @param {Record<string,string>} [options.headers] - Additional headers to include
   * @returns {Promise<APIResponse>} The raw Playwright API response
   */
  requestRaw: async (
    request: APIRequestContext,
    method: "get" | "post" | "put" | "patch" | "delete" | "head",
    path: string,
    options?: { data?: any; token?: string; headers?: Record<string, string> }
  ): Promise<APIResponse> => {
    const opts = addRequestOptions(options?.data, options?.token, options?.headers);
    switch (method) {
      case "get":
        return request.get(path, opts);
      case "post":
        return request.post(path, opts);
      case "put":
        return request.put(path, opts);
      case "patch":
        return request.patch(path, opts);
      case "delete":
        return request.delete(path, opts);
      case "head":
        return request.head(path, opts);
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  },
};
