import React from 'react';
import { LogEntry, LogType } from '../types/ConsoleLog';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { Delete, SaveAlt } from '@mui/icons-material';

type ConsoleProps = {
  logsRef: LogEntry[];
  onClear: () => void;
  onSave: () => void;
};

export const Console: React.FC<ConsoleProps> = ({
  logsRef,
  onClear,
  onSave,
}) => {
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logsRef.length]);

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
            <Tooltip title="ログを保存">
              <IconButton onClick={onSave}>
                <SaveAlt />
              </IconButton>
            </Tooltip>
            <Tooltip title="ログをクリア">
              <IconButton onClick={onClear}>
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
          {logsRef.map((log, idx) => (
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
};
