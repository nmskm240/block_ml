import React from "react";
import { FileUploader } from "../../../components/FileUploader";
import { useBlockly, useUploadFile, usePyodide } from "../providers";

export const Editor: React.FC = () => {
  const { blocklyDivRef, toPython } = useBlockly();
  const { files, addFile, removeFile } = useUploadFile();
  const { pyodideRef, isLoading } = usePyodide();

  const run = async () => {
    const code = toPython();
    if (!code) return;
    
    if (!pyodideRef.current && !isLoading) {
      console.error("Pyodide is not loaded yet.");
      return;
    }
    await pyodideRef.current!.runPythonAsync(code)
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Blockly + Pyodide デモ</h2>
      <div
        ref={blocklyDivRef}
        style={{ height: 600, width: "100%", border: "1px solid #ccc" }}
      />
      <button onClick={run} style={{ marginTop: 10 }}>
        {/* FIXME: スプラッシュスクリーンにしたい */}
        {/* {isLoading ? "読み込み中..." : "実行"} */}
      </button>
      <FileUploader
        accept=".csv"
        onUpload={(fileName, context) => {
          addFile({ name: fileName, content: context });
        }}
      />
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            {file.name}
            <button onClick={() => removeFile(file.name)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
