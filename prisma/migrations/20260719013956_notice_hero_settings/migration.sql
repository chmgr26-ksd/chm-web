-- AlterTable: 랜딩 공지 배너(NoticeHero) 설정 컬럼
ALTER TABLE `AppSetting` ADD COLUMN `noticeHeroInterval` INTEGER NULL,
    ADD COLUMN `noticeRollInterval` INTEGER NULL,
    ADD COLUMN `noticeGradient` VARCHAR(191) NULL,
    ADD COLUMN `noticeExcerptLen` INTEGER NULL,
    ADD COLUMN `noticeAutoplay` BOOLEAN NULL,
    ADD COLUMN `noticeShowRoller` BOOLEAN NULL;
