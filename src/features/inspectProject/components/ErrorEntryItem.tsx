import { ListItem, ListItemText, Typography } from '@mui/material';

import { Entry } from '@/lib/pyodide/types';

type Props = {
  entry: Entry;
};

export function ErrorEntryItem({ entry }: Props) {
  if (entry.content.type !== 'error') {
    return null;
  }

  return (
    <ListItem sx={{ p: 0 }}>
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
              sx={{ fontFamily: 'monospace', color: 'error.main' }}
            >
              {entry.content.message}
            </Typography>
          </>
        }
      />
    </ListItem>
  );
}
