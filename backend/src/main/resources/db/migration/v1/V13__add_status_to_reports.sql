ALTER TABLE reports
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'PENDING';

ALTER TABLE reports
    ADD CONSTRAINT chk_report_status
    CHECK (status IN ('PENDING', 'RESOLVED'));

