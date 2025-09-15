'use client';

import { useState } from 'react';

import { InfoOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { AboutModal } from './AboutModal';

export function AboutButton() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClickOpen}>
        <InfoOutlined />
      </IconButton>
      <AboutModal open={open} onClose={handleClose} />
    </>
  );
}
