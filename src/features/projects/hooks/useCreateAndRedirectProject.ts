import { useRouter } from 'next/navigation';
import { useProjectApiClient } from '../providers/ApiClientProvider';

export default function useCreateProjectAndRedirect() {
  const router = useRouter();
  const client = useProjectApiClient();

  return async () => {
    const response = await client.createProject({});
    router.push(`/projects/${response.projectId}/edit`);
  };
}
