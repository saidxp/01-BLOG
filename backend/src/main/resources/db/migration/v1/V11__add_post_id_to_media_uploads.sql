ALTER TABLE media_uploads
  ADD COLUMN post_id BIGINT REFERENCES posts(id) ON DELETE SET NULL;
  -- INDEX POINTER FOR FAST LOOKUP 
CREATE INDEX idx_media_uploads_post_id ON media_uploads(post_id); 