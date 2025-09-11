import { useState } from 'react';

import { Workspace } from 'blockly';
import { pythonGenerator } from 'blockly/python';

import { usePyodide } from '@/lib/pyodide';

// 各ステートメントの前にブロックIDをコメントとして挿入する
pythonGenerator.STATEMENT_PREFIX = '# block_id:%1\n';

export function usePythonRunner() {
  const { pyodideRef, logService } = usePyodide();
  const [error, setError] = useState<Error | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const executor = async (workspace: Workspace) => {
    setIsRunning(true);
    setError(null);

    // 前回の実行時のエラー表示をクリア
    workspace.getAllBlocks(false).forEach((block) => {
      block.setWarningText(null);
    });
    logService?.clear();

    try {
      const code = pythonGenerator.workspaceToCode(workspace);
      await pyodideRef.current?.runPythonAsync(code);
    } catch (e) {
      setError(e as Error);
      if (e instanceof Error) {
        const errorMessage = e.message;
        logService?.addError({ message: errorMessage });

        // トレースバックから行番号を正規表現で抽出
        const lineMatch = errorMessage.match(/File "<exec>", line (\d+)/);
        if (lineMatch) {
          const errorLine = parseInt(lineMatch[1], 10);

          // エラー行から遡ってブロックIDを探す
          const code = pythonGenerator.workspaceToCode(workspace);
          const codeLines = code.split('\n');
          let blockId: string | null = null;
          for (let i = errorLine - 1; i >= 0; i--) {
            const idMatch = codeLines[i].match(/# block_id:'(.*)'/);
            if (idMatch) {
              blockId = idMatch[1].trim();
              break;
            }
          }

          // 見つかったブロックにエラーテキストを設定
          if (blockId) {
            // FIXME: 責務の分離 - このフックが直接UI(Blockly)を操作している。
            // 将来的には、Context APIなどを用いてerrorBlockIdを状態管理し、
            // UIの更新はworkspaceを管轄する上位のコンポーネント(Editorなど)に委譲するべき。
            const errorBlock = workspace.getBlockById(blockId);
            if (errorBlock) {
              const pythonErrorLines = errorMessage.split('\n');
              const pythonError = pythonErrorLines[pythonErrorLines.length - 2];
              errorBlock.setWarningText(pythonError || 'エラーが発生しました');
            }
          }
        }
      }
    } finally {
      setIsRunning(false);
    }
  };

  return { executor, error, isRunning };
}
