-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('X', 'LINKEDIN', 'PEERLIST');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "streak_no" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyLog" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "proof_url" TEXT,
    "log_date" DATE NOT NULL,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialPost" (
    "id" TEXT NOT NULL,
    "daily_log_id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "content" TEXT NOT NULL,
    "scheduled_for" TIMESTAMP(3),
    "created_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "DailyLog_user_id_log_date_idx" ON "DailyLog"("user_id", "log_date");

-- CreateIndex
CREATE INDEX "SocialPost_status_scheduled_for_idx" ON "SocialPost"("status", "scheduled_for");

-- AddForeignKey
ALTER TABLE "DailyLog" ADD CONSTRAINT "DailyLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPost" ADD CONSTRAINT "SocialPost_daily_log_id_fkey" FOREIGN KEY ("daily_log_id") REFERENCES "DailyLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
