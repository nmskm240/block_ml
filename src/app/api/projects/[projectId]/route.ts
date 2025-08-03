import { NextRequest, NextResponse } from 'next/server';
import container from '@/lib/container';
import { IStorageService, StorageService } from '@/services/StorageService';
import {
  IProjectRepository,
  ProjectRepository,
} from '@/features/projects/repositories';
import {
  SaveProjectRequest,
  SaveProjectResponse,
} from '@/features/projects/api/types';
import { auth } from '@/lib/nextAuth/auth';

export const PUT = auth(async (request) => {
  const body = (await request.json()) as SaveProjectRequest;
  const storage = container.resolve<IStorageService>(StorageService);
  const repository = container.resolve<IProjectRepository>(ProjectRepository);

  const session = request.auth;
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: プロジェクトの所有権確認

  await repository.updateProject(body.project);
  // await storage.uploadProjectAssets(params.id, ...data.files);

  const response: SaveProjectResponse = {};
  return NextResponse.json(response, {
    status: 200,
  });
});
