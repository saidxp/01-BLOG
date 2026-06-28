# API and DTO Structured Mapping

This file maps each API endpoint to the DTOs it uses in a structured format.

## 1. Authentication

### POST /api/auth/register
- Purpose: Register a new user
- Request DTO:
  - RegisterRequest
  - Fields:
    - username: string
    - email: string
    - password: string
- Response DTO:
  - RegisterResponse
  - Fields:
    - id: string
    - username: string
    - email: string
    - createdAt: string

### POST /api/auth/login
- Purpose: Authenticate a user
- Request DTO:
  - LoginRequest
  - Fields:
    - email: string
    - password: string
- Response DTO:
  - LoginResponse
  - Fields:
    - accessToken: string
    - tokenType: string
    - userId: string
    - role: string

### GET /api/auth/me
- Purpose: Get the authenticated user
- Response DTO:
  - UserResponse
  - Fields:
    - id: string
    - username: string
    - bio: string
    - profileImageUrl: string
    - followersCount: number
    - followingCount: number
    - createdAt: string

## 2. User Profiles

### GET /api/users/me
- Purpose: Get current user profile
- Response DTO:
  - UserResponse

### PUT /api/users/me
- Purpose: Update current user profile
- Response DTO:
  - UserResponse

### GET /api/users/{username}
- Purpose: Get public user profile
- Response DTO:
  - UserResponse

### GET /api/users/{id}/posts
- Purpose: Get posts of a user
- Response DTO:
  - PostResponse[]

## 3. Subscriptions

### POST /api/users/{id}/subscribe
- Purpose: Follow another user
- Response DTO:
  - No dedicated DTO defined yet

### DELETE /api/users/{id}/subscribe
- Purpose: Unfollow another user
- Response DTO:
  - No dedicated DTO defined yet

### GET /api/users/{id}/followers
- Purpose: List followers
- Response DTO:
  - UserResponse[]

### GET /api/users/{id}/following
- Purpose: List following users
- Response DTO:
  - UserResponse[]

## 4. Posts and Feed

### GET /api/posts/feed
- Purpose: Get personalized feed
- Response DTO:
  - PostResponse[]

### POST /api/posts
- Purpose: Create a new post
- Request DTO:
  - CreatePostRequest
  - Fields:
    - description: string
- Response DTO:
  - PostResponse
  - Fields:
    - id: string
    - author: object
    - description: string
    - media: array
    - likesCount: number
    - commentsCount: number
    - createdAt: string

### GET /api/posts/{id}
- Purpose: Get one post
- Response DTO:
  - PostResponse

### PUT /api/posts/{id}
- Purpose: Update a post
- Request DTO:
  - CreatePostRequest
- Response DTO:
  - PostResponse

### DELETE /api/posts/{id}
- Purpose: Delete a post
- Response DTO:
  - No dedicated DTO defined yet

## 5. Media

### POST /api/media
- Purpose: Upload media
- Response DTO:
  - No dedicated DTO defined yet

### DELETE /api/media/{id}
- Purpose: Delete media
- Response DTO:
  - No dedicated DTO defined yet

## 6. Likes

### POST /api/posts/{id}/like
- Purpose: Like a post
- Response DTO:
  - No dedicated DTO defined yet

### DELETE /api/posts/{id}/like
- Purpose: Unlike a post
- Response DTO:
  - No dedicated DTO defined yet

## 7. Comments

### POST /api/posts/{id}/comments
- Purpose: Add a comment
- Request DTO:
  - CreateCommentRequest
  - Fields:
    - content: string
- Response DTO:
  - CommentResponse
  - Fields:
    - id: string
    - author: object
    - content: string
    - createdAt: string

### GET /api/posts/{id}/comments
- Purpose: Get comments for a post
- Response DTO:
  - CommentResponse[]

### DELETE /api/comments/{id}
- Purpose: Delete a comment
- Response DTO:
  - No dedicated DTO defined yet

## 8. Notifications

### GET /api/notifications
- Purpose: Get notifications
- Response DTO:
  - NotificationResponse[]

### PATCH /api/notifications/{id}/read
- Purpose: Mark a notification as read
- Response DTO:
  - NotificationResponse

### PATCH /api/notifications/read-all
- Purpose: Mark all notifications as read
- Response DTO:
  - NotificationResponse[]

## 9. Reports

### POST /api/reports
- Purpose: Submit a report
- Request DTO:
  - CreateReportRequest
  - Fields:
    - reportedUserId: string
    - reason: string
- Response DTO:
  - ReportResponse
  - Fields:
    - id: string
    - status: string
    - createdAt: string

### GET /api/reports/me
- Purpose: Get my reports
- Response DTO:
  - ReportResponse[]

## 10. Admin

### GET /api/admin/users
- Response DTO:
  - UserResponse[]

### GET /api/admin/users/{id}
- Response DTO:
  - UserResponse

### PATCH /api/admin/users/{id}/ban
- Response DTO:
  - UserResponse

### PATCH /api/admin/users/{id}/unban
- Response DTO:
  - UserResponse

### GET /api/admin/posts
- Response DTO:
  - PostResponse[]

### PATCH /api/admin/posts/{id}/hide
- Response DTO:
  - PostResponse

### GET /api/admin/reports
- Response DTO:
  - ReportResponse[]

### GET /api/admin/reports/{id}
- Response DTO:
  - ReportResponse

### PATCH /api/admin/reports/{id}/resolve
- Response DTO:
  - ReportResponse

### PATCH /api/admin/reports/{id}/reject
- Response DTO:
  - ReportResponse
