import { AppBar, Toolbar, Typography } from '@mui/material';

import Link from 'next/link';


import { SearchBox, SignOutButton } from '@/components';
import { auth } from '@/lib/nextAuth';

export async function Header() {
  const session = await auth();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Block ML
          </Link>
        </Typography>
        <SearchBox />
        {session ? (
          <>
            <Typography sx={{ ml: 2, mr: 2 }}>{session.user?.name}</Typography>
            <SignOutButton />
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
