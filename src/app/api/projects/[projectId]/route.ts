import { NextResponse } from 'next/server';
import { withTransaction } from '@/lib/di/container';
import {
  SaveProjectRequestSchema,
  SaveProjectResponse,
} from '@/features/projects/api/types';
import { auth } from '@/lib/nextAuth/auth';
import { prisma } from '@/lib/prisma/prisma';
import UpdateProjectUsecase from '@/features/projects/usecases/updateProjectUsecase';

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
  });
  const assets = form
    .getAll('assets')
    .filter((f): f is File => f instanceof File);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid data', details: parsed.error.message },
      { status: 400 }
    );
  }
  return prisma.$transaction(async (tx) => {
    const container = withTransaction(tx);
    const usecase = container.resolve(UpdateProjectUsecase);

    try {
      await usecase.execute(session.user.id, {
        id: projectId,
        json: parsed.data.projectJson!.toString(),
        assets: assets,
      });
      return NextResponse.json<SaveProjectResponse>(
        {},
        {
          status: 200,
        }
      );
    } catch (e) {
      return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
  });
});
