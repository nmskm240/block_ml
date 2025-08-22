'use client';

import useCreateProjectAndRedirect from '@/features/projects/hooks/useCreateAndRedirectProject';

import { Button } from '@mui/material';

export default function IndexPage() {
  const createProjectAndRedirect = useCreateProjectAndRedirect();
  return (
    <div className='global-page-padding'>
      <Button onClick={() => createProjectAndRedirect()}>
        新しいプロジェクトを作成
      </Button>
      <Button >
        マイページに移動
      </Button>
    </div>
  );
}
