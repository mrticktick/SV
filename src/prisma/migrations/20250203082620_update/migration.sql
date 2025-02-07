/*
  Warnings:

  - You are about to drop the column `ModifieldUserId` on the `tb_product` table. All the data in the column will be lost.
  - You are about to drop the column `createUserId` on the `tb_product` table. All the data in the column will be lost.
  - You are about to drop the column `facility_instance` on the `tb_product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tb_product` DROP COLUMN `ModifieldUserId`,
    DROP COLUMN `createUserId`,
    DROP COLUMN `facility_instance`,
    ADD COLUMN `available_amount` DOUBLE NULL,
    ADD COLUMN `createdBy` VARCHAR(191) NULL,
    ADD COLUMN `updatedBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `tb_user` ADD COLUMN `createdBy` VARCHAR(191) NULL,
    ADD COLUMN `updatedBy` VARCHAR(191) NULL;
