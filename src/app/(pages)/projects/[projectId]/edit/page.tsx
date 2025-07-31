'use client';

import React from 'react';
import { Editor, PlotlyViewer, FileList } from '@/features/coding/components';

import { useProjectEditController } from './controller';
import { TabContext, TabList } from '@mui/lab';
import { Box, IconButton, Tab } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { Console } from '@/features/coding/components/Console';
import { useConsoleLog } from '@/features/coding/hooks/ConsoleLog';

const ProjectEditPageTab = {
  CODING: 1,
  PLOT: 2,
} as const;

export default function ProjectEditPage() {
  const [tabValue, setTab] = React.useState<number>(ProjectEditPageTab.CODING);
  const { logs, clear } = useConsoleLog();
  const { controller, editorRef, fileNames, loading } =
    useProjectEditController();

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
          <Console logsRef={logs} onSave={() => {}} onClear={() => clear()} />
        </div>
        <div
          style={{
            flexGrow: 1,
            height: 0,
            minHeight: 0,
          }}
        >
          <FileList
            fileNames={fileNames}
            onClickFileUpload={(e) => controller!.uploadFiles(e)}
            onRemoveFile={(fileName) => controller!.removeFile(fileName)}
          />
        </div>
      </div>
    </div>
  );
}
