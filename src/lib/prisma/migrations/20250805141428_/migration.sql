/*
  Warnings:

  - You are about to drop the column `expires_at` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `verification_tokens` table. All the data in the column will be lost.
  - Added the required column `status` to the `project_assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires` to the `verification_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."verification_tokens_token_key";

-- AlterTable
ALTER TABLE "public"."project_assets" ADD COLUMN     "status" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."sessions" DROP COLUMN "expires_at",
ADD COLUMN     "expires" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."verification_tokens" DROP COLUMN "expires_at",
ADD COLUMN     "expires" TIMESTAMP(3) NOT NULL;
