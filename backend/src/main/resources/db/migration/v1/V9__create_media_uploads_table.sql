CREATE TABLE media_uploads (
    id BIGSERIAL PRIMARY KEY,
    url VARCHAR(500) NOT NULL,
    uploaded_by BIGINT NOT NULL,
    is_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_media_upload_user
        FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);