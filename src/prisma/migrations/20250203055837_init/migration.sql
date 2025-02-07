/*
  Warnings:

  - You are about to drop the column `name` on the `tb_user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `tb_user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `tb_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `tb_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tb_user` DROP COLUMN `name`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `role` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `tb_user_email_key` ON `tb_user`(`email`);
