import { pythonGenerator as baseGenerator } from 'blockly/python';
import { Workspace } from 'blockly/core';
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
  } finally {
    // 必ずコンテキストと STATEMENT_PREFIX をリセットする
    this.STATEMENT_PREFIX = originalStatementPrefix;
    setGenerationContext({ mode: GenerationMode.ForViewing });
  }

  return code;
};

export const pythonGenerator = baseGenerator as CustomPythonGenerator;
