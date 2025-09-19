import React from 'react';

import { Box } from '@mui/material';

import { Editor, SampleProjectLoader } from '@/features/editProject/components';
import { ExportButton } from '@/features/exportProject/components';
import { ImportButton } from '@/features/importProject/components';
import PyodideFileExplore from '@/features/inspectAsset/components/PyodideFileExplore';
import { Inspector } from '@/features/inspectProject/components';
import { RunProjectButton } from '@/features/runProject/components';


export default async function ProjectEditPage() {
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
          <RunProjectButton />
          <ImportButton />
          <ExportButton />
          <SampleProjectLoader />
        </Box>
        <div style={{ flexGrow: 1, minHeight: 0 }}>
          <Editor />
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
          <Inspector />
        </div>
        <div
          style={{
            flexGrow: 1,
            height: 0,
            minHeight: 0,
            padding: '8px',
          }}
        >
          <PyodideFileExplore />
        </div>
      </div>
    </div>
  );
}
