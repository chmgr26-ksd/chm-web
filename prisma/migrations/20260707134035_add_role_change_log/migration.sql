-- CreateTable
CREATE TABLE `RoleChangeLog` (
    `id` VARCHAR(191) NOT NULL,
    `actorId` VARCHAR(191) NULL,
    `actorEmail` VARCHAR(191) NOT NULL,
    `targetId` VARCHAR(191) NULL,
    `targetEmail` VARCHAR(191) NOT NULL,
    `fromRole` ENUM('USER', 'STAFF', 'ADMIN') NOT NULL,
    `toRole` ENUM('USER', 'STAFF', 'ADMIN') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `RoleChangeLog_createdAt_idx`(`createdAt`),
    INDEX `RoleChangeLog_targetId_idx`(`targetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
