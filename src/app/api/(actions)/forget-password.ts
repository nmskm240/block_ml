import z from 'zod';

export default async function forgetPassword(params: ForgetPasswordParams) {
  const { email } = ForgetPasswordSchema.parse(params);
  
}

const ForgetPasswordSchema = z.object({
  email: z.email(),
});

export type ForgetPasswordParams = z.infer<typeof ForgetPasswordSchema>;
