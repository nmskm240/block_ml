'use client';

import React from 'react';

import { CircularProgress } from '@mui/material';

import { BlocklyProvider } from '@/lib/blockly';
import { usePyodide } from '@/lib/pyodide';

type Props = {
  children: React.ReactNode;
};

export default function ProjectPageTemplate({ children }: Props) {
  const { fs, isLoading } = usePyodide();

  if(isLoading) {
    return <CircularProgress />;
  }

  return (
    <BlocklyProvider workspaceParams={{ fileNames: () => fs?.list() ?? [] }}>
      {children}
    </BlocklyProvider>
  );
}
