import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as Blockly from "blockly";
import '@blockly/block-plus-minus';
import "blockly/blocks";
import { pythonGenerator } from "blockly/python";
import { defaultToolbox } from "../blockly";

export type BlocklyContextType = {
  blocklyDivRef: React.RefObject<HTMLDivElement | null>;
  workspace: Blockly.WorkspaceSvg | null;
  toPython: () => string;
};

const BlocklyContext = createContext<BlocklyContextType | undefined>(undefined);

export const BlocklyProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const blocklyDivRef = useRef<HTMLDivElement | null>(null);
  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    if (blocklyDivRef.current && !workspace) {
      const ws = Blockly.inject(blocklyDivRef.current, {
        toolbox: defaultToolbox,
      });
      setWorkspace(ws);
    }
  }, []);

  const toPython = () => {
    if (!workspace) return "";

    const code = pythonGenerator.workspaceToCode(workspace);
    console.log("Generated Python code:", code);
    return code;
  };

  return (
    <BlocklyContext.Provider value={{ blocklyDivRef, workspace, toPython }}>
      {children}
    </BlocklyContext.Provider>
  );
};

export const useBlockly = () => {
  const ctx = useContext(BlocklyContext);
  if (!ctx) throw new Error("useBlockly must be used within BlocklyProvider");
  return ctx;
};
