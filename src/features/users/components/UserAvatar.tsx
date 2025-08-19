import { Avatar } from '@mui/material';

type Props = {
  avatarUrl?: string;
};

const DEFAULT_AVATAR_PATH = '/images/default-user.png';

export default function UserAvatar(props: Props) {
  return <Avatar src={props.avatarUrl ?? DEFAULT_AVATAR_PATH} />;
}
