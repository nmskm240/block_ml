'use client';

import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export function Header() {
  const { data: session } = useSession();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link
            href="/"
            style={{ textDecoration: 'none', color: 'inherit' }}
          ></Link>
        </Typography>
        {session ? (
          <>
            <Typography sx={{ mr: 2 }}>{session.user?.name}</Typography>
            <Button color="inherit" onClick={() => signOut()}>
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Link color="inherit" href="/auth/sign-in">
              Sign In
            </Link>
            <Link color="inherit" href="/auth/sign-up">
              Sign Up
            </Link>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
