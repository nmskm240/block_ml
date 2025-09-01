'use client';

import React from 'react';

import { Delete, FileUpload } from '@mui/icons-material';
import {
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

import usePyodideFileService from '@/lib/pyodide/hooks/usePyodideFileService';

export default function PyodideFileExplore() {
  const service = usePyodideFileService();
  const [fileNames, setFileNames] = React.useState<string[]>([]);

  const refreh = React.useCallback(async () => {
    if (!service) return;
    const list = service.list();
    // . と .. を除外
    setFileNames(list.filter((name) => name !== '.' && name !== '..'));
  }, [service]);

  React.useEffect(() => {
    refreh();
  }, [refreh]);

  const onClickFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!service || !e.target.files) {
      return;
    }

    await service.uploads(Array.from(e.target.files));
    await refreh();
  };

  const onRemoveFile = async (fileName: string) => {
    if(!service) {
      return;
    }

    await service.remove(fileName);
    await refreh();
  }

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
        title="ファイル"
        action={
          <Tooltip title="CSVファイルを追加">
            <label htmlFor="file-upload">
              <IconButton component="span">
                <FileUpload />
              </IconButton>
            </label>
          </Tooltip>
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
        {fileNames.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            ファイルがまだアップロードされていません。
          </Typography>
        ) : (
          <List dense>
            {fileNames.map((fileName, index) => (
              <React.Fragment key={index}>
                <ListItem
                  secondaryAction={
                    <Tooltip title="ファイルを削除">
                      <IconButton
                        edge="end"
                        onClick={() => onRemoveFile(fileName)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemText primary={fileName} />
                </ListItem>
                {index < fileNames.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>

      {/* Hidden file input */}
      <input
        id="file-upload"
        type="file"
        accept=".csv"
        multiple={true}
        style={{ display: 'none' }}
        onChange={(e) => onClickFileUpload(e)}
      />
    </Card>
  );
}
