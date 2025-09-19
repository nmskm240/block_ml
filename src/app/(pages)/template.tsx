'use client';

import React from 'react';

import { BlocklyProvider } from '@/lib/blockly';
import { usePyodide } from '@/lib/pyodide';

type Props = {
  children: React.ReactNode;
};

export default function ProjectPageTemplate({ children }: Props) {
  const { fs } = usePyodide();

  return (
    <BlocklyProvider workspaceParams={{ fileNames: () => fs?.list() ?? [] }}>
      {children}
    </BlocklyProvider>
  );
}
