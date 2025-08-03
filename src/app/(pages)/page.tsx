'use client';

import useCreateProjectAndRedirect from '@/features/projects/hooks/useCreateAndRedirectProject';
import useNavigateToMyPage from '@/features/users/profile/hooks/useNavvigateToMyPage';

import '@/styles/globals.css';
import { Button } from '@mui/material';

export default function IndexPage() {
  const createProjectAndRedirect = useCreateProjectAndRedirect();
  const navigateToMyPage = useNavigateToMyPage();
  return (
    <div>
      <Button onClick={() => createProjectAndRedirect()}>
        新しいプロジェクトを作成
      </Button>
      <Button onClick={() => navigateToMyPage()} >
        マイページに移動
      </Button>
    </div>
  );
}
