import React from 'react';
import { LogEntry, LogType } from '../types/ConsoleLog';
import { usePyodide } from '../providers';

export const useConsoleLog = () => {
  const [logs, setlogs] = React.useState<LogEntry[]>([]);
  const { pyodideRef, isLoading } = usePyodide();

  const append = (log: LogEntry) => {
    setlogs((prev) => {
      const maxLines = Number.parseInt(process.env.NEXT_PUBLIC_MAX_LOG_LINES!);
      const trimmed = prev.length >= maxLines ? prev.slice(1) : prev;
      return [...trimmed, log];
    });
  };

  const clear = () => {
    setlogs((_) => []);
  };

  React.useEffect(() => {
    if (!pyodideRef.current || isLoading) return;

    pyodideRef.current.setStdout({
      batched: (message: string) => {
        append({
          type: LogType.Out,
          message: message.trim(),
          timestamp: new Date(),
        });
      },
    });

    pyodideRef.current.setStderr({
      batched: (message: string) => {
        append({
          type: LogType.Error,
          message: message.trim(),
          timestamp: new Date(),
        });
      },
    });
  }, [pyodideRef, isLoading]);

  return {
    logs,
    clear,
  };
};
