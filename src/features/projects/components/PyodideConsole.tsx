import { usePyodide } from '@/lib/pyodide/providers/PyodideProvider';
import { Delete } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';

enum LogType {
  None,
  Out,
  Error,
}

type LogEntry = {
  type: LogType;
  message: string;
  timestamp: Date;
};

export default function PyodideConsole() {
  const { pyodideRef, isLoading } = usePyodide();
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const append = (log: LogEntry) => {
    setLogs((prev) => {
      const maxLines = Number.parseInt(process.env.NEXT_PUBLIC_MAX_LOG_LINES!);
      const trimmed = prev.length >= maxLines ? prev.slice(1) : prev;
      return [...trimmed, log];
    });
  };

  const clear = () => {
    setLogs([]);
  };

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

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

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <CardHeader
        title="実行ログ"
        action={
          <Box>
            {/*
            TODO
            <Tooltip title="ログを保存">
              <IconButton onClick={onSave}>
                <SaveAlt />
              </IconButton>
            </Tooltip>
            */}
            <Tooltip title="ログをクリア">
              <IconButton onClick={clear}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        }
        sx={{ pb: 1 }}
      />
      <Divider />
      <CardContent
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          py: 1,
        }}
      >
        <List dense>
          {logs.map((log, idx) => (
            <ListItem
              key={idx}
              alignItems="flex-start"
              sx={{
                color: log.type === LogType.Error ? '#b00020' : 'inherit',
                bgcolor:
                  log.type === LogType.Error
                    ? 'rgba(255,0,0,0.05)'
                    : 'transparent',
                borderRadius: 1,
                py: 0.5,
              }}
            >
              <ListItemText
                primary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: '#999', mr: 1 }}
                    >
                      [{log.timestamp.toLocaleTimeString()}]
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {log.message}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
          <Box ref={bottomRef} />
        </List>
      </CardContent>
    </Card>
  );
}
