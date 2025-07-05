import { useState } from "react";
import { pythonGenerator } from "blockly/python";
import "blockly/blocks";
import type * as BlocklyType from "blockly";
import type { PyodideInterface } from "pyodide";

export const useBlocklyExecutor = (
  workspace: BlocklyType.WorkspaceSvg | null,
  pyodide: PyodideInterface | null
) => {
  const [output, setOutput] = useState<string>("");

  const runCode = async () => {
    if (!workspace || !pyodide) return;

    console.log(workspace.getAllBlocks(false)); 

    const code = pythonGenerator.workspaceToCode(workspace);
    console.log("生成されたコード:\n", code);

    try {
      const result = await pyodide.runPythonAsync(code);
      setOutput(result?.toString() ?? "(出力なし)");
    } catch (e) {
      setOutput(`エラー: ${e}`);
    }
  };

  return { output, runCode };
};
