import { Workspace } from 'blockly/core';
import { pythonGenerator as baseGenerator } from 'blockly/python';

import { GenerationMode, setGenerationContext } from './generationContext';

export type WorkspaceToCodeOptions = {
  mode?: GenerationMode;
};

export type CustomPythonGenerator = typeof baseGenerator & {
  workspaceToCode: (
    workspace: Workspace,
    options?: WorkspaceToCodeOptions,
  ) => string;
};

const originalWorkspaceToCode = baseGenerator.workspaceToCode;

baseGenerator.workspaceToCode = function (
  workspace: Workspace,
  options: WorkspaceToCodeOptions = {},
): string {
  const { mode = GenerationMode.ForViewing } = options;
  setGenerationContext({ mode });

  const originalStatementPrefix = this.STATEMENT_PREFIX;
  if (mode & GenerationMode.ForRunning) {
    this.STATEMENT_PREFIX = '# block_id:%1\n';
  } else {
    this.STATEMENT_PREFIX = null;
  }

  let code = '';
  try {
    code = originalWorkspaceToCode.call(this, workspace);

    // --- BLOCKLY GEN --- ディレクティブの処理
    const regex =
      /# --- BLOCKLY GEN (\w+) ---([\s\S]*?)# --- BLOCKLY GEN END ---\n/gm;
    code = code.replaceAll(regex, (match, genModeStr, innerCode) => {
      const genMode = GenerationMode[genModeStr as keyof typeof GenerationMode];
      if (genMode === undefined) {
        throw new Error(`Unsupported. ${genMode}`); // 不明なモードの場合はそのまま
      }
      // 現在のモードに一致する場合は、中身のコードだけを返す
      if (mode & genMode) {
        return innerCode.trim();
      }
      // 一致しない場合は、ブロック全体を削除
      return '';
    });
  } finally {
    // 必ずコンテキストと STATEMENT_PREFIX をリセットする
    this.STATEMENT_PREFIX = originalStatementPrefix;
    setGenerationContext({ mode: GenerationMode.ForViewing });
  }

  return code;
};

export const pythonGenerator = baseGenerator as CustomPythonGenerator;
