import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useMemo,
} from 'react';

import { DisableTopBlocks } from '@blockly/disable-top-blocks';
import * as Blockly from 'blockly';

import {
  BlocklyWorkspaceAdditionalParams,
  WithAdditionalWorkspace,
} from '../types';
import mlToolbox from '../workspace/toolbox';

type Context = {
  workspace: Blockly.WorkspaceSvg | null;
  blocklyDivRef: React.RefObject<HTMLDivElement | null>;
};

const BlocklyContext = createContext<Context | null>(null);

type Props = {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState?: { [key: string]: any };
  workspaceParams?: BlocklyWorkspaceAdditionalParams;
  locale?: string;
  toolbox?: Blockly.utils.toolbox.ToolboxDefinition;
};

export function BlocklyProvider({
  children,
  initialState,
  workspaceParams,
  locale = 'ja',
  toolbox = mlToolbox,
}: Props) {
  const blocklyDivRef = useRef<HTMLDivElement>(null);
  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    if (!blocklyDivRef.current) {
      return;
    }

    // Blockly.setLocale(require(`blockly/msg/${locale}`));
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

    if (initialState) {
      Blockly.serialization.workspaces.load(initialState, ws);
    }

    if (workspaceParams) {
      (ws as WithAdditionalWorkspace).data = workspaceParams;
    }

    ws.addChangeListener(Blockly.Events.disableOrphans);

    const disableTopBlocks = new DisableTopBlocks(ws);
    disableTopBlocks.init();

    setWorkspace(ws);

    return () => {
      ws.dispose();
    };
  }, [initialState, workspaceParams, locale, toolbox]);

  const value = useMemo<Context>(
    () => ({
      workspace,
      blocklyDivRef,
    }),
    [workspace],
  );

  return (
    <BlocklyContext.Provider value={value}>{children}</BlocklyContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBlockly() {
  const context = useContext(BlocklyContext);
  if (!context) {
    throw new Error('useBlockly must be used within a BlocklyProvider');
  }
  return context;
}
