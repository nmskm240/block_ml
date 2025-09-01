import { searchProject } from '@/features/searchProject';
import { ProjectSummaryList } from '@/features/searchProject/components';

type Params = {
  userId: string;
};

export default async function UserPage(props: { params: Promise<Params> }) {
  const { userId } = await props.params;
  const summaries = await searchProject({ userId: userId });
  return (
    <div>
      <ProjectSummaryList summaries={summaries} />
    </div>
  );
}
