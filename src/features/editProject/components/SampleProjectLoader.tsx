'use client';

import React, { useState } from 'react';

import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import * as Blockly from 'blockly/core';

import { sampleProjects, useBlockly } from '@/lib/blockly';

export function SampleProjectLoader() {
  const { workspace } = useBlockly();
  const [selectedProject, setSelectedProject] = useState('');

  const handleSampleProjectChange = async (event: SelectChangeEvent) => {
    const projectId = event.target.value;
    setSelectedProject(projectId);
    if (workspace) {
      const project = sampleProjects.find((p) => p.id === projectId);
      if (project) {
        const response = await fetch(project.data.toString());
        const data = await response.json();
        Blockly.serialization.workspaces.load(data, workspace);
      }
    }
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
      <InputLabel id="sample-project-label">Sample Projects</InputLabel>
      <Select
        labelId="sample-project-label"
        value={selectedProject}
        label="Sample Projects"
        onChange={handleSampleProjectChange}
      >
        {sampleProjects.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
