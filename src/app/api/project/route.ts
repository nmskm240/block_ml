import { NextRequest, NextResponse } from 'next/server';
import container from '@/app/api/container';
import { BlocklyUsecase } from '@/usecases';
import { AuthService } from '@/features/auth/services/AuthService';
import { ProjectRepository } from '@/repositories/ProjectRepository';
import { SaveProjectRequest, SaveProjectResponse } from '@/lib/api/types/api';

// MEMO: 空プロジェクト作成のAPIとしたほうが適切かもしれない
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SaveProjectRequest;
    if (typeof body.data !== 'string') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const authService = container.resolve(AuthService);
    const projectRepository = container.resolve(ProjectRepository);

    const user = await authService.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // MEMO: 空プロジェクト作成のAPIになる場合はユースケースも切り分ける
    const saved = await projectRepository.save({ userId: user.id, projectId: "" }, body.data);
    const response: SaveProjectResponse = { projectId: saved.id };
    return NextResponse.json(response, { status: 201 });
  } catch (e) {
    console.error('POST /api/blockly error:', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
