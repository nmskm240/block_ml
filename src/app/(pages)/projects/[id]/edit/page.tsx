'use client';

import React from 'react';
import { Header } from '@/components';
import { Editor, PlotlyViewer, FileList } from '@/features/coding/components';

import { useProjectEditController } from './controller';
import { TabContext, TabList } from '@mui/lab';
import { Box, Fab, IconButton, Tab, CircularProgress } from '@mui/material';
import { FileUpload, PlayArrow } from '@mui/icons-material';

const ProjectEditPageTab = {
  CODING: 1,
  PLOT: 2,
} as const;

export default function ProjectEditPage() {
  const [tabValue, setTab] = React.useState<number>(ProjectEditPageTab.CODING);
  const { controller, editorRef, fileNames, loading } =
    useProjectEditController();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
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
              <IconButton onClick={() => controller!.run()} color="success">
                <PlayArrow />
              </IconButton>
            </Box>
          </TabContext>
          <div style={{ flexGrow: 1, minHeight: 0 }}>
            <div
              hidden={tabValue !== ProjectEditPageTab.CODING}
              style={{ height: '100%' }}
            >
              <Editor ref={editorRef} fileNames={fileNames} />
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
            maxWidth: '33.33%',
            overflowY: 'auto',
            borderLeft: '1px solid #ddd',
          }}
        >
          <FileList fileNames={fileNames} />
        </div>
      </div>
      <label htmlFor="file-upload">
        <Fab
          color="primary"
          component="span"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
          }}
        >
          <FileUpload />
        </Fab>
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".csv"
        // multiple={true}
        style={{ display: 'none' }}
        onChange={(e) => controller!.uploadFiles(e)}
      />
    </div>
  );
}
