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
import React from 'react';

export const FileList: React.FC<{
  fileNames: string[];
  onClickFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile(fileName: string): void;
}> = ({ fileNames, onClickFileUpload, onRemoveFile }) => {
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
        style={{ display: 'none' }}
        onChange={onClickFileUpload}
      />
    </Card>
  );
};
