/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';

import Script from 'next/script';

import { PlotlyFigureSchema } from '@/lib/plotly/types';

import { FileService, LogService } from '../services';

import type { PyodideInterface } from 'pyodide';

const PYODIDE_VERSION = process.env.NEXT_PUBLIC_PYODIDE_VERSION!;
const PYODIDE_CDN = process.env.NEXT_PUBLIC_PYODIDE_CDN!;
const PYODIDE_URL = `${PYODIDE_CDN}/v${PYODIDE_VERSION}/full/pyodide.js`;
const PYODIDE_INDEX_URL = `${PYODIDE_CDN}/v${PYODIDE_VERSION}/full/`;
const INDEXED_PACKAGES = process.env
  .NEXT_PUBLIC_PYODIDE_INDEXED_PACKAGES!.split(',')
  .map((p) => p.trim());
const PYPI_PACKAGES = process.env
  .NEXT_PUBLIC_PYODIDE_PYPI_PACKAGES!.split(',')
  .map((p) => p.trim());

type ContextType = {
  pyodideRef: React.RefObject<PyodideInterface | null>;
  fs: FileService | undefined;
  isLoading: boolean;
  logService: LogService | undefined;
};

type PyodideProviderProps = {
  children: React.ReactNode;
};

const Context = React.createContext<ContextType | undefined>(undefined);

export function PyodideProvider({ children }: PyodideProviderProps) {
  const pyodideRef = React.useRef<PyodideInterface>(null);
  const [fs, setFs] = React.useState<FileService | undefined>(undefined);
  const [logService, setLogService] = React.useState<LogService | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = React.useState(true);

  const loadPyodideEnv = React.useCallback(async () => {
    setIsLoading(true);

    if (typeof window === 'undefined' || !(window as any).loadPyodide) {
      throw new Error('Pyodide script not loaded');
    }

    pyodideRef.current = await (window as any).loadPyodide({
      indexURL: PYODIDE_INDEX_URL,
    });

    if (!pyodideRef.current) {
      throw new Error('Failed to load pyodide');
    }

    if (INDEXED_PACKAGES.length) {
      await pyodideRef.current.loadPackage(INDEXED_PACKAGES);
    }
    if (PYPI_PACKAGES.length) {
      const micropip = pyodideRef.current.pyimport('micropip');
      await micropip.install(PYPI_PACKAGES);
    }

    setFs(new FileService(pyodideRef.current));
    setLogService(new LogService());
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (isLoading || !pyodideRef.current || !logService) return;

    pyodideRef.current.setStdout({
      batched: (message: string) => {
        const parsed = PlotlyFigureSchema.safeParse(message);
        if (parsed.success) {
          logService.addGraph({ figure: parsed.data });
        } else {
          logService.addLog({ message });
        }
      },
    });

    pyodideRef.current.setStderr({
      batched: (message: string) => {
        logService.addError({ message });
      },
    });
  }, [isLoading, logService]);

  return (
    <>
      <Script
        src={PYODIDE_URL}
        strategy="afterInteractive"
        onLoad={loadPyodideEnv}
      />
      <Context.Provider value={{ pyodideRef, fs, logService, isLoading }}>
        {children}
      </Context.Provider>
    </>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePyodide = () => {
  const ctx = React.useContext(Context);
  if (!ctx) throw new Error('usePyodide must be used within PyodideProvider');
  return ctx;
};
