'use client';

import React from 'react';

import { Box, ListItem, Typography } from '@mui/material';

import { PlotlyGraph } from '@/components/PlotlyGraph';
import { Entry } from '@/lib/pyodide/types';

type Props = {
  entry: Entry;
};

export function GraphEntryItem({ entry }: Props) {
  if (entry.content.type !== 'graph') {
    return null;
  }

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        flexDirection: 'column',
        borderRadius: 1,
        py: 0.5,
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Typography
          component="span"
          variant="body2"
          sx={{ color: '#999', mr: 1 }}
        >
          [{entry.createdAt.toLocaleTimeString()}]
        </Typography>
      </Box>
      <Box sx={{ width: '100%', mt: 1, overflowX: 'auto' }}>
        <PlotlyGraph figure={entry.content.figure} />
      </Box>
    </ListItem>
  );
}
