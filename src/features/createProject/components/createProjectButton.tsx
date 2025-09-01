'use client';

import { Button } from '@mui/material';

import { useRouter } from 'next/navigation';

import { createProject } from '../actions';

export function CreateProjectButton() {
  const router = useRouter();

  const onclickHandle = async () => {
    const { projectId } = await createProject();
    router.push(`/projects/${projectId}/edit`);
  };
  return <Button onClick={() => onclickHandle()}>新規プロジェクト</Button>;
}
