'use client';

import { ListItemButton, ListItemText } from '@mui/material';

import { ProjectAssetInfo } from '@/services';

type Props = {
  info: ProjectAssetInfo;
  onClick?: () => void;
};

export function ProjectAsset({ info, onClick }: Props) {
  return (
    <ListItemButton onClick={onClick}>
      <ListItemText primary={info.name} />
    </ListItemButton>
  );
}
