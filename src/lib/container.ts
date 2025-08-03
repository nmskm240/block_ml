import 'reflect-metadata';
import { container } from 'tsyringe';
import {
  IProjectRepository,
  ProjectRepository,
} from '@/features/projects/repositories';
import { IStorageService, StorageService } from '@/services/StorageService';
import { IUserRepository, UserRepository } from '@/features/users/repositories';
import { AuthService, IAuthService } from '@/features/users/services/authService';

// TODO: トランザクションはスコープ単位で切るようにする
container.registerSingleton<IProjectRepository>(ProjectRepository);
container.registerSingleton<IUserRepository>(UserRepository);
container.registerSingleton<IStorageService>(StorageService);
// TODO: スコープでもいいかもしれない
container.registerSingleton<IAuthService>(AuthService);

export default container;
