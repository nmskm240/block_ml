'use client';

import { useState, useRef } from 'react';
import { Avatar, Button, Box, Typography, CircularProgress } from '@mui/material';
import { useSession } from 'next-auth/react';
import { UserApiClient } from '@/features/users/api/client';
import UserAvatar from '../../components/UserAvatar';

type Props = {
  userId: string;
};

export default function UserProfile(props: Props) {
  const { data: session, update: updateSession } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const userApiClient = new UserApiClient();
      const { imageUrl: newImageUrl } = await userApiClient.uploadUserIcon(props.userId, file);
      // setImageUrl(newImageUrl);
      // セッション情報を更新
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
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
};
