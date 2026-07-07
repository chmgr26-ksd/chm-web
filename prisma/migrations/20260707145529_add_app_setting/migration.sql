-- CreateTable
CREATE TABLE `AppSetting` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'singleton',
    `mailEnabled` BOOLEAN NOT NULL DEFAULT false,
    `mailRecipients` TEXT NULL,
    `smtpHost` VARCHAR(191) NULL,
    `smtpPort` INTEGER NULL DEFAULT 587,
    `smtpUser` VARCHAR(191) NULL,
    `smtpPassEnc` TEXT NULL,
    `smtpFrom` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
