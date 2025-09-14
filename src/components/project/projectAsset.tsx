'use client';

import React, { useState, useEffect } from 'react';

import { ListItemButton, ListItemText } from '@mui/material';

import { usePyodide } from '@/lib/pyodide';

export function ProjectAssets() {
  const { fs } = usePyodide();
  const [assets, setAssets] = useState<string[]>([]);

  useEffect(() => {
    if (!fs) return;
    setAssets(fs.list());

    const unsub = fs.subscribe?.('change', () => {
      setAssets(fs.list());
    });

    return () => {
      unsub?.();
    };
  }, [fs]);

  return (
    <>
      {assets.map((asset) => (
        <ListItemButton key={asset}>
          <ListItemText primary={asset} />
        </ListItemButton>
      ))}
    </>
  );
}
