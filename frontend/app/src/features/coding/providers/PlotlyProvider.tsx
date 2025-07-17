import type { Data, Layout } from "plotly.js";
import React, { createContext, useContext, useState } from "react";

export interface PlotlyData {
  data: Data[];
  layout: Partial<Layout>;
}

type PlotlyContextType = {
  plotData: PlotlyData | null;
  setPlotData: (data: PlotlyData) => void;
};

const PlotlyContext = createContext<PlotlyContextType | undefined>(
  undefined
);

export const PlotlyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [plotData, setData] = useState<PlotlyData | null>(null);

  const setPlotData = (data: PlotlyData) => {
    setData(data);
  };

  return (
    <PlotlyContext.Provider value={{ plotData, setPlotData }}>
      {children}
    </PlotlyContext.Provider>
  );
};

export const usePlotly = () => {
  const ctx = useContext(PlotlyContext);
  if (!ctx) {
    throw new Error("usePlotly must be used within PlotlyProvider");
  }
  return ctx;
};
