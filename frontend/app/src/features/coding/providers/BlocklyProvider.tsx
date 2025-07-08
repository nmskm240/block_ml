import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as Blockly from "blockly";
import { pythonGenerator } from "blockly/python";
import blocks from "../../../assets/blockly_blocks.json";
import { useUploadFile, type UploadFile } from "../providers";
import { defineCustomBlocks } from "../blockly/customBlocks";

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
  const { files } = useUploadFile();

  const filesRef = useRef<UploadFile[]>(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    defineCustomBlocks(filesRef);

    if (blocklyDivRef.current && !workspace) {
      const ws = Blockly.inject(blocklyDivRef.current, {
        toolbox: blocks,
      });
      setWorkspace(ws);

      return () => {
        ws.dispose();
        setWorkspace(null);
      };
    }
  }, []);

  const toPython = () => {
    if (!workspace) {
      console.warn("Blockly workspace is not initialized.");
      return "";
    }
    return pythonGenerator.workspaceToCode(workspace);
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
