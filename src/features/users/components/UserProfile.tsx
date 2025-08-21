'use client';

import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import UserAvatar from './UserAvatar';
import { useUserApiClient } from '../providers/ApiClientProvider';

type Props = {
  userId: string;
};

export default function UserProfile(props: Props) {
  const { data: session, update: updateSession } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const userApiClient = useUserApiClient();
      const { updatedInfo } = await userApiClient.editUserInfo(props.userId, {
        name: session?.user?.name || '',
        icon: file,
      });
      const newImageUrl = updatedInfo.avatarUrl;
      await updateSession({ user: { image: newImageUrl } });
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('画像のアップロードに失敗しました。');
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 4,
      }}
    >
      <UserAvatar sx={{ width: 120, height: 120, mb: 2 }} />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button
        variant="contained"
        component="label"
        onClick={handleButtonClick}
        disabled={isUploading || session?.user?.id !== props.userId}
      >
        {isUploading ? <CircularProgress size={24} /> : 'アイコンを変更'}
      </Button>
      {session?.user?.id !== props.userId && (
        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
          自分のプロフィールのみ編集できます
        </Typography>
      )}
    </Box>
  );
}
