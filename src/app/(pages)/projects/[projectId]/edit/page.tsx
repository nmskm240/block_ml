// 'use client';

import React from 'react';

import { PlayArrow, Save } from '@mui/icons-material';
import { Box, CircularProgress, IconButton } from '@mui/material';

import { useParams } from 'next/navigation';

import { updateProject } from '@/features/editProject';
import { EditorHandle, Editor } from '@/features/editProject/components';
import { useEditProject } from '@/features/editProject/hooks';
import { PyodideConsole } from '@/features/inspectProject/components';
import { usePyodide } from '@/lib/pyodide';

type PageParams = {
  projectId: string;
};

export default function ProjectEditPage() {
  const { projectId } = useParams<PageParams>();
  const { projectJson, assets, isLoading } = useEditProject(projectId);
  const editorRef = React.useRef<EditorHandle>(null);
  const { fs } = usePyodide();

  const run = async () => {
    // try {
    await editorRef.current?.run();
    // } catch (e) {}
  };

  const save = async () => {
    const projectJson = editorRef.current!.toWorkspaceJson();
    await updateProject({
      id: projectId,
      json: projectJson,
      assets: (await fs?.listFiles()) ?? [],
    });
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div
      style={{
        flexGrow: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div
        style={{
          flexGrow: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            pt: 1,
          }}
        >
          <IconButton onClick={run} color="success" disabled={isLoading}>
            <PlayArrow />
          </IconButton>
          <IconButton onClick={save}>
            <Save />
          </IconButton>
        </Box>
        <div style={{ flexGrow: 1, minHeight: 0 }}>
          <Editor ref={editorRef} initialProjectJson={projectJson} />
        </div>
      </div>
      <div
        style={{
          flexGrow: 1,
          flexBasis: 0,
          minWidth: 0,
          minHeight: 0,
          maxWidth: '25%',
          borderLeft: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <div
          style={{
            flexGrow: 3,
            height: 0,
            minHeight: 0,
          }}
        >
          <PyodideConsole />
        </div>
        <div
          style={{
            flexGrow: 1,
            height: 0,
            minHeight: 0,
            padding: '8px',
          }}
        >
          <ProjectAssetList assets={assets} />
        </div>
      </div>
    </div>
  );
}
