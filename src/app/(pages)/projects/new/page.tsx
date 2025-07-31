import { NewProjectRedirectPageController } from './controller';
import { redirect } from 'next/navigation';

export default async function NewProjectRedirectPage() {
  const controller = new NewProjectRedirectPageController();
  const projectId = await controller.createNewProject();
  redirect(`/projects/${projectId}/edit`);
}
