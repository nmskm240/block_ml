import 'reflect-metadata';
import { ProjectSummaryList } from '@/features/projects/components/ProjectSummaryList';
import { searchProjectSumamries } from '@/features/projects/usecases/searchProjectSummaries';

type Params = {
  userId: string;
};

export default async function UserPage(props: { params: Params }) {
  const { userId } = props.params;
  const summaries = await searchProjectSumamries({ userId: userId });
  return (
    <div>
      <ProjectSummaryList summaries={summaries} />
    </div>
  );
}
