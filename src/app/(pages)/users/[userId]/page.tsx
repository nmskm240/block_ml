import { ProjectSummaryList } from '@/features/projects/components/ProjectSummaryList';
import { searchProjectSumamries } from '@/features/projects/usecases';
import UserProfile from '@/features/users/profile/components/UserProfile';
import 'reflect-metadata';

type Params = {
  userId: string;
};

export default async function UserPage(props: { params: Params }) {
  const { userId } = props.params;
  const summaries = await searchProjectSumamries({ userId: userId });
  return (
    <div>
      <UserProfile userId={userId} />
      <ProjectSummaryList summaries={summaries} />
    </div>
  );
}
