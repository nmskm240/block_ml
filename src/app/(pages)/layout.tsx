'use client';

import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';
import { Header } from '@/components';
import { ProjectApiClientProvider } from '@/features/projects/providers/ApiClientProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <SessionProvider>
          <ProjectApiClientProvider>
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
          </ProjectApiClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
