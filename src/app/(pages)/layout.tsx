import 'reflect-metadata';
import { SessionProvider } from 'next-auth/react';

import '@/styles/globals.css';
import { Header } from '@/components';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <SessionProvider>
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
        </SessionProvider>
      </body>
    </html>
  );
}
