'use client';

import { ProjectSummaryList } from '@/features/projects/components/ProjectSummaryList';
import { useProjectApiClient } from '@/features/projects/providers/ApiClientProvider';
import { ProjectSummaryDto } from '@/features/projects/types';
import { CircularProgress } from '@mui/material';
import React from 'react';

type Props = {
  userId: string;
};

// TODO: offset, limitで表示上限を決める
export function UserProjects({ userId }: Props) {
  const projectApiClient = useProjectApiClient();
  const [summaries, setSummaries] = React.useState<ProjectSummaryDto[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    const fetcher = async () => {
      try {
        setLoading(true);
        const res = await projectApiClient.getProjectSummaries({ userId });
        if (!cancelled) {
          setSummaries(res.projectSummaries);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          console.error('Failed to fetch project summaries:', e);
          setSummaries([]);
          setLoading(false);
        }
      }
    };
    fetcher();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading)
    return (
      <center>
        <CircularProgress />
      </center>
    );

  return <ProjectSummaryList summaries={summaries} />;
}
