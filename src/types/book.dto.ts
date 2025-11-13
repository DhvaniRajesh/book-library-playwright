export type CreateBookPayload = {
  title: string;
  author: string;
  isbn?: string;
  publishedYear?: number;
  available?: boolean;
};

export type Book = {
  id: string | number;
  title: string;
  author: string;
  isbn?: string;
  publishedYear?: number;
  available?: boolean;
};

export type CreateBookResponse = {
  success: boolean;
  data: Book;
};
