import React from "react";
import Plot from "react-plotly.js";
import { usePlotViewer } from "../providers/PlotViewerProvider";

export const PlotView: React.FC = () => {
  const { plotData } = usePlotViewer();

  if (!plotData) return <p>グラフはまだありません。</p>;

  return (
    <Plot
      data={[
        {
          x: plotData!.x,
          y: plotData!.y,
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "red" },
        },
        { type: "bar", x: plotData!.x, y: plotData!.y },
      ]}
      layout={{ title: { text: "A Fancy Plot" } }}
    />
  );
};
