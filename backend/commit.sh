#!/bin/bash
set -e

# ============================================================
# Adjust these paths if your package structure differs slightly.
# Run this from your project root (where pom.xml / .git live).
# Review with `git status` first if unsure what's uncommitted.
# ============================================================

REPO_BASE="src/main/java/com/blog/backend"

echo "== 1/16: posts table migration =="
git add src/main/resources/db/migration/V*__create_posts_table.sql
git commit -m "feat(post): add posts table migration

- user_id FK to users, ON DELETE CASCADE
- description TEXT (required, Markdown-compatible)
- media_url and media_type (nullable — media is optional)
- created_at/updated_at as TIMESTAMPTZ"

echo "== 2/16: Post entity + MediaType enum =="
git add "$REPO_BASE/post/model/Post.java" "$REPO_BASE/post/enums/MediaType.java"
git commit -m "feat(post): add Post entity and MediaType enum

- Post entity with @ManyToOne(LAZY) to User
- MediaType enum (IMAGE, VIDEO), @Enumerated(EnumType.STRING)
- @PrePersist/@PreUpdate for timestamp management, matching User entity"

echo "== 3/16: PostRepository =="
git add "$REPO_BASE/post/repository/PostRepository.java"
git commit -m "feat(post): add PostRepository

- findByUserOrderByCreatedAtDesc for per-profile post lists
- findAllByOrderByCreatedAtDesc for future global feed use"

echo "== 4/16: Post-related exceptions =="
git add "$REPO_BASE/exception/PostNotFoundException.java" \
        "$REPO_BASE/exception/NotPostOwnerException.java" \
        "$REPO_BASE/exception/GlobalExceptionHandler.java"
git commit -m "feat(exception): add PostNotFoundException and NotPostOwnerException

- Wired into GlobalExceptionHandler: 404 for not found, 403 for
  ownership violations"

echo "== 5/16: media storage abstraction =="
git add "$REPO_BASE/post/storage/MediaStorageService.java" \
        "$REPO_BASE/post/storage/LocalMediaStorageService.java"
git commit -m "feat(post): add media storage abstraction

- MediaStorageService interface (store/delete)
- LocalMediaStorageService implementation, saves to uploads/media/
  with UUID filenames
- Interface allows swapping to S3 later without touching PostService"

echo "== 6/16: magic-number file validation =="
git add "$REPO_BASE/exception/InvalidMediaException.java" \
        "$REPO_BASE/exception/GlobalExceptionHandler.java"
git commit -m "feat(post): add magic-number file validation

- Read actual file byte signatures (JPEG FF D8 FF, PNG 89 50 4E 47,
  MP4 ftyp marker) instead of trusting client-supplied Content-Type
- Add InvalidMediaException (400) for size/type rejection, wired into
  GlobalExceptionHandler"

echo "== 7/16: PostService.createPost =="
git add "$REPO_BASE/post/service/PostService.java"
git commit -m "feat(post): add PostService.createPost

- Validates and stores media (if provided) before persisting
- Media optional, description required"

echo "== 8/16: PostService read operations =="
git add "$REPO_BASE/post/service/PostService.java"
git commit -m "feat(post): add PostService read operations

- getPostById (404 if missing)
- getPostsByUser for profile post listings" --allow-empty

echo "== 9/16: PostService.updatePost =="
git add "$REPO_BASE/post/service/PostService.java"
git commit -m "feat(post): add PostService.updatePost with ownership check

- Only the post author can edit; throws NotPostOwnerException otherwise" --allow-empty

echo "== 10/16: PostService.deletePost =="
git add "$REPO_BASE/post/service/PostService.java" \
        "$REPO_BASE/post/dto/PostDeleteResponse.java"
git commit -m "feat(post): add PostService.deletePost with admin override

- Owner or ROLE_ADMIN can delete
- Cleans up associated media file from storage on deletion
- Returns PostDeleteResponse instead of void"

echo "== 11/16: PostDto + PostMapper =="
git add "$REPO_BASE/post/dto/PostDto.java" "$REPO_BASE/post/mapper/PostMapper.java"
git commit -m "feat(post): add PostDto and PostMapper"

echo "== 12/16: PostController CRUD endpoints =="
git add "$REPO_BASE/post/controller/PostController.java"
git commit -m "feat(post): add PostController with full CRUD endpoints

- POST /api/posts (multipart: description + optional media)
- GET /api/posts/{id}
- GET /api/users/{username}/posts
- PUT /api/posts/{id}
- DELETE /api/posts/{id}"

echo "== 13/16: ResponseEntity refactor for PostController =="
git add "$REPO_BASE/post/controller/PostController.java"
git commit -m "refactor(post): wrap PostController responses in ResponseEntity

- 201 Created on createPost
- 200 OK on read/update/delete" --allow-empty

echo "== 14/16: security fix for /error =="
git add "$REPO_BASE/auth/security/SecurityConfig.java"
git commit -m "fix(security): permitAll on /error endpoint

- Prevents internal error forwards (e.g. missing request parameter)
  from being masked by a misleading 401 Unauthorized"

echo "== 15/16: SubscriptionService DTO refactor =="
git add "$REPO_BASE/subscription/service/SubscriptionService.java" \
        "$REPO_BASE/subscription/dto/SubscriptionStatusDto.java" \
        "$REPO_BASE/subscription/dto/SubscriptionUserDto.java"
git commit -m "refactor(subscription): return SubscriptionStatusDto instead of void

- subscribe/unsubscribe now return { subscribed, subscriberCount }
- Lets frontend update follow button and count from one response,
  no extra fetch needed"

echo "== 16/16: SubscriptionController ResponseEntity refactor =="
git add "$REPO_BASE/subscription/controller/SubscriptionController.java"
git commit -m "refactor(subscription): wrap controller responses in ResponseEntity

- 201 Created on subscribe
- 200 OK on unsubscribe and list endpoints"

echo ""
echo "All commits created. Review with: git log --oneline -20"
echo "Push when ready with: git push origin <your-branch-name>"
