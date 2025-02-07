-- CreateTable
CREATE TABLE `tb_product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` INTEGER NULL,
    `stock` INTEGER NULL,
    `typeId` VARCHAR(191) NULL,
    `supplierId` VARCHAR(191) NULL,
    `product_code` VARCHAR(191) NULL,
    `title` VARCHAR(191) NULL,
    `facility_instance` VARCHAR(191) NULL,
    `rsvp_link` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `createDate` VARCHAR(191) NULL,
    `createUserId` VARCHAR(191) NULL,
    `ModifieldDate` VARCHAR(191) NULL,
    `ModifieldUserId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_user` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
