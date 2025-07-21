'use client';

import React from 'react';
import * as Blockly from 'blockly';
import '@blockly/block-plus-minus';
import { TypedVariableModal } from '@blockly/plugin-typed-variable-modal';
import 'blockly/blocks';
import { pythonGenerator } from 'blockly/python';

type BlocklyContextType = {
  blocklyDivRef: React.RefObject<HTMLDivElement | null>;
  workspace: Blockly.WorkspaceSvg | null;
  toPython: () => string;
};

const BlocklyContext = React.createContext<BlocklyContextType | undefined>(undefined);

export const BlocklyProvider: React.FC<{
  children: React.ReactNode;
  toolbox: Blockly.utils.toolbox.ToolboxDefinition;
}> = ({ children, toolbox }) => {
  const blocklyDivRef = React.useRef<HTMLDivElement | null>(null);
  const [workspace, setWorkspace] = React.useState<Blockly.WorkspaceSvg | null>(null);

  React.useEffect(() => {
    if (blocklyDivRef.current && !workspace) {
      const ws = Blockly.inject(blocklyDivRef.current, {
        toolbox: toolbox,
      });
      const typedVarModal = new TypedVariableModal(ws, 'callbackName', [
        ['DataFrame', 'DataFrame'],
        ['Model', 'Model'],
      ]);
      typedVarModal.init();
      ws.registerButtonCallback('CREATE_VARIABLE', function (button) {
        Blockly.Variables.createVariableButtonHandler(
          button.getTargetWorkspace()
        );
      });
      ws.registerButtonCallback('CREATE_TYPED_VARIABLE', function (button) {
        typedVarModal.show();
      });

      setWorkspace(ws);
    }
  }, []);

  const toPython = () => {
    if (!workspace) return '';

    const code = pythonGenerator.workspaceToCode(workspace);
    console.log('Generated Python code:', code);
    return code;
  };

  return (
    <BlocklyContext.Provider value={{ blocklyDivRef, workspace, toPython }}>
      {children}
    </BlocklyContext.Provider>
  );
};

export const useBlockly = () => {
  const ctx = React.useContext(BlocklyContext);
  if (!ctx) throw new Error('useBlockly must be used within BlocklyProvider');
  return ctx;
};
