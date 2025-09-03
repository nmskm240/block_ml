'use client';

import { useRef } from 'react';

import { Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { usePyodide } from '@/lib/pyodide';

export function AddProjectAssetButton() {
  const { fs } = usePyodide();

  const handle = async (files: File[]) => {
    await fs?.uploads(files);
  };
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <IconButton onClick={() => inputRef.current?.click()} disabled={!fs}>
        <Add />
      </IconButton>
      <input
        ref={inputRef}
        type="file"
        accept="text/csv"
        hidden
        onChange={(e) => {
          const files = e.target.files ? Array.from(e.target.files) : [];
          if (files.length > 0) {
            handle(files);
          }
        }}
      />
    </>
  );
}
