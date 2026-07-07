-- CreateTable
CREATE TABLE `Post` (
    `id` VARCHAR(191) NOT NULL,
    `category` ENUM('NOTICE', 'RECRUIT', 'EVENT', 'CAMPAIGN') NOT NULL DEFAULT 'NOTICE',
    `title` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `authorId` VARCHAR(191) NULL,
    `authorName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Post_published_createdAt_idx`(`published`, `createdAt`),
    INDEX `Post_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
