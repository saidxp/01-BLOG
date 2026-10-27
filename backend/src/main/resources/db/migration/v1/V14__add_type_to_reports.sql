-- 1. add the column as nullable so existing rows don't fail
ALTER TABLE reports
    ADD COLUMN type VARCHAR(10);

-- 2. backfill the old rows: a report with a post is a POST report, otherwise USER
UPDATE reports
SET type = CASE WHEN post_id IS NOT NULL THEN 'POST' ELSE 'USER' END;

-- 3. now make it required and restrict the values
ALTER TABLE reports
    ALTER COLUMN type SET NOT NULL;
    
ALTER TABLE reports
    ADD CONSTRAINT chk_report_type CHECK (type IN ('POST', 'USER'));