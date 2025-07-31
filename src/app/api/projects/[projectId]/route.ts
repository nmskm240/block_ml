import { NextRequest, NextResponse } from 'next/server';
import container from '@/app/api/container';
import { IStorageService, StorageService } from '@/services/StorageService';
import {
  IProjectRepository,
  ProjectRepository,
} from '@/features/projects/repositories';
import {
  AuthService,
  IAuthService,
} from '@/features/auth/services/AuthService';
import { SaveProjectRequest, SaveProjectResponse } from '@/features/projects/api/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const body = (await request.json()) as SaveProjectRequest;
  const storage = container.resolve<IStorageService>(StorageService);
  const repository = container.resolve<IProjectRepository>(ProjectRepository);
  const service = container.resolve<IAuthService>(AuthService);

  const user = await service.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: プロジェクトの所有権確認

  await repository.updateProject(body.project);
  // await storage.uploadProjectAssets(params.id, ...data.files);

  const response: SaveProjectResponse = {};
  return NextResponse.json(response, {
    status: 200,
  });
}
