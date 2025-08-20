import {
  type GetEditingProjectResponse,
  SaveProjectRequestSchema,
  SaveProjectResponse,
} from '@/features/projects/api/types';
import { updateProject } from '@/features/projects/usecases';
import FetchEditableProjectUsecase from '@/features/projects/usecases/fetchEditableProject';
import { withTransactionScope } from '@/lib/di/container';
import { auth } from '@/lib/nextAuth/auth';
import { NextResponse } from 'next/server';

type Params = Promise<{ projectId: string }>;

export const PUT = auth(async (request, context: { params: Params }) => {
  const session = request.auth;
  const { projectId } = await context.params;
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await request.formData();
  const parsed = SaveProjectRequestSchema.safeParse({
    projectJson: form.get('projectJson'),
    assets: form.getAll('assets').filter((f): f is File => f instanceof File),
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid data', details: parsed.error.message },
      { status: 400 }
    );
  }

  try {
    await updateProject(session.user.id, {
      id: projectId,
      json: parsed.data.projectJson!.toString(),
      assets: parsed.data.assets!.filter((f) => f !== undefined),
    });

    return NextResponse.json<SaveProjectResponse>(
      {},
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
});

export const GET = auth(async (request, context: { params: Params }) => {
  const session = request.auth;
  const { projectId } = await context.params;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return withTransactionScope(async (container) => {
    container.register(
      FetchEditableProjectUsecase,
      FetchEditableProjectUsecase
    );
    const usecase = container.resolve(FetchEditableProjectUsecase);

    try {
      const response = await usecase.execute(projectId, session.user.id);
      return NextResponse.json(response, { status: 200 });
    } catch (e) {
      return NextResponse.json(
        { error: (e as Error).message },
        { status: 404 }
      );
    }
  });
});
