import React from 'react';

type FileUploaderProps = {
  id?: string;
  accept?: string;
  onUpload: (file: File) => void;
};

export const FileUploader: React.FC<FileUploaderProps> = ({
  id,
  accept,
  onUpload,
}) => {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onUpload(file);
  };

  return (
    <input
      id={id}
      type="file"
      accept={accept}
      onChange={handleChange}
      aria-label="Upload file"
    />
  );
};
