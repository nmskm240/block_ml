import { NextRequest, NextResponse } from 'next/server';
import container from '@/app/api/container';
import { AuthService } from '@/features/auth/services/AuthService';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import { PostProjectRequest, PostProjectResponse } from '@/lib/api/types/api';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PostProjectRequest;
    if (!body) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const authService = container.resolve(AuthService);
    const projectRepository = container.resolve(ProjectRepository);

    const user = await authService.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // MEMO: 空プロジェクト作成のAPIになる場合はユースケースも切り分ける
    const saved = await projectRepository.save({ userId: user.id, projectId: "" });
    const response: PostProjectResponse = {
      projectId: saved.id,
      blocklyJson: saved.workspaceJson?.toString(),
      files: []
    };
    // FIXME: redirectでいいのでは？
    return NextResponse.json(response, { status: 201 });
  } catch (e) {
    console.error('POST /api/blockly error:', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
