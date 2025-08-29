'use client';

import React from 'react';

import { PlayArrow, Save } from '@mui/icons-material';
import { Box, CircularProgress, IconButton } from '@mui/material';

import { useParams } from 'next/navigation';

import { EditorHandle, Editor } from '@/features/editProject/components/Editor';
import PyodideConsole from '@/features/inspectProject/components/PyodideConsole';
import PyodideFileExplore from '@/features/inspectAsset/components/PyodideFileExplore';
import useEditProject from '@/features/projects/hooks/useEditProject';
import { updateProject } from '@/features/projects/usecases';
import usePyodideFileService from '@/lib/pyodide/hooks/usePyodideFileService';

type PageParams = {
  projectId: string;
};

export default function ProjectEditPage() {
  const { projectId } = useParams<PageParams>();
  const { projectJson, isLoading } = useEditProject(projectId);
  const editorRef = React.useRef<EditorHandle>(null);
  const fileService = usePyodideFileService();

  const run = async () => {
    try {
      await editorRef.current?.run();
    } catch (e) {}
  };

  const save = async () => {
    const projectJson = editorRef.current!.toWorkspaceJson();
    await updateProject(projectId, {
      projectJson: projectJson,
      assets: await fileService?.listFiles(),
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
          }}
        >
          <PyodideFileExplore />
        </div>
      </div>
    </div>
  );
}
