import { PlotlyProvider } from '@/features/coding/providers';
import { PyodideProvider } from '@/lib/pyodide/providers/PyodideProvider';
import '@/styles/globals.css';

export default function ProjectsRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PlotlyProvider>
        <PyodideProvider>{children}</PyodideProvider>
      </PlotlyProvider>
    </>
  );
}
