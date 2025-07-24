"use client";

import React from "react";
import dynamic from 'next/dynamic'
// Plotlyはクライアント限定でロード
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import { usePlotly, type PlotOutput, type TableOutput } from "../providers";
import { Close } from "@mui/icons-material";

// --- 個別のビューアコンポーネント ---
const PlotView: React.FC<{ output: PlotOutput }> = ({ output }) => (
  <Plot
    data={output.data.data}
    layout={output.data.layout}
    style={{ width: "100%", height: "100%" }}
    useResizeHandler
  />
);

const TableView: React.FC<{ output: TableOutput }> = ({ output }) => (
  <div style={{ padding: "1rem", height: "100%", overflow: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {output.data.columns.map((col) => (
            <th
              key={col}
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
                backgroundColor: "#f2f2f2",
              }}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {output.data.rows.map((row, i) => (
          <tr key={i} style={{ backgroundColor: "#f9f9f9" }}>
            {row.map((cell, j) => (
              <td key={j} style={{ border: "1px solid #ddd", padding: "8px" }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- メインのビューアコンポーネント ---
export const PlotlyViewer: React.FC = () => {
  const { outputs, activeOutputId, setActiveOutput, removeOutput } =
    usePlotly();

  if (outputs.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        出力はまだありません。
      </p>
    );
  }

  const activeOutput = outputs.find((o) => o.id === activeOutputId);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* タブヘッダー */}
      <div
        style={{
          flexShrink: 0,
          borderBottom: "1px solid #ccc",
          display: "flex",
        }}
      >
        {outputs.map((output) => (
          <div
            key={output.id}
            onClick={() => setActiveOutput(output.id)}
            style={{
              padding: "10px 15px",
              cursor: "pointer",
              borderBottom:
                output.id === activeOutputId ? "2px solid blue" : "none",
              backgroundColor:
                output.id === activeOutputId ? "#f0f0f0" : "transparent",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span>{output.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation(); // 親のonClickイベントを発火させない
                removeOutput(output.id);
              }}
              style={{
                marginLeft: "10px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              <Close fontSize="small" />
            </button>
          </div>
        ))}
      </div>

      {/* タブコンテンツ */}
      <div style={{ flexGrow: 1, overflow: "auto" }}>
        {activeOutput && (
          <div style={{ height: "100%" }}>
            {activeOutput.type === "plot" && (
              <PlotView output={activeOutput as PlotOutput} />
            )}
            {activeOutput.type === "table" && (
              <TableView output={activeOutput as TableOutput} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
