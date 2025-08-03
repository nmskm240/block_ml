'use client';

import { Header } from '@/components';
import { useCreateProjectAndRedirect } from '@/features/projects/hooks/useCreateAndRedirectProject';

import '@/styles/globals.css';
import { Button } from '@mui/material';

export default function IndexPage() {
  const createProjectAndRedirect = useCreateProjectAndRedirect();
  return (
    <div>
      <Header />
      <Button onClick={() => createProjectAndRedirect()}>
        新しいプロジェクトを作成
      </Button>
    </div>
  );
}
