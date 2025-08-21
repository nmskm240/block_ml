import { auth } from '@/lib/nextAuth/auth';
import { NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { Token } from '@/lib/di/types';
import { IUserRepository } from '@/features/users/repositories';
import { IUserStorageService } from '@/features/users/services/userStorageService';

type Params = { userId: string };

export const PUT = auth(async (request, context: { params: Params }) => {
  const session = request.auth;
  const { userId } = context.params;
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if the current user is the owner of the profile
  if (session.user?.id !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const userStorageService = container.resolve<IUserStorageService>(Token.UserStorageService);
  const imageUrl = await userStorageService.uploadUserIcon(userId, file);

  const userRepository = container.resolve<IUserRepository>(Token.UserRepository);
  const user = await userRepository.findById(userId);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  user.updateImage(imageUrl);
  await userRepository.update(user);

  return NextResponse.json({ imageUrl });
});