/*
  Warnings:

  - The primary key for the `project_assets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `project_assets` table. All the data in the column will be lost.
  - You are about to drop the column `file_name` on the `project_assets` table. All the data in the column will be lost.
  - You are about to drop the column `file_path` on the `project_assets` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `project_assets` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `project_assets` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `project_assets` table. All the data in the column will be lost.
  - Added the required column `asset_id` to the `project_assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."project_assets" DROP CONSTRAINT "project_assets_pkey",
DROP COLUMN "created_at",
DROP COLUMN "file_name",
DROP COLUMN "file_path",
DROP COLUMN "id",
DROP COLUMN "status",
DROP COLUMN "updated_at",
ADD COLUMN     "asset_id" TEXT NOT NULL,
ADD COLUMN     "deleteFlag" BOOLEAN NOT NULL DEFAULT false,
ADD CONSTRAINT "project_assets_pkey" PRIMARY KEY ("project_id", "asset_id");

-- CreateTable
CREATE TABLE "public"."assets" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assets_file_path_key" ON "public"."assets"("file_path");

-- AddForeignKey
ALTER TABLE "public"."project_assets" ADD CONSTRAINT "project_assets_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
