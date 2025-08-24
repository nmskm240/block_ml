import React from 'react';

import * as Blockly from 'blockly';

import {
  BlocklyWorkspaceAdditionalParams,
  WithAdditionalWorkspace,
} from '../types';
import mlToolbox from '../workspace/toolbox';

type Params = {
  workspaceParams: BlocklyWorkspaceAdditionalParams;
  locale?: string;
  toolbox?: Blockly.utils.toolbox.ToolboxDefinition;
};

export default function useBlocklyWorkspace({
  workspaceParams,
  locale = 'ja',
  toolbox = mlToolbox,
}: Params) {
  const blocklyDivRef = React.useRef<HTMLDivElement>(null);
  const [workspace, setWorkspace] = React.useState<Blockly.WorkspaceSvg | null>(
    null
  );
  const initialized = React.useRef(false);

  React.useEffect(() => {
    if (!blocklyDivRef.current) {
      return;
    }

    // if (!initialized.current) {
    //   registerContinuousToolbox();
    //   initialized.current = true;
    // }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Blockly.setLocale(require(`blockly/msg/ja`));
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

    return () => {
      ws.dispose();
    };
  }, [locale]);

  React.useEffect(() => {
    if (workspace) {
      (workspace as WithAdditionalWorkspace).data = workspaceParams;
    }
  }, [workspace, workspaceParams]);

  return { blocklyDivRef, workspace };
}
