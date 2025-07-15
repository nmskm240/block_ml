import type { Datum } from "plotly.js";
import React, { createContext, useContext, useState } from "react";

export interface PlotData {
  x: Datum[];
  y: Datum[];
  type: "bar" | "scatter" | "line";
}

type PlotViewerContextType = {
  plotData: PlotData | null;
  setPlotData: (data: PlotData) => void;
};

const PlotViewerContext = createContext<PlotViewerContextType | undefined>(
  undefined
);

export const PlotViewerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [plotData, setData] = useState<PlotData | null>(null);

  const setPlotData = (data: PlotData) => {
    setData(data);
  };

  return (
    <PlotViewerContext.Provider value={{ plotData, setPlotData }}>
      {children}
    </PlotViewerContext.Provider>
  );
};

export const usePlotViewer = () => {
  const ctx = useContext(PlotViewerContext);
  if (!ctx) {
    throw new Error("usePlotViewer must be used within PlotViewerProvider");
  }
  return ctx;
};
