import '@/styles/globals.css';
import {
  PlotlyProvider,
  PyodideProvider,
  UploadFileProvider,
} from '@/features/coding/providers';

export default function ProjectsRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <PlotlyProvider>
          <PyodideProvider>
            <UploadFileProvider>{children}</UploadFileProvider>
          </PyodideProvider>
        </PlotlyProvider>
      </body>
    </html>
  );
}
