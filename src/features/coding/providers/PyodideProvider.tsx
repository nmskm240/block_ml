'use client';

import React from 'react';
import { type PyodideInterface } from 'pyodide';
import { usePlotly } from '@/features/coding/providers';
import Script from 'next/script';

type PyodideContextType = {
  pyodideRef: React.MutableRefObject<PyodideInterface | null>;
  isLoading: boolean;
};

const PyodideContext = React.createContext<PyodideContextType | undefined>(
  undefined
);

export const PyodideProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pyodideRef = React.useRef<any | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { addPlot, addTable } = usePlotly();

  React.useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      const waitForPyodide = () =>
        new Promise<void>((resolve, reject) => {
          const interval = setInterval(() => {
            // npmのloadPyodideはssrと相性が悪いためCDNから読み込む
            if ((window as any).loadPyodide) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
          setTimeout(
            () => reject(new Error('Timeout: pyodide not loaded')),
            5000
          );
        });

      await waitForPyodide();

      pyodideRef.current = await (window as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.28.0/full/',
      });

      await pyodideRef.current.loadPackage([
        'pandas',
        'scikit-learn',
        'micropip',
      ]);
      const micropip = pyodideRef.current.pyimport('micropip');
      await micropip.install('plotly');

      pyodideRef.current.globals.set(
        '__show_plot_json',
        (title: string, json: string) => {
          const plotData = JSON.parse(json);
          addPlot(title, plotData);
        }
      );

      pyodideRef.current.globals.set(
        '__show_table_json',
        (title: string, json: string) => {
          const parsedData = JSON.parse(json);
          const tableData = {
            columns: parsedData.columns,
            rows: parsedData.data,
          };
          addTable(title, tableData);
        }
      );

      setIsLoading(false);
    };

    load().catch((e) => {
      console.error('Failed to load pyodide', e);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.28.0/full/pyodide.js"
        strategy="afterInteractive"
      />
      <PyodideContext.Provider value={{ pyodideRef, isLoading }}>
        {children}
      </PyodideContext.Provider>
    </>
  );
};

export const usePyodide = () => {
  const ctx = React.useContext(PyodideContext);
  if (!ctx) throw new Error('usePyodide must be used within PyodideProvider');
  return ctx;
};
