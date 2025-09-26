'use client';

import { useState, useEffect } from 'react';

import { Brightness4, Brightness7 } from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  TextField,
  Box,
  IconButton,
  Typography,
} from '@mui/material';

import Image from 'next/image';

import { useTheme } from '@/contexts/ThemeContext';

import { AboutButton } from './AboutButton';

export function Header() {
  const { themeMode, toggleTheme } = useTheme();

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
            Moduloxs
          </Typography>
        </Box>
        <Box>
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <AboutButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
