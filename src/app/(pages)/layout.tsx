'use client';

import React from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';

import '@/styles/globals.css';
import { Header } from '@/components';
import { PyodideProvider } from '@/lib/pyodide';
import { AppThemeProvider, useTheme } from '@/contexts/ThemeContext';

function App({ children }: { children: React.ReactNode }) {
  const { themeMode } = useTheme();

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
        },
      }),
    [themeMode]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
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
