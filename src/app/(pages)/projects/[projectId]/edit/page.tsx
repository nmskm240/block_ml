import React from 'react';

import { Box } from '@mui/material';

import { ProjectAssets } from '@/components/project';
import {
  AddProjectAssetButton,
  Editor,
} from '@/features/editProject/components';
import { ExportButton } from '@/features/exportProject/components';
import { Inspector } from '@/features/inspectProject/components';
import { RunProjectButton } from '@/features/runProject/components';

type PageParams = {
  projectId: string;
};

export default async function ProjectEditPage(props: {
  params: Promise<PageParams>;
}) {
  const { projectId } = await props.params;

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
          <ExportButton />
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
          <AddProjectAssetButton />
          <ProjectAssets />
        </div>
      </div>
    </div>
  );
}
