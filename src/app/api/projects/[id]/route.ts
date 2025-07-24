import { NextRequest, NextResponse } from 'next/server';
import {
  ProjectRouteParams,
  PutProjectRequest,
  PutProjectResponse,
} from '@/lib/api/types/api';
import container from '@/app/api/container';
import { IStorageService, StorageService } from '@/services/StorageService';
import {
  IProjectRepository,
  ProjectRepository,
} from '@/repositories/ProjectRepository';
import {
  AuthService,
  IAuthService,
} from '@/features/auth/services/AuthService';

export async function PUT(
  request: NextRequest,
  { params }: { params: ProjectRouteParams }
) {
  try {
    const formData = await request.formData();
    const data: PutProjectRequest = {
      projectId: params.id,
      blocklyJson: JSON.parse(formData.get('blocklyJson') as string),
      files: formData.getAll('files') as File[],
    };

    const storage = container.resolve<IStorageService>(StorageService);
    const repository = container.resolve<IProjectRepository>(ProjectRepository);
    const service = container.resolve<IAuthService>(AuthService);

    const user = await service.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: プロジェクトの所有権確認

    await repository.save(
      { userId: user.id, projectId: params.id },
      data.blocklyJson
    );
    await storage.uploadProjectAssets(params.id, ...data.files);

    const response: PutProjectResponse = {};
    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error('Error saving project:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
