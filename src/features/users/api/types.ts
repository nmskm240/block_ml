import { z } from 'zod';

export const UploadUserIconRequestSchema = z.object({
  file: z.instanceof(File),
});

export type UploadUserIconRequest = z.infer<typeof UploadUserIconRequestSchema>;

export interface UploadUserIconResponse {
  imageUrl: string;
}