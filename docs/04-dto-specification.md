# DTO Specification

## Overview

This document defines all request and response contracts used by the API.

## DTO Usage by Endpoint

The DTOs in this document are referenced by the endpoints defined in the API specification. The main relationships are:

- RegisterRequest and RegisterResponse -> POST /api/auth/register
- LoginRequest and LoginResponse -> POST /api/auth/login
- UserResponse -> GET /api/auth/me, GET /api/users/me, GET /api/users/{username}, GET /api/admin/users, and GET /api/admin/users/{id}
- CreatePostRequest and PostResponse -> POST /api/posts, PUT /api/posts/{id}, and GET /api/posts/{id}
- CreateCommentRequest and CommentResponse -> POST /api/posts/{id}/comments and GET /api/posts/{id}/comments
- CreateReportRequest and ReportResponse -> POST /api/reports and GET /api/reports/me
- NotificationResponse -> GET /api/notifications, PATCH /api/notifications/{id}/read, and PATCH /api/notifications/read-all

---

# Authentication DTOs

## Register Request

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "********"
}
```

## Register Response

```json
{
  "id": "uuid",
  "username": "john_doe",
  "email": "john@example.com",
  "createdAt": "timestamp"
}
```

---

## Login Request

```json
{
  "email": "john@example.com",
  "password": "********"
}
```

## Login Response

```json
{
  "accessToken": "jwt-token",
  "tokenType": "Bearer",
  "userId": "uuid",
  "role": "USER"
}
```

---

# User DTOs

## User Response

```json
{
  "id": "uuid",
  "username": "john_doe",
  "bio": "Software Developer",
  "profileImageUrl": "url",
  "followersCount": 10,
  "followingCount": 25,
  "createdAt": "timestamp"
}
```

---

# Post DTOs

## Create Post Request

```json
{
  "description": "My first post"
}
```

## Post Response

```json
{
  "id": "uuid",
  "author": {},
  "description": "My first post",
  "media": [],
  "likesCount": 10,
  "commentsCount": 5,
  "createdAt": "timestamp"
}
```

---

# Comment DTOs

## Create Comment Request

```json
{
  "content": "Nice post!"
}
```

## Comment Response

```json
{
  "id": "uuid",
  "author": {},
  "content": "Nice post!",
  "createdAt": "timestamp"
}
```

---

# Report DTOs

## Create Report Request

```json
{
  "reportedUserId": "uuid",
  "reason": "Inappropriate content"
}
```

## Report Response

```json
{
  "id": "uuid",
  "status": "PENDING",
  "createdAt": "timestamp"
}
```

---

# Notification DTOs

## Notification Response

```json
{
  "id": "uuid",
  "type": "NEW_POST",
  "message": "New post published",
  "isRead": false,
  "createdAt": "timestamp"
}
```
