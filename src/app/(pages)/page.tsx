import { Box } from '@mui/material';

import { Editor } from '@/features/editProject/components';
import { Inspector } from '@/features/inspectProject/components';
import { RunProjectButton } from '@/features/runProject/components';

export default function IndexPage() {
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
            flexGrow: 1,
            height: '100%',
            minHeight: 0,
          }}
        >
          <Inspector />
        </div>
      </div>
    </div>
  );
}