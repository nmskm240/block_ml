import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import UserAvatar from './UserAvatar';
import { Userinfo } from '../types';

type Props = {
  userInfo: Userinfo;
  dense?: boolean;
};

export default function UserListItem(props: Props) {
  return (
    <ListItem
      dense={props.dense}
      component={Link}
      href={`/users/${props.userInfo.id}`}
      sx={{ textDecoration: 'none', color: 'inherit' }}
    >
      <ListItemAvatar>
        <UserAvatar avatarUrl={props.userInfo.avatarUrl} />
      </ListItemAvatar>
      <ListItemText primary={props.userInfo.name} />
    </ListItem>
  );
}
