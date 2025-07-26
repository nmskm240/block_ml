'use client';

import React from 'react';
import * as Blockly from 'blockly';
import { registerContinuousToolbox } from '@blockly/continuous-toolbox';
import { mlToolbox } from '@/lib/blockly';
import { pythonGenerator } from 'blockly/python';

type EditorProps = {
  toolbox?: Blockly.utils.toolbox.ToolboxDefinition;
  fileNames: string[];
};

export type EditorHandle = {
  toWorkspaceJson: () => string;
  toPython: () => string;
};

export const Editor = React.forwardRef<EditorHandle, EditorProps>(
  ({ toolbox = mlToolbox, fileNames }, ref) => {
    const blocklyDivRef = React.useRef<HTMLDivElement | null>(null);
    const [workspace, setWorkspace] =
      React.useState<Blockly.WorkspaceSvg | null>(null);
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      if (blocklyDivRef.current && !workspace) {
        Blockly.setLocale(require('blockly/msg/ja'));
        registerContinuousToolbox();
        const ws = Blockly.inject(blocklyDivRef.current, {
          toolbox: toolbox,
          trashcan: false,
          grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
          },
          move: {
            scrollbars: true,
            drag: true,
            wheel: true,
          },
          zoom: {
            controls: true,
            wheel: false,
            startScale: 0.7,
            maxScale: 1.0,
            minScale: 0.3,
            scaleSpeed: 1.2,
          },
        });

        setWorkspace(ws);
      }
    }, []);

    React.useEffect(() => {
      if (!containerRef.current || !workspace) return;

      const observer = new ResizeObserver(() => {
        Blockly.svgResize(workspace);
      });
      observer.observe(containerRef.current);

      return () => {
        observer.disconnect();
      };
    }, [workspace]);

    React.useEffect(() => {
      if (workspace) {
        (workspace as any).fileNames = fileNames;
      }
    }, [workspace, fileNames]);

    React.useImperativeHandle(ref, () => ({
      toWorkspaceJson: () => {
        if (!workspace) return '';
        const json = Blockly.serialization.workspaces.save(workspace);
        console.log('Generated workspace JSON:', json);
        return JSON.stringify(json);
      },
      toPython: () => {
        if (!workspace) return '';
        const code = pythonGenerator.workspaceToCode(workspace);
        console.log('Generated Python code:', code);
        return code;
      },
    }));

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
          ref={blocklyDivRef}
          style={{
            flexGrow: 1,
            minHeight: 0,
          }}
        />
      </div>
    );
  }
);
