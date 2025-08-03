'use client';

import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

// サーバコンポーネントでいい気がする
export const Header = () => {
  // const { data: session } = useSession();

  return (
    <>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link
              href="/"
              style={{ textDecoration: 'none', color: 'inherit' }}
            ></Link>
          </Typography>
          {/* {session ? (
            <>
              <Typography sx={{ mr: 2 }}>{session.user?.name}</Typography>
              <Button color="inherit" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : ( */}
            <>
              <Button color="inherit" component={Link} href="/auth/signIn">
                Sign In
              </Button>
              <Button color="inherit" component={Link} href="/auth/signUp">
                Sign Up
              </Button>
            </>
          {/* )} */}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};
