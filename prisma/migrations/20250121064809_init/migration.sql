-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `descripttion` VARCHAR(191) NULL,
    `refreshToken` VARCHAR(191) NULL,
    `language` VARCHAR(191) NOT NULL,
    `localId` INTEGER NULL,
    `memberTypeId` INTEGER NULL,
    `catelogyId` INTEGER NULL,
    `productTypeId` INTEGER NULL,
    `shopId` INTEGER NULL,
    `descriptionId` INTEGER NULL,
    `propertiesId` INTEGER NULL,
    `imageId` INTEGER NULL,
    `avatar_url` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `village_id` VARCHAR(191) NULL,
    `province_id` INTEGER NULL,
    `district_id` INTEGER NULL,
    `country_id` INTEGER NULL,
    `telephone` VARCHAR(191) NULL,
    `createDate` DATETIME(3) NULL,
    `createUserId` INTEGER NULL,
    `ModifieldDate` DATETIME(3) NULL,
    `ModifieldUserId` INTEGER NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `typeId` INTEGER NULL,
    `supplierId` INTEGER NULL,
    `product_code` VARCHAR(191) NULL,
    `title` VARCHAR(191) NULL,
    `facility_instance` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `rsvp_link` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `createDate` DATETIME(3) NULL,
    `createUserId` INTEGER NULL,
    `ModifieldDate` DATETIME(3) NULL,
    `ModifieldUserId` INTEGER NULL,

    UNIQUE INDEX `Products_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
