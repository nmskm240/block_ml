'use client';

import React from 'react';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { IconButton, Tooltip } from '@mui/material';
import * as Blockly from 'blockly/core';

import { useBlockly } from '@/lib/blockly';

export function ExportButton() {
  const { workspace } = useBlockly();

  const handleDownload = () => {
    if (!workspace) return;

    const state = Blockly.serialization.workspaces.save(workspace);
    const jsonString = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'workspace.json';
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Tooltip title="JSONでダウンロード">
      <span>
        <IconButton onClick={handleDownload} disabled={!workspace}>
          <FileDownloadIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
}
