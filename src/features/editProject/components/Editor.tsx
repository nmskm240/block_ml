'use client';

import React from 'react';

import * as Blockly from 'blockly/core';

import { useResizeObserver } from '@/hooks';
import { useBlockly } from '@/lib/blockly';

export function Editor() {
  const { blocklyDivRef, workspace } = useBlockly();
  const { ref: containerRef } = useResizeObserver(() => {
    if (workspace) {
      Blockly.svgResize(workspace);
    }
  });

  return (
    <div
      ref={containerRef}
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        id="blockly-div"
        ref={blocklyDivRef}
        style={{
          flexGrow: 1,
          minHeight: 0,
        }}
      />
    </div>
  );
}
