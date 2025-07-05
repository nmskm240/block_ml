import { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import blocks from  "../../../assets/blockly_blocks.json";

export const useBlocklyWorkspace = () => {
  const blocklyDiv = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    if (blocklyDiv.current) {
      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox: blocks,
      });
    }

    return () => {
      workspaceRef.current?.dispose();
    };
  }, []);

  return { blocklyDiv, workspaceRef };
};
