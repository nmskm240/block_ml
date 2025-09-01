import React from 'react';

import { PyodideProvider } from '@/lib/pyodide';

export default function ProjectsRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PyodideProvider>{children}</PyodideProvider>;
}
