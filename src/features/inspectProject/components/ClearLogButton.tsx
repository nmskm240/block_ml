'use client';

import React from 'react';

import { Delete } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';

import { usePyodide } from '@/lib/pyodide';

export function ClearLogButton() {
  const { logService } = usePyodide();
  return (
    <Box>
      <Tooltip title="ログをクリア">
        <IconButton onClick={() => logService?.clear()}>
          <Delete />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
