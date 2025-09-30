'use client';

import React from 'react';

import { Box } from '@mui/material';
import Split from 'react-split';

import { Editor, SampleProjectLoader } from '@/features/editProject/components';
import { ExportButton } from '@/features/exportProject/components';
import { ImportButton } from '@/features/importProject/components';
import PyodideFileExplore from '@/features/inspectAsset/components/PyodideFileExplore';
import { Inspector } from '@/features/inspectProject/components';
import { RunProjectButton } from '@/features/runProject/components';

export default function ProjectEditPage() {
  return (
    <Split
      direction="horizontal"
      sizes={[75, 25]}
      minSize={[500, 300]}
      gutterSize={8}
      style={{ display: 'flex', height: '100vh' }}
      className="split"
    >
      {/* Editor side */}
      <div
        style={{
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
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
          <RunProjectButton />
          <ImportButton />
          <ExportButton />
          <SampleProjectLoader />
        </Box>
        <div style={{ flexGrow: 1, minHeight: 0 }}>
          <Editor />
        </div>
      </div>

      {/* Inspector side */}
      <div
        style={{
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Split
          direction="vertical"
          sizes={[70, 30]}
          minSize={[100, 100]}
          gutterSize={8}
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          className="split-vertical"
        >
          <div style={{ overflow: 'hidden' }}>
            <Inspector />
          </div>
          <div style={{ overflow: 'hidden', padding: '8px' }}>
            <PyodideFileExplore />
          </div>
        </Split>
      </div>
    </Split>
  );
}