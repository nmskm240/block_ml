import "reflect-metadata";
import { container } from "tsyringe";
import { PrismaClient } from "../lib/prisma";

// PrismaClientのインスタンスをシングルトンとして登録
container.registerSingleton<PrismaClient>("PrismaClient", PrismaClient);

export default { container };