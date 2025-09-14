'use client';

import { Button } from '@mui/material';
import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return <Button color="inherit" onClick={() => signOut()}>Sign Out</Button>;
}
