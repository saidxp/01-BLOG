-- Add new columns as nullable first <!!> 
ALTER TABLE posts
  ADD COLUMN title VARCHAR(255),
  ADD COLUMN content TEXT;

-- Step 2: Backfill existing rows using their old description as content
UPDATE posts
SET title = 'Untitled',
    content = description
WHERE content IS NULL;

-- Step 3: Now enforce NOT NULL, since every row has a value
ALTER TABLE posts
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN content SET NOT NULL;

-- Step 4: Drop the old column
ALTER TABLE posts
  DROP COLUMN description;