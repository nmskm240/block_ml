/*
  Warnings:

  - Added the required column `title` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Made the column `workspace_json` on table `projects` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'TRASH');

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "status_updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "workspace_json" SET NOT NULL,
ALTER COLUMN "workspace_json" SET DEFAULT '{}';
