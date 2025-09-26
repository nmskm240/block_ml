import React from 'react';

import { App } from '@/components';
import { AppThemeProvider } from '@/contexts/ThemeContext';
import '@/styles/globals.css';

import type { Metadata } from 'next';

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'Moduloxs',
  description: 'Block ML is a block programming environment for data analysis.',
};

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
