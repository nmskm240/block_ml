import { registerContinuousToolbox } from '@blockly/continuous-toolbox';
import * as Blockly from 'blockly';
import React from 'react';
import mlToolbox from '../workspace/toolbox';
import {
  BlocklyWorkspaceAdditionalParams,
  WithAdditionalWorkspace,
} from '../types';

type Params = {
  locale?: string;
  toolbox?: Blockly.utils.toolbox.ToolboxDefinition;
  data?: BlocklyWorkspaceAdditionalParams;
};

export default function useBlocklyWorkspace({
  locale = 'ja',
  toolbox = mlToolbox,
  data = { fileNames: [] },
}: Params) {
  const blocklyDivRef = React.useRef<HTMLDivElement>(null);
  const [workspace, setWorkspace] = React.useState<Blockly.WorkspaceSvg | null>(
    null
  );

  React.useEffect(() => {
    if (!blocklyDivRef.current) {
      return;
    }

    registerContinuousToolbox();
    Blockly.setLocale(require(`blockly/msg/${locale}`));
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
      (workspace as WithAdditionalWorkspace).data = data;
    }
  }, [workspace, data]);

  return { blocklyDivRef, workspace };
}
