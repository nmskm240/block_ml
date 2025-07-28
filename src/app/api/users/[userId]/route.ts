import { GetUserResponse, UserRouteParams } from '@/lib/api/types/api';
import container from '@/app/api/container';
import {
  IProjectRepository,
  ProjectRepository,
} from '@/repositories/ProjectRepository';
import { ProjectSummary } from '@/types/app';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<UserRouteParams> }
) {
  try {
    const { userId } = await params;
    const repository = container.resolve<IProjectRepository>(ProjectRepository);
    const projects = await repository.getProjectsByUserId(userId);
    const response: GetUserResponse = {
      // TODO: name, titleは正式なものにする
      profile: { id: userId, name: 'hoge' },
      projectSummaries: projects.map<ProjectSummary>((project) => ({
        id: project.id,
        title: 'test',
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      })),
    };
    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    console.error('GET /api/users/user_id error: ', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
