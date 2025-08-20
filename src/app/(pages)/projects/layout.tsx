import { PyodideProvider } from '@/lib/pyodide/providers/PyodideProvider';

export default function ProjectsRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PyodideProvider>{children}</PyodideProvider>;
}
