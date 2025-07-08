import React, { createContext, useContext, useState } from "react";
import { usePyodide } from "../hooks/usePyodide";

export type UploadFile = {
  name: string;
  content: string;
};

type UploadFileContextType = {
  files: UploadFile[];
  addFile: (file: UploadFile) => void;
  removeFile: (fileName: string) => void;
};

const UploadFileContext = createContext<UploadFileContextType | undefined>(undefined);

export const UploadFileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const { pyodideRef } = usePyodide();

  const syncToPyodideFS = (newFiles: UploadFile[]) => {
    if (!pyodideRef.current) return;

    // 一旦、既存ファイルを全部削除（シンプルにするため）
    newFiles.forEach(file => {
      pyodideRef.current!.FS.writeFile(file.name, file.content);
    });
  };

  const addFile = (file: UploadFile) => {
    setFiles(prev => {
      const updated = [...prev.filter(f => f.name !== file.name), file];
      syncToPyodideFS(updated);
      return updated;
    });
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.name !== fileName);
      if (pyodideRef.current) {
        try {
          pyodideRef.current.FS.unlink(fileName);
        } catch (e) {
          console.warn(`ファイル ${fileName} の削除に失敗:`, e);
        }
      }
      return updated;
    });
  };

  return (
    <UploadFileContext.Provider value={{ files, addFile, removeFile }}>
      {children}
    </UploadFileContext.Provider>
  );
};

export const useUploadFile = () => {
  const ctx = useContext(UploadFileContext);
  if (!ctx) throw new Error("useUploadFile must be used within UploadFileProvider");
  return ctx;
};
