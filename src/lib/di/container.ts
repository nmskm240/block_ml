import 'reflect-metadata';
import { Prisma, PrismaClient } from '@prisma/client';
import { container, DependencyContainer } from 'tsyringe';

import { Token } from './types';

export default container;

export async function withTransactionScope<T>(
  process: (child: DependencyContainer) => Promise<T>,
) {
  const client = container.resolve<PrismaClient>(Token.PrismaClient);
  const child = container.createChildContainer();

  return await client.$transaction(async (tx) => {
    child.registerInstance<Prisma.TransactionClient>(Token.PrismaClient, tx);
    return await process(child);
  });
}
