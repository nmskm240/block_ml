import { z } from 'zod';

/**
 * A Zod schema that preprocesses a string by attempting to parse it as JSON.
 * If parsing fails, it returns a special `z.NEVER` type to invalidate the schema.
 */
export const JsonFromString = z.preprocess(
  (val) => {
    if (typeof val !== 'string' || val.trim() === '') {
      return val; // Pass through non-strings or empty strings
    }
    try {
      return JSON.parse(val);
    } catch {
      return z.NEVER; // Invalidate schema if JSON parsing fails
    }
  },
  z.any()
);
