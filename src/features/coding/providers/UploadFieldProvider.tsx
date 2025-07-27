'use client';

import React from 'react';
import { usePyodide } from './PyodideProvider';
import path from 'path';

type UploadFileContextType = {
  fileNames: string[];
  addFile: (file: File) => Promise<void>;
  removeFile: (fileName: string) => Promise<void>;
};

const UploadFileContext = React.createContext<
  UploadFileContextType | undefined
>(undefined);

// FIXME: PyodideProviderと分ける意味がなさそうな印象
export const UploadFileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  //FIXME: File配列にしたいがうまくいかないためファイル名にしている
  const [fileNames, setFileNames] = React.useState<string[]>([]);

  const { pyodideRef } = usePyodide();

  const addFile = async (file: File) => {
    if (fileNames.findIndex((i) => i == file.name) == -1) {
      setFileNames((prev) => {
        const next = [...prev, file.name];
        return next;
      });
    }
    const buffer = await file.arrayBuffer();
    const filePath = path.join(
      process.env.NEXT_PUBLIC_PYODIDE_FS_PATH!,
      file.name
    );
    pyodideRef.current?.FS.writeFile(filePath, new Uint8Array(buffer));
  };

  const removeFile = async (fileName: string) => {
    setFileNames((prev) => {
      const next = [...prev.filter((i) => i !== fileName)];
      return next;
    });
    const filePath = path.join(
      process.env.NEXT_PUBLIC_PYODIDE_FS_PATH!,
      fileName
    );
    pyodideRef.current?.FS.unlink(filePath);
  };
  return (
    <UploadFileContext.Provider value={{ fileNames, addFile, removeFile }}>
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
