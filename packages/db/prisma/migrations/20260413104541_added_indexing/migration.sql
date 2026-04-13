-- CreateIndex
CREATE INDEX "DailyLog_user_id_log_date_idx" ON "DailyLog"("user_id", "log_date");

-- CreateIndex
CREATE INDEX "SocialPost_status_scheduled_for_idx" ON "SocialPost"("status", "scheduled_for");
