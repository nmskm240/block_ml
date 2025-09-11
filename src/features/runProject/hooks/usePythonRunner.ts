import { useState } from 'react';

import { Workspace } from 'blockly';
import { pythonGenerator } from 'blockly/python';

import { usePyodide } from '@/lib/pyodide';

export function usePythonRunner() {
  const { pyodideRef, logService } = usePyodide();
  const [error, setError] = useState<Error | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const executor = async (workspace: Workspace) => {
    setIsRunning(true);
    setError(null);

    try {
      const code = pythonGenerator.workspaceToCode(workspace);
      await pyodideRef.current?.runPythonAsync(code);
    } catch (e) {
      setError(e as Error);
      if (e instanceof Error) {
        logService?.addError({ message: e.message });
      }
    } finally {
      setIsRunning(false);
    }
  };

  return { executor, error, isRunning };
}
