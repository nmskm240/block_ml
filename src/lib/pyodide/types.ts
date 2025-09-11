import { z } from 'zod';

import { PlotlyFigureSchema } from '@/lib/plotly/types';

export const LogContentSchema = z.object({
  type: z.literal('log'),
  message: z.string(),
});

export const GraphContentSchema = z.object({
  type: z.literal('graph'),
  targetId: z.string(),
  figure: PlotlyFigureSchema,
});

export const ErrorContentSchema = z.object({
  type: z.literal('error'),
  message: z.string(),
});

export const ContentSchema = z.union([
  LogContentSchema,
  GraphContentSchema,
  ErrorContentSchema,
]);

export type LogContent = z.infer<typeof LogContentSchema>;
export type GraphContent = z.infer<typeof GraphContentSchema>;
export type ErrorContent = z.infer<typeof ErrorContentSchema>;
export type Content = z.infer<typeof ContentSchema>;

export const EntrySchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  content: ContentSchema,
});

export type Entry = z.infer<typeof EntrySchema>;
