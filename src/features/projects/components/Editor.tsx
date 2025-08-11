'use client';

import useResizeObserver from '@/hooks/useResizeObserver';
import useBlocklyWorkspace from '@/lib/blockly/hooks/useBlocklyWorkspace';
import { usePyodide } from '@/lib/pyodide/providers/PyodideProvider';
import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';
import React from 'react';

type EditorProps = {
  initialProjectJson: string;
  fileNames: string[];
};

export type EditorHandle = {
  toWorkspaceJson: () => string;
  run: () => Promise<void>;
};

export const Editor = React.forwardRef<EditorHandle, EditorProps>(
  ({ initialProjectJson, fileNames }, ref) => {
    const { blocklyDivRef, workspace } = useBlocklyWorkspace({
      data: { fileNames: fileNames },
    });
    const { ref: containerRef } = useResizeObserver(() => {
      if (workspace) {
        Blockly.svgResize(workspace);
      }
    });
    const { pyodideRef, isLoading } = usePyodide();
    const projectInitialized = React.useRef(false);

    React.useImperativeHandle(ref, () => ({
      toWorkspaceJson: () => {
        if (!workspace) return '';
        const json = Blockly.serialization.workspaces.save(workspace);
        console.log('Generated workspace JSON:', json);
        return JSON.stringify(json);
      },
      run: async () => {
        if (!workspace) return;

        const code = pythonGenerator.workspaceToCode(workspace);
        console.log('Generated Python code:', code);

        await pyodideRef.current?.runPythonAsync(code);
      },
    }));

    React.useEffect(() => {
      if (!projectInitialized.current && initialProjectJson && workspace) {
        Blockly.serialization.workspaces.load(
          JSON.parse(initialProjectJson),
          workspace
        );
        projectInitialized.current = true;
      }
    }, [initialProjectJson, workspace]);

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
);
