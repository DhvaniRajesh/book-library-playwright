import type { APIRequestContext } from "@playwright/test";
import { BooksClient } from "../clients/books.client";
import type {
  CreateBookPayload,
  CreateBookResponse,
  Book,
} from "../types/book.dto";

export async function createBook(
  request: APIRequestContext,
  payload: CreateBookPayload,
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
