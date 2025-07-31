import { Suspense } from 'react';
import { ProjectSummaryList } from '@/features/projects/components/ProjectSummaryList';
import { UserPageController } from './controller';

export default async function UserPage(props: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await props.params;
  const controller = new UserPageController(userId);

  return (
    <div>
      <Suspense fallback={<div>読み込み中...</div>}>
        <ProjectSummaryList fetchSummaries={() => controller.fetchProjectSummaries()} />
      </Suspense>
    </div>
  );
}
