-- AlterTable
ALTER TABLE `AppSetting` ADD COLUMN `companyEn` VARCHAR(191) NULL,
    ADD COLUMN `companyKo` VARCHAR(191) NULL,
    ADD COLUMN `contactAddress` VARCHAR(191) NULL,
    ADD COLUMN `contactAddressDetail` TEXT NULL,
    ADD COLUMN `contactEmail` VARCHAR(191) NULL,
    ADD COLUMN `contactHours` TEXT NULL,
    ADD COLUMN `contactPhone` VARCHAR(191) NULL,
    ADD COLUMN `contactRep` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `SiteImage` (
    `key` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `data` LONGBLOB NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
