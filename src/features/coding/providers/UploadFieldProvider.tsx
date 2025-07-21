"use client";

import React from "react";
import { usePyodide } from "./PyodideProvider";

export type UploadFile = {
  name: string;
  content: string;
};

type UploadFileContextType = {
  files: UploadFile[];
  addFile: (file: UploadFile) => void;
  removeFile: (fileName: string) => void;
};

const UploadFileContext = React.createContext<UploadFileContextType | undefined>(
  undefined
);

export const UploadFileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [files, setFiles] = React.useState<UploadFile[]>([]);
  const { pyodideRef } = usePyodide();

  const PYODIDE_FS_DIR = "/home/pyodide";

  const syncToPyodideFS = (currentFiles: UploadFile[]) => {
    if (!pyodideRef.current) return;

    try {
      pyodideRef.current?.FS.mkdirTree("/home");
    } catch {}
    try {
      pyodideRef.current?.FS.mkdirTree("/home/pyodide");
    } catch {}

    const existingFiles = pyodideRef.current.FS.readdir(PYODIDE_FS_DIR);
    existingFiles.forEach((fileName: any) => {
      if (fileName !== "." && fileName !== "..") {
        try {
          pyodideRef.current?.FS.unlink(`${PYODIDE_FS_DIR}/${fileName}`);
        } catch (e) {
          console.warn(`FSからの削除失敗: ${fileName}`, e);
        }
      }
    });

    currentFiles.forEach((file) => {
      pyodideRef.current?.FS.writeFile(
        `${PYODIDE_FS_DIR}/${file.name}`,
        file.content
      );
    });

    console.log(
      "FS after sync:",
      pyodideRef.current.FS.readdir(PYODIDE_FS_DIR)
    );
  };

  const addFile = (file: UploadFile) => {
    setFiles((prev) => {
      const updated = [...prev.filter((f) => f.name !== file.name), file];
      syncToPyodideFS(updated);
      return updated;
    });
  };

  const removeFile = (fileName: string) => {
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
    throw new Error("useUploadFile must be used within UploadFileProvider");
  return ctx;
};
