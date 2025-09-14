'use client';

import { useState } from 'react';

import { Save } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import * as Blockly from 'blockly/core';

import { useBlockly } from '@/lib/blockly';
import { usePyodide } from '@/lib/pyodide';

import { updateProject } from '../actions';

type Props = {
  projectId: string;
};

export function SaveProjectButton(props: Props) {
  const { workspace } = useBlockly();
  const { fs } = usePyodide();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!workspace || !fs) {
      return;
    }

    setIsSaving(true);
    try {
      const json = Blockly.serialization.workspaces.save(workspace);
      await updateProject({
        id: props.projectId,
        json: JSON.stringify(json),
        assets: await fs.listFiles(),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <IconButton onClick={handleSave} disabled={!workspace && isSaving}>
      <Save />
    </IconButton>
  );
}
