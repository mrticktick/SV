/*
  Warnings:

  - You are about to drop the column `address` on the `tb_product` table. All the data in the column will be lost.
  - You are about to drop the column `available_amount` on the `tb_product` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `tb_product` table. All the data in the column will be lost.
  - You are about to drop the column `product_code` on the `tb_product` table. All the data in the column will be lost.
  - You are about to drop the column `rsvp_link` on the `tb_product` table. All the data in the column will be lost.
  - You are about to drop the column `supplierId` on the `tb_product` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `tb_product` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `tb_product` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `tb_product` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `tb_user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `tb_user` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `tb_product` table without a default value. This is not possible if the table is not empty.
  - Made the column `price` on table `tb_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stock` on table `tb_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `tb_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `tb_product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `tb_product` DROP COLUMN `address`,
    DROP COLUMN `available_amount`,
    DROP COLUMN `createdBy`,
    DROP COLUMN `product_code`,
    DROP COLUMN `rsvp_link`,
    DROP COLUMN `supplierId`,
    DROP COLUMN `title`,
    DROP COLUMN `typeId`,
    DROP COLUMN `updatedBy`,
    ADD COLUMN `categoryId` VARCHAR(191) NOT NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `price` DECIMAL(10, 2) NOT NULL,
    MODIFY `stock` INTEGER NOT NULL DEFAULT 0,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `tb_user` DROP COLUMN `createdBy`,
    DROP COLUMN `updatedBy`,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `tb_category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tb_category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_order` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `totalAmount` DECIMAL(10, 2) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_orderItem` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_product` ADD CONSTRAINT `tb_product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `tb_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_order` ADD CONSTRAINT `tb_order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `tb_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_orderItem` ADD CONSTRAINT `tb_orderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `tb_order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_orderItem` ADD CONSTRAINT `tb_orderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `tb_product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
