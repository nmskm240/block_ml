import z from 'zod';

export const AssetSchema = z.object({
  id: z.cuid2(),
  name: z.string().min(1),
  path: z.url(),
});

export type Asset = z.infer<typeof AssetSchema>;
