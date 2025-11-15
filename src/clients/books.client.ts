import type { APIRequestContext, APIResponse } from "@playwright/test";
import type { CreateBookPayload } from "../types/book.dto";

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
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    return request.post("/books", {
      data: payload,
      headers,
    });
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
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    return request.put(`/books/${id}`, {
      data: payload,
      headers,
    });
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
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    return request.delete(`/books/${id}`, {
      headers,
    });
  },
};
