import { z } from 'zod';
import { UserInfoSchema } from '../types';

export const EditUserInfoRequestSchema = z.object({
  name: z.string().min(1),
  icon: z.instanceof(File),
});

export type EditUserInfoRequest = z.infer<typeof EditUserInfoRequestSchema>;

export const EditUserInfoResponseSchema = z.object({
  updatedInfo: UserInfoSchema,
});

export type EdituserInfoResponse = z.infer<typeof EditUserInfoResponseSchema>;
