import { AppBar, Toolbar, Typography, Box } from '@mui/material';

import Image from 'next/image';

import { AboutButton } from './AboutButton';

export function Header() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/favicon.ico"
            alt="Block ML logo"
            width={28}
            height={28}
            style={{ marginRight: '12px' }}
          />
          <Typography variant="h6" component="div">
            Modulo blocks
          </Typography>
        </Box>
        <AboutButton />
      </Toolbar>
    </AppBar>
  );
}
