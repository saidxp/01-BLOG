# Endpoint to DTO Mapping

This file summarizes how each API endpoint maps to the DTOs it depends on in a class-style structure.

## Authentication

### POST /api/auth/register
```java
class RegisterRequest {
    public String username;
    public String email;
    public String password;
}

class RegisterResponse {
    public String id;
    public String username;
    public String email;
    public String createdAt;
}
```

### POST /api/auth/login
```java
class LoginRequest {
    public String email;
    public String password;
}

class LoginResponse {
    public String accessToken;
    public String tokenType;
    public String userId;
    public String role;
}
```

### GET /api/auth/me
```java
class UserResponse {
    public String id;
    public String username;
    public String bio;
    public String profileImageUrl;
    public int followersCount;
    public int followingCount;
    public String createdAt;
}
```

## User and Subscription Endpoints

### GET /api/users/me
```java
class UserResponse {
    public String id;
    public String username;
    public String bio;
    public String profileImageUrl;
    public int followersCount;
    public int followingCount;
    public String createdAt;
}
```

### PUT /api/users/me
```java
class UserResponse {
    public String id;
    public String username;
    public String bio;
    public String profileImageUrl;
    public int followersCount;
    public int followingCount;
    public String createdAt;
}
```

### GET /api/users/{username}
```java
class UserResponse {
    public String id;
    public String username;
    public String bio;
    public String profileImageUrl;
    public int followersCount;
    public int followingCount;
    public String createdAt;
}
```

### GET /api/users/{id}/posts
```java
class PostResponse {
    public String id;
    public Object author;
    public String description;
    public Object[] media;
    public int likesCount;
    public int commentsCount;
    public String createdAt;
}
```

### POST /api/users/{id}/subscribe
```java
class NoneDefinedYet {}
```

### DELETE /api/users/{id}/subscribe
```java
class NoneDefinedYet {}
```

### GET /api/users/{id}/followers
```java
class UserResponse {
    public String id;
    public String username;
    public String bio;
    public String profileImageUrl;
    public int followersCount;
    public int followingCount;
    public String createdAt;
}
```

### GET /api/users/{id}/following
```java
class UserResponse {
    public String id;
    public String username;
    public String bio;
    public String profileImageUrl;
    public int followersCount;
    public int followingCount;
    public String createdAt;
}
```

## Feed and Post Endpoints

### GET /api/posts/feed
```java
class PostResponse {
    public String id;
    public Object author;
    public String description;
    public Object[] media;
    public int likesCount;
    public int commentsCount;
    public String createdAt;
}
```

### POST /api/posts
```java
class CreatePostRequest {
    public String description;
}

class PostResponse {
    public String id;
    public Object author;
    public String description;
    public Object[] media;
    public int likesCount;
    public int commentsCount;
    public String createdAt;
}
```

### GET /api/posts/{id}
```java
class PostResponse {
    public String id;
    public Object author;
    public String description;
    public Object[] media;
    public int likesCount;
    public int commentsCount;
    public String createdAt;
}
```

### PUT /api/posts/{id}
```java
class CreatePostRequest {
    public String description;
}

class PostResponse {
    public String id;
    public Object author;
    public String description;
    public Object[] media;
    public int likesCount;
    public int commentsCount;
    public String createdAt;
}
```

### DELETE /api/posts/{id}
```java
class NoneDefinedYet {}
```

## Media, Likes, and Comments

### POST /api/media
```java
class NoneDefinedYet {}
```

### DELETE /api/media/{id}
```java
class NoneDefinedYet {}
```

### POST /api/posts/{id}/like
```java
class NoneDefinedYet {}
```

### DELETE /api/posts/{id}/like
```java
class NoneDefinedYet {}
```

### POST /api/posts/{id}/comments
```java
class CreateCommentRequest {
    public String content;
}

class CommentResponse {
    public String id;
    public Object author;
    public String content;
    public String createdAt;
}
```

### GET /api/posts/{id}/comments
```java
class CommentResponse {
    public String id;
    public Object author;
    public String content;
    public String createdAt;
}
```

### DELETE /api/comments/{id}
```java
class NoneDefinedYet {}
```

## Notifications and Reports

### GET /api/notifications
```java
class NotificationResponse {
    public String id;
    public String type;
    public String message;
    public boolean isRead;
    public String createdAt;
}
```

### PATCH /api/notifications/{id}/read
```java
class NotificationResponse {
    public String id;
    public String type;
    public String message;
    public boolean isRead;
    public String createdAt;
}
```

### PATCH /api/notifications/read-all
```java
class NotificationResponse {
    public String id;
    public String type;
    public String message;
    public boolean isRead;
    public String createdAt;
}
```

### POST /api/reports
```java
class CreateReportRequest {
    public String reportedUserId;
    public String reason;
}

class ReportResponse {
    public String id;
    public String status;
    public String createdAt;
}
```

### GET /api/reports/me
```java
class ReportResponse {
    public String id;
    public String status;
    public String createdAt;
}
```

## Admin Endpoints

### GET /api/admin/users
```java
class UserResponse {
    public String id;
    public String username;
    public String bio;
    public String profileImageUrl;
    public int followersCount;
    public int followingCount;
    public String createdAt;
}
```

### GET /api/admin/users/{id}
```java
class UserResponse {
    public String id;
    public String username;
    public String bio;
    public String profileImageUrl;
    public int followersCount;
    public int followingCount;
    public String createdAt;
}
```

### PATCH /api/admin/users/{id}/ban
```java
class UserResponse {
    public String id;
    public String username;
    public String bio;
    public String profileImageUrl;
    public int followersCount;
    public int followingCount;
    public String createdAt;
}
```

### PATCH /api/admin/users/{id}/unban
```java
class UserResponse {
    public String id;
    public String username;
    public String bio;
    public String profileImageUrl;
    public int followersCount;
    public int followingCount;
    public String createdAt;
}
```

### DELETE /api/admin/users/{id}
```java
class NoneDefinedYet {}
```

### GET /api/admin/posts
```java
class PostResponse {
    public String id;
    public Object author;
    public String description;
    public Object[] media;
    public int likesCount;
    public int commentsCount;
    public String createdAt;
}
```

### PATCH /api/admin/posts/{id}/hide
```java
class PostResponse {
    public String id;
    public Object author;
    public String description;
    public Object[] media;
    public int likesCount;
    public int commentsCount;
    public String createdAt;
}
```

### DELETE /api/admin/posts/{id}
```java
class NoneDefinedYet {}
```

### GET /api/admin/reports
```java
class ReportResponse {
    public String id;
    public String status;
    public String createdAt;
}
```

### GET /api/admin/reports/{id}
```java
class ReportResponse {
    public String id;
    public String status;
    public String createdAt;
}
```

### PATCH /api/admin/reports/{id}/resolve
```java
class ReportResponse {
    public String id;
    public String status;
    public String createdAt;
}
```

### PATCH /api/admin/reports/{id}/reject
```java
class ReportResponse {
    public String id;
    public String status;
    public String createdAt;
}
```
