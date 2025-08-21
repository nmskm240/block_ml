'use client';

import signUp, { SignUpParams, SignUpSchema } from '@/app/api/(actions)/signUp';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Card, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpParams>({
    resolver: zodResolver(SignUpSchema),
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: SignUpParams) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await signUp(data);
      setSuccessMessage('登録完了しました');
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      }
    } finally {
      reset();
    }
  };

  return (
    <Card variant="outlined">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          maxWidth: 400,
          mx: 'auto',
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h5" component="h1" align="center">
          サインアップ
        </Typography>

        <TextField
          label="ユーザー名"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
        />

        <TextField
          label="メールアドレス"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
        />

        <TextField
          label="パスワード"
          type="password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          fullWidth
        />

        {serverError && <Alert severity="error">{serverError}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? '登録中...' : '登録する'}
        </Button>
      </Box>
    </Card>
  );
}
