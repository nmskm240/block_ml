import 'reflect-metadata';
import '@/lib/di/registry';

import React from 'react';

import '@/styles/globals.css';
import { Header } from '@/components';
import { PyodideProvider } from '@/lib/pyodide';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <PyodideProvider>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
            }}
          >
            <Header />
            {children}
          </div>
        </PyodideProvider>
      </body>
    </html>
  );
}
