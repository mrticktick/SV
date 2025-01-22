-- CreateTable
CREATE TABLE `tb_product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `stock` INTEGER NOT NULL,
    `typeId` VARCHAR(191) NOT NULL,
    `supplierId` VARCHAR(191) NOT NULL,
    `product_code` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `facility_instance` VARCHAR(191) NOT NULL,
    `rsvp_link` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `createDate` VARCHAR(191) NOT NULL,
    `createUserId` VARCHAR(191) NOT NULL,
    `ModifieldDate` VARCHAR(191) NOT NULL,
    `ModifieldUserId` VARCHAR(191) NOT NULL,

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
