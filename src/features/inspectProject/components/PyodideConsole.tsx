'use client';

import React from 'react';

import { Box, List } from '@mui/material';
import { match } from 'ts-pattern';

import { Entry } from '@/lib/pyodide/types';

import { ErrorEntryItem } from './ErrorEntryItem';
import { GraphEntryItem } from './GraphEntryItem';
import { LogEntryItem } from './LogEntryItem';

type Props = {
  entries: Entry[];
};

export function PyodideConsole({ entries }: Props) {
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
