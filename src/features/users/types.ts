import { z } from 'zod';

export const UserInfoSchema = z.object({
  id: z.cuid2(),
  name: z.string(),
  avatarUrl: z.url(),
});

export type Userinfo = z.infer<typeof UserInfoSchema>;
