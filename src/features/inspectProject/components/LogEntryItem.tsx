'use client';

import React from 'react';

import { ListItem, ListItemText, Typography } from '@mui/material';

import { Entry, LogType } from '@/lib/pyodide/types';

type Props = {
  entry: Entry;
};

export function LogEntryItem({ entry }: Props) {
  if (entry.content.type !== 'log') {
    return null;
  }
  const log = entry.content.payload;

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        color: log.type === LogType.Error ? '#b00020' : 'inherit',
        bgcolor:
          log.type === LogType.Error ? 'rgba(255,0,0,0.05)' : 'transparent',
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
              [{entry.timestamp.toLocaleTimeString()}]
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
