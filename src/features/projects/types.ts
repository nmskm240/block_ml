import { ProjectEntity } from "@/lib/prisma/client";

export type ProjectEntityInput = Omit<ProjectEntity, 'createdAt' | 'updatedAt' | "statusUpdatedAt">;
