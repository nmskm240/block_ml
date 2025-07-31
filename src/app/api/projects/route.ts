import { NextRequest, NextResponse } from 'next/server';
import container from '@/app/api/container';
import { AuthService } from '@/features/auth/services/AuthService';
import { ProjectRepository } from '@/features/projects/repositories';
import {
  CreateProjectRequest,
  CreateProjectResponse,
  GetProjectsRequest,
  GetProjectsResponse,
} from '@/features/projects/api/types';
import { Project } from '@/features/projects/domains';

// プロジェクトを新規作成する
export async function POST(request: NextRequest) {
  const authService = container.resolve(AuthService);
  const projectRepository = container.resolve(ProjectRepository);
  const session = await authService.getSession();
  const body = (await request.json()) as CreateProjectRequest;
  if (!body) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  if (session?.user.id) {
    let project = Project.empty(session.user.id);
    project = await projectRepository.createProject(project);
    const response: CreateProjectResponse = {
      project: project,
    };
    return NextResponse.json(response, { status: 201 });
  } else {
    const project = Project.empty();
    const response: CreateProjectResponse = {
      project,
    };
    return NextResponse.json(response, { status: 200 });
  }
}

// プロジェクトをフィルタリングする
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const params: GetProjectsRequest = {
    userId: searchParams.get('userId') ?? undefined,
  };

  // NOTE: 現時点ではuserId指定必須とする
  if (!params.userId) {
    return NextResponse.json('Coming soon..', { status: 400 });
  }

  const projectRepository = container.resolve(ProjectRepository);
  const projects = await projectRepository.getProjectsByUserId(params.userId);

  const response: GetProjectsResponse = {
    projects: projects.map((p) => {
      return {
        id: p.id!,
        title: p.title,
        updatedAt: p.updatedAt!,
      };
    }),
  };

  return NextResponse.json(response, { status: 200 });
}
