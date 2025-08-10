'use client';

import {
  Editor,
  EditorHandle,
  PlotlyViewer,
} from '@/features/coding/components';
import { usePyodide } from '@/features/coding/providers';
import PyodideConsole from '@/features/projects/components/PyodideConsole';
import useEditProject from '@/features/projects/hooks/useEditProject';
import { PlayArrow, Save } from '@mui/icons-material';
import { TabContext, TabList } from '@mui/lab';
import { Box, CircularProgress, IconButton, Tab } from '@mui/material';
import { useParams } from 'next/navigation';
import React from 'react';

const ProjectEditPageTab = {
  CODING: 1,
  PLOT: 2,
} as const;

export default function ProjectEditPage() {
  const [tabValue, setTab] = React.useState<number>(ProjectEditPageTab.CODING);
  const { projectId } = useParams();
  const {
    projectJson,
    assetUrls,
    error,
    loading: isProjectLoading,
    saveProject,
  } = useEditProject(projectId?.toString() ?? '');
  const editorRef = React.useRef<EditorHandle>(null);
  const { pyodideRef, isLoading: isPyodideLoading } = usePyodide();

  const run = async () => {
    const code = editorRef.current?.toScript();
    if (!code) {
      throw new Error();
    }
    await pyodideRef.current?.runPythonAsync(code);
  };

  const save = async () => {
    const projectJson = editorRef.current!.toWorkspaceJson();
    await saveProject({ projectJson: projectJson, assets: [] });
  };

  if (isProjectLoading || isPyodideLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: 20 }}>
        Error loading project: {error.message}
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
        <TabContext value={tabValue}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              pt: 1,
            }}
          >
            <TabList onChange={(e, newValue) => setTab(newValue)}>
              <Tab label="Coding" value={ProjectEditPageTab.CODING} />
              <Tab label="Plot" value={ProjectEditPageTab.PLOT} />
            </TabList>
            <IconButton
              onClick={run}
              color="success"
              disabled={isPyodideLoading}
            >
              <PlayArrow />
            </IconButton>
            <IconButton onClick={save}>
              <Save />
            </IconButton>
          </Box>
        </TabContext>
        <div style={{ flexGrow: 1, minHeight: 0 }}>
          <div
            hidden={tabValue !== ProjectEditPageTab.CODING}
            style={{ height: '100%' }}
          >
            <Editor ref={editorRef} initialProjectJson={projectJson} fileNames={[]} />
          </div>
          <div
            hidden={tabValue !== ProjectEditPageTab.PLOT}
            style={{ height: '100%' }}
          >
            <PlotlyViewer />
          </div>
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
          {/* <FileList
            fileNames={fileNames}
            onClickFileUpload={(e) => controller!.uploadFiles(e)}
            onRemoveFile={(fileName) => controller!.removeFile(fileName)}
          /> */}
        </div>
      </div>
    </div>
  );
}
