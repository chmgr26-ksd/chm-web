-- AlterTable
ALTER TABLE `PageView` ADD COLUMN `referrer` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `PageView_referrer_idx` ON `PageView`(`referrer`);
