import { Suspense } from 'react';
import { UserProjectList } from '@/features/profile/components/UserProjectList';

export default async function UserPage(props: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await props.params;

  return (
    <div>
      <h1>{userId} のプロジェクト</h1>
      <Suspense fallback={<div>読み込み中...</div>}>
        <UserProjectList userId={userId} />
      </Suspense>
    </div>
  );
}
