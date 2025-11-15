import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { CreateBookPayload } from '../types/book.dto';

export const BooksClient = {
  createBook: async (
    request: APIRequestContext,
    payload: CreateBookPayload | Partial<CreateBookPayload>,
    token?: string
  ): Promise<APIResponse> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return request.post('/books', {
      data: payload,
      headers
    });
  },

  getBookById: async (request: APIRequestContext, id: string | number) => {
    return request.get(`/books/${id}`);
  }
};
