import { auth } from '@/lib/nextAuth/auth';
import { NextResponse } from 'next/server';

type Params = Promise<{ projectId: string }>;

export const GET = auth(async (request, context: { params: Params }) => {
  const session = request.auth;
  const { projectId } = await context.params;
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
});
