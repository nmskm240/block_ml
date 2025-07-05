import React from "react";
import { useBlocklyExecutor, useBlocklyWorkspace, usePyodide } from "../hooks";

export const Editor: React.FC = () => {
  const { blocklyDiv, workspaceRef } = useBlocklyWorkspace();
  const { pyodideRef, isLoading } = usePyodide();
  const { output, runCode } = useBlocklyExecutor(workspaceRef.current, pyodideRef.current);

  return (
    <div style={{ padding: 20 }}>
      <h2>Blockly + Pyodide デモ</h2>
      <div
        ref={blocklyDiv}
        style={{ height: 300, width: "100%", border: "1px solid #ccc" }}
      />
      <button onClick={runCode} disabled={isLoading} style={{ marginTop: 10 }}>
        {isLoading ? "読み込み中..." : "実行"}
      </button>
      <h3>出力:</h3>
      <pre>{output}</pre>
    </div>
  );
};
