'use client';

import React from 'react';

import { Box, List } from '@mui/material';
import { match } from 'ts-pattern';

import { usePyodide } from '@/lib/pyodide';
import { Entry } from '@/lib/pyodide/types';

import { ErrorEntryItem } from './ErrorEntryItem';
import { GraphEntryItem } from './GraphEntryItem';
import { LogEntryItem } from './LogEntryItem';

export function PyodideConsole() {
  const { logService } = usePyodide();
  const [entries, setEntries] = React.useState<Entry[]>([]); // Local state for entries

  React.useEffect(() => {
    if (!logService) return;

    const unsubscribe = logService.subscribe('change', (newEntries) => {
      setEntries(newEntries);
    });

    setEntries(logService.getEntries());

    return () => {
      unsubscribe();
    };
  }, [logService]);

  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries.length]);

  return (
    <List dense>
      {entries.map((entry) =>
        match(entry.content.type)
          .with('log', () => <LogEntryItem key={entry.id} entry={entry} />)
          .with('graph', () => <GraphEntryItem key={entry.id} entry={entry} />)
          .with('error', () => <ErrorEntryItem key={entry.id} entry={entry} />)
          .exhaustive(),
      )}
      <Box ref={bottomRef} />
    </List>
  );
}
