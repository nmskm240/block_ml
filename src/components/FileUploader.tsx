import React from 'react';

type FileUploaderProps = {
  id?: string;
  accept?: string;
  onUpload: (file: File) => void;
};

export function FileUploader(props: FileUploaderProps) {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    props.onUpload(file);
  };

  return (
    <input
      id={props.id}
      type="file"
      accept={props.accept}
      onChange={(e) => handleChange(e)}
      aria-label="Upload file"
    />
  );
}
