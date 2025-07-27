import {
  GetUserRequest,
  GetUserResponse,
  UserRouteParams,
} from '@/lib/api/types/api';
import {
  IProjectRepository,
  ProjectRepository,
} from '@/repositories/ProjectRepository';
import { ProjectSummary } from '@/types/app';
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';

export async function GET(
  request: NextRequest,
  { params }: { params: UserRouteParams }
) {
  try {
    const data = (await request.json()) as GetUserRequest;
    if (!data) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const repository = container.resolve<IProjectRepository>(ProjectRepository);
    const projects = await repository.getProjectsByUserId(params.id);
    const response: GetUserResponse = {
      // TODO: name, titleは正式なものにする
      profile: { id: params.id, name: 'hoge' },
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
