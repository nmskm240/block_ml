'use client';

import { Button } from '@mui/material';

import { useRouter } from 'next/navigation';

import { trashProject } from '../action';

type Props = {
  projectId: string;
};

export function TrashProjectButton({ projectId }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this project?')) {
      await trashProject(projectId);
      router.push('/projects');
    }
  };

  return (
    <Button variant="contained" color="error" onClick={handleDelete}>
      Delete Project
    </Button>
  );
}
