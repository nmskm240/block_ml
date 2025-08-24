import { z } from 'zod';

export const UserInfoSchema = z.object({
  id: z.cuid2(),
  name: z.string(),
  avatarUrl: z.url(),
});

export type Userinfo = z.infer<typeof UserInfoSchema>;

//#region sing-in

export const SignInSchema = z.object({
  email: z.email('Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignInParams = z.infer<typeof SignInSchema>;

//#endregion
