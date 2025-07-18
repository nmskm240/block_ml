import React from "react";

type FileUploaderProps = {
  accept?: string,
  onUpload: (fileName: string, fileContent: string) => void;
};

export const FileUploader: React.FC<FileUploaderProps> = ({ accept, onUpload }) => {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const context = await file.text();
    onUpload(file.name, context);
  };

  return <input type="file" accept={accept} onChange={handleChange} aria-label="Upload file" />;
};
