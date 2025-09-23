'use client';

import React from 'react';

import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';

import '@/styles/globals.css';
import { Header } from '@/components';
import { AppThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { PyodideProvider } from '@/lib/pyodide';

function App({ children }: { children: React.ReactNode }) {
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
        <PyodideProvider>{children}</PyodideProvider>
      </div>
    </MuiThemeProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <AppThemeProvider>
          <App>{children}</App>
        </AppThemeProvider>
      </body>
    </html>
  );
}
