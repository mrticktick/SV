/*
  Warnings:

  - You are about to drop the column `ModifieldDate` on the `tb_product` table. All the data in the column will be lost.
  - You are about to drop the column `createDate` on the `tb_product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tb_product` DROP COLUMN `ModifieldDate`,
    DROP COLUMN `createDate`,
    ADD COLUMN `createdAt` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` VARCHAR(191) NULL;
