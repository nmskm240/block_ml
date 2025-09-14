'use client';

import React, { useEffect } from 'react';

import { CircularProgress } from '@mui/material';

import { useParams } from 'next/navigation';

import { useLoadProject } from '@/features/loadProject/hooks/useLoadProject';
import { BlocklyProvider } from '@/lib/blockly';
import { usePyodide } from '@/lib/pyodide';

type Props = {
  children: React.ReactNode;
};

type PageParams = {
  projectId: string;
};

export default function ProjectPageTemplate({ children }: Props) {
  const { fs } = usePyodide();
  const { projectId } = useParams<PageParams>();
  const { projectJson, assets, isLoading } = useLoadProject(projectId);

  useEffect(() => {
    if (!fs || isLoading) {
      return;
    }
    fs.uploads(assets.map((asset) => asset.file));
  }, [fs, assets, isLoading]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <BlocklyProvider
      initialState={JSON.parse(projectJson)}
      workspaceParams={{ fileNames: () => fs?.list() ?? [] }}
    >
      {children}
    </BlocklyProvider>
  );
}
