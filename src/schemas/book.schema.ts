import { z } from 'zod';

const isbnRegex = /^[0-9\s-]{10,17}$/;

export const BookSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(v => v.toString()),
  title: z.string().min(1),
  author: z.string().min(1),
  isbn: z.string().regex(isbnRegex),
  publishedYear: z.number().int(),
  available: z.boolean()
});

export const BookResponseSchema = z.object({
  success: z.boolean(),
  data: BookSchema,
  message: z.string()
});

export const PartialBookSchema = BookSchema.partial();

export const PartialBookResponseSchema = BookResponseSchema.partial();

export const BookListResponseSchema = z.object({
  success: z.boolean(),
  count: z.number(),
  data: z.array(BookSchema)
});

export type Book = z.infer<typeof BookSchema>;
export type BookResponse = z.infer<typeof BookResponseSchema>;
