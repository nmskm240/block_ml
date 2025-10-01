'use client';

import React from 'react';

import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';

import { Header } from '@/components';
import { useTheme } from '@/contexts/ThemeContext';
import { PyodideProvider } from '@/lib/pyodide';

export function App({ children }: { children: React.ReactNode }) {
  const { themeMode } = useTheme();

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
        },
        components: {
          MuiCardHeader: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor:
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[800],
              }),
            },
          },
        },
      }),
    [themeMode]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            '--divider-color': theme.palette.divider,
          },
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <Header />
        <div style={{ flex: 1, minHeight: 0 }}>
          <PyodideProvider>{children}</PyodideProvider>
        </div>
      </div>
    </MuiThemeProvider>
  );
}
