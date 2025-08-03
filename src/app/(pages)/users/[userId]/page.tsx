import { UserProjects } from '@/features/users/profile/components/UserProjects';

export default async function UserPage(props: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await props.params;
  return (
    <div>
      <UserProjects userId={userId} />
    </div>
  );
}
