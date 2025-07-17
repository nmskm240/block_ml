import React from "react";
import Plot from "react-plotly.js";
import { usePlotly } from "../providers/PlotlyProvider";

export const PlotView: React.FC = () => {
  const { plotData } = usePlotly();

  if (!plotData) return <p>グラフはまだありません。</p>;

  return (
    <Plot
      data={plotData.data}
      layout={plotData.layout}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler
    />
  );
};
