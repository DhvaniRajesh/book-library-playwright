import type { ZodType } from 'zod';

/**
 * Validate an object against a Zod schema.
 * Throws a detailed Error when validation fails
 */
export function validateOrThrow<T>(schema: ZodType<T>, value: unknown, context = ''): T {
  const result = schema.safeParse(value);
  if (result.success) return result.data;

  const message = [
    context ? `Validation failed (${context}):` : 'Validation failed:',
    ...result.error.issues.map(
      e => `- ${e.path.join('.') || '<root>'}: ${e.message}`
    ),
  ].join('\n');

  throw new Error(message);
}
