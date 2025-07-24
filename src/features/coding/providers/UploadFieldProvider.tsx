'use client';

import React from 'react';
import { usePyodide } from './PyodideProvider';

type UploadFileContextType = {
  files: File[];
  addFile: (file: File) => Promise<void>;
  removeFile: (fileName: string) => Promise<void>;
};

const UploadFileContext = React.createContext<
  UploadFileContextType | undefined
>(undefined);

export const UploadFileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const { pyodideRef } = usePyodide();

  const PYODIDE_FS_DIR = '/home/pyodide';

  const syncToPyodideFS = async (currentFiles: File[]) => {
    if (!pyodideRef.current) return;

    try {
      pyodideRef.current?.FS.mkdirTree(PYODIDE_FS_DIR);
    } catch {}

    const existingFiles = pyodideRef.current.FS.readdir(PYODIDE_FS_DIR);
    existingFiles.forEach((fileName: any) => {
      if (fileName !== '.' && fileName !== '..') {
        try {
          pyodideRef.current?.FS.unlink(`${PYODIDE_FS_DIR}/${fileName}`);
        } catch (e) {
          console.warn(`FSからの削除失敗: ${fileName}`, e);
        }
      }
    });

    for (const file of currentFiles) {
      const buffer = await file.arrayBuffer();
      pyodideRef.current?.FS.writeFile(
        `${PYODIDE_FS_DIR}/${file.name}`,
        new Uint8Array(buffer)
      );
    }

    console.log(
      'FS after sync:',
      pyodideRef.current.FS.readdir(PYODIDE_FS_DIR)
    );
  };

  const addFile = async (file: File) => {
    const updated = [...files.filter((f) => f.name !== file.name), file];
    setFiles(updated); // 同期処理
    await syncToPyodideFS(updated); // 非同期処理はここでやる
  };

  const removeFile = async (fileName: string) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.name !== fileName);
      if (pyodideRef.current) {
        try {
          pyodideRef.current!.FS.unlink(`${PYODIDE_FS_DIR}/${fileName}`);
        } catch (e) {
          console.warn(`ファイル ${fileName} の削除に失敗:`, e);
        }
      }
      return updated;
    });
    await syncToPyodideFS(files.filter((f) => f.name !== fileName));
  };

  return (
    <UploadFileContext.Provider value={{ files, addFile, removeFile }}>
      {children}
    </UploadFileContext.Provider>
  );
};

export const useUploadFile = () => {
  const ctx = React.useContext(UploadFileContext);
  if (!ctx)
    throw new Error('useUploadFile must be used within UploadFileProvider');
  return ctx;
};
