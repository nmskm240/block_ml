'use client';

import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';
import { Header } from '@/components';
import { ProjectApiClientProvider } from '@/features/projects/providers/ApiClientProvider';
import { UserApiClientProvider } from '@/features/users/providers/ApiClientProvider';

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
            <UserApiClientProvider>
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
            </UserApiClientProvider>
          </ProjectApiClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
