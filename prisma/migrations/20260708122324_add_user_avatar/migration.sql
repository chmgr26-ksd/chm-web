-- AlterTable
ALTER TABLE `User` ADD COLUMN `avatar` LONGBLOB NULL,
    ADD COLUMN `avatarUpdatedAt` DATETIME(3) NULL;
