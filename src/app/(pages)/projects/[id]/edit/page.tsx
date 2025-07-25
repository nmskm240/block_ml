'use client';

import { Header } from '@/components';
import {
  Editor,
  EditorHandle,
  PlotlyViewer,
} from '@/features/coding/components';

import { ProjectEditPageController } from './controller';
import { useParams } from 'next/navigation';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import React from 'react';
import Tab from '@mui/material/Tab';
import { usePyodide } from '@/features/coding/providers';
import { Box, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const ProjectEditPageTab = {
  CODING: 1,
  PLOT: 2,
} as const;

export default function ProjectEditPage() {
  const [tabValue, setTab] = React.useState<number>(ProjectEditPageTab.CODING);
  const params = useParams();
  const editorRef = React.useRef<EditorHandle>(null);
  const { pyodideRef } = usePyodide();
  const projectId = params.id as string;
  const controller = new ProjectEditPageController(projectId);

  const handleRun = async () => {
    const code = editorRef.current?.toPython();
    console.log('実行コード:', code);
    if (code) {
      await pyodideRef.current?.runPythonAsync(code);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
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
            <IconButton onClick={handleRun} color="success">
              <PlayArrowIcon />
            </IconButton>
          </Box>
        </TabContext>
        <div style={{ flexGrow: 1, minHeight: 0 }}>
          <div
            hidden={tabValue !== ProjectEditPageTab.CODING}
            style={{ height: '100%' }}
          >
            <Editor ref={editorRef} />
          </div>
          <div
            hidden={tabValue !== ProjectEditPageTab.PLOT}
            style={{ height: '100%' }}
          >
            <PlotlyViewer />
          </div>
        </div>
      </div>
    </div>
  );
}
