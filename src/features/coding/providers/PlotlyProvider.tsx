'use client';

import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Data, Layout } from 'plotly.js';

// --- 型定義 ---
export interface PlotOutput {
  id: string;
  type: 'plot';
  title: string;
  data: {
    data: Data[];
    layout: Partial<Layout>;
  };
}

export interface TableOutput {
  id: string;
  type: 'table';
  title: string;
  data: {
    columns: string[];
    rows: (string | number)[][];
  };
}

export type Output = PlotOutput | TableOutput;

// --- コンテキストの型定義 ---
type PlotlyContextType = {
  outputs: Output[];
  addPlot: (
    title: string,
    plotData: { data: Data[]; layout: Partial<Layout> }
  ) => string; // idを返すように変更
  addTable: (
    title: string,
    tableData: { columns: string[]; rows: (string | number)[][] }
  ) => string; // idを返すように変更
  removeOutput: (id: string) => void;
  setActiveOutput: (id: string) => void;
  activeOutputId: string | null;
};

// --- コンテキストの作成 ---
const PlotlyContext = React.createContext<PlotlyContextType | undefined>(undefined);

// --- Providerコンポーネント ---
export const PlotlyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [outputs, setOutputs] = React.useState<Output[]>([]);
  const [activeOutputId, setActiveOutput] = React.useState<string | null>(null);

  const addPlot = React.useCallback(
    (title: string, plotData: { data: Data[]; layout: Partial<Layout> }) => {
      const newPlot: PlotOutput = {
        id: uuidv4(),
        type: 'plot',
        title,
        data: plotData,
      };
      setOutputs((prev) => [...prev, newPlot]);
      setActiveOutput(newPlot.id);
      return newPlot.id;
    },
    []
  );

  const addTable = React.useCallback(
    (
      title: string,
      tableData: { columns: string[]; rows: (string | number)[][] }
    ) => {
      const newTable: TableOutput = {
        id: uuidv4(),
        type: 'table',
        title,
        data: tableData,
      };
      setOutputs((prev) => [...prev, newTable]);
      setActiveOutput(newTable.id);
      return newTable.id;
    },
    []
  );

  const removeOutput = React.useCallback(
    (id: string) => {
      setOutputs((prev) => {
        const newOutputs = prev.filter((output) => output.id !== id);
        // アクティブなタブが削除された場合、隣のタブまたはnullにフォーカスを移す
        if (activeOutputId === id) {
          const removedIndex = prev.findIndex((output) => output.id === id);
          if (newOutputs.length === 0) {
            setActiveOutput(null);
          } else if (removedIndex >= newOutputs.length) {
            setActiveOutput(newOutputs[newOutputs.length - 1].id);
          } else {
            setActiveOutput(newOutputs[removedIndex].id);
          }
        }
        return newOutputs;
      });
    },
    [activeOutputId]
  );

  return (
    <PlotlyContext.Provider
      value={{
        outputs,
        addPlot,
        addTable,
        removeOutput,
        activeOutputId,
        setActiveOutput,
      }}
    >
      {children}
    </PlotlyContext.Provider>
  );
};

// --- カスタムフック ---
export const usePlotly = () => {
  const context = React.useContext(PlotlyContext);
  if (!context) {
    throw new Error('usePlotly must be used within a PlotlyProvider');
  }
  return context;
};
