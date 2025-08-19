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
    <Link href={`/users/${props.userInfo.id}`}>
      <ListItemAvatar>
        <UserAvatar avatarUrl={props.userInfo.avatarUrl} />
      </ListItemAvatar>
      <ListItem dense={props.dense}>
        <ListItemText primary={props.userInfo.name} />
      </ListItem>
    </Link>
  );
}
