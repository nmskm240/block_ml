import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function useNavigateToMyPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return () => {
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }
    router.push(`/users/${session.user.id}`);
  };
}
