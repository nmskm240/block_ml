import { Avatar, SxProps, Theme } from '@mui/material';

type Props = {
  avatarUrl?: string;
  sx?: SxProps<Theme>;
};

const DEFAULT_AVATAR_PATH = '/images/default-user.png';

export default function UserAvatar(props: Props) {
  return <Avatar src={props.avatarUrl ?? DEFAULT_AVATAR_PATH} sx={props.sx} />;
}
