import { z } from 'zod';

export const SignUpSchema = z.object({
  name: z.string().min(1, 'User name is required'),
  email: z.email('Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignUpParams = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.email('Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignInParams = z.infer<typeof SignInSchema>;
