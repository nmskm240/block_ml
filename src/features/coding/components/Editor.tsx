'use client';

import React from 'react';
import * as Blockly from 'blockly/core';
import { FileUploader } from '@/components/FileUploader';
import {
  useBlockly,
  useUploadFile,
  usePyodide,
  type UploadFile,
} from '../providers';
import { AuthService } from "@/features/auth/AuthService";

export const Editor: React.FC = () => {
  const { blocklyDivRef, workspace, toPython } = useBlockly();
  const { files, addFile, removeFile } = useUploadFile();
  const { pyodideRef, isLoading } = usePyodide();

  const filesRef = React.useRef<UploadFile[]>(files);

  React.useEffect(() => {
    filesRef.current = files;
  }, [files]);

  React.useEffect(() => {
    if (workspace) {
      (workspace as any).fileRef = files;
    }
  }, [workspace, files]);

  const run = async () => {
    const code = toPython();
    if (!code) return;

    if (!pyodideRef.current && !isLoading) {
      console.error('Pyodide is not loaded yet.');
      return;
    }
    await pyodideRef.current!.runPythonAsync(code);
  };

  const save = async () => {
    if (!workspace) return;

    const user = await AuthService.getUser();
    const json = Blockly.serialization.workspaces.save(workspace);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Blockly + Pyodide デモ</h2>
      <div
        ref={blocklyDivRef}
        style={{ height: 600, width: '100%', border: '1px solid #ccc' }}
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
      <button onClick={save}>Save Project</button>
    </div>
  );
};
