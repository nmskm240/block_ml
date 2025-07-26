import { List, ListItem, ListItemText } from '@mui/material';
import React from 'react';

export const FileList: React.FC<{ fileNames: string[] }> = ({ fileNames }) => {
  return (
    <List dense>
      {fileNames.map((fileName, index) => (
        <ListItem key={index}>
          <ListItemText primary={fileName} />
        </ListItem>
      ))}
    </List>
  );
};
