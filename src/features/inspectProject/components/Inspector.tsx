'use client';

import React from 'react';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Tab,
  Tabs,
} from '@mui/material';

import { usePyodide } from '@/lib/pyodide';
import { Entry } from '@/lib/pyodide/types';

import { ClearLogButton } from './ClearLogButton';
import { CodeViewer } from './CodeViewer';
import { PyodideConsole } from './PyodideConsole';

function a11yProps(index: number) {
  return {
    id: `inspector-tab-${index}`,
    'aria-controls': `inspector-tabpanel-${index}`,
  };
}

export function Inspector() {
  const [value, setValue] = React.useState(0);
  const { logService } = usePyodide();
  const [entries, setEntries] = React.useState<Entry[]>([]);

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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <CardHeader
        title="Inspector"
        sx={{ pb: 1 }}
        action={value === 0 ? <ClearLogButton /> : null}
      />
      <Divider />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="inspector tabs">
          <Tab label="Console" {...a11yProps(0)} />
          <Tab label="Python Script" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CardContent
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 0,
          '&:last-child': {
            pb: 0,
          },
        }}
      >
        {value === 0 && (
          <div role="tabpanel" id="inspector-tabpanel-0" style={{ padding: '8px 16px' }}>
            <PyodideConsole entries={entries} />
          </div>
        )}
        {value === 1 && (
          <div role="tabpanel" id="inspector-tabpanel-1" style={{ height: '100%' }}>
            <CodeViewer />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
