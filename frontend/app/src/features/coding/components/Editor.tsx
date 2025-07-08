import React from "react";
import { FileUploader } from "../../../components/FileUploader";
import { useBlockly, useUploadFile } from "../providers";

export const Editor: React.FC = () => {
  const { blocklyDivRef } = useBlockly();
  const { files, addFile, removeFile } = useUploadFile();

  return (
    <div style={{ padding: 20 }}>
      <h2>Blockly + Pyodide デモ</h2>
      <div
        ref={blocklyDivRef}
        style={{ height: 600, width: "100%", border: "1px solid #ccc" }}
      />
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
