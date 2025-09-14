'use client';

import React from 'react';

import { ListItem, ListItemText, Typography } from '@mui/material';

import { Entry } from '@/lib/pyodide/types';

type Props = {
  entry: Entry;
};

export function LogEntryItem({ entry }: Props) {
  if (entry.content.type !== 'log') {
    return null;
  }
  const log = entry.content;

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        color: 'inherit',
        bgcolor: 'transparent',
        borderRadius: 1,
        py: 0.5,
        width: '100%',
      }}
    >
      <ListItemText
        primary={
          <>
            <Typography
              component="span"
              variant="body2"
              sx={{ color: '#999', mr: 1 }}
            >
              [{entry.createdAt.toLocaleTimeString()}]
            </Typography>
            <Typography
              component="span"
              variant="body2"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {log.message}
            </Typography>
          </>
        }
      />
    </ListItem>
  );
}
