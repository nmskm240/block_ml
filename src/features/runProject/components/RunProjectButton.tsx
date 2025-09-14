'use client';

import { PlayArrow } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { useBlockly } from '@/lib/blockly';

import { usePythonRunner } from '../hooks/usePythonRunner';

export function RunProjectButton() {
  const { workspace } = useBlockly();
  const { executor, isRunning } = usePythonRunner();

  return (
    <IconButton
      onClick={() => executor(workspace!)}
      disabled={!workspace || isRunning}
    >
      <PlayArrow color="success" />
    </IconButton>
  );
}
