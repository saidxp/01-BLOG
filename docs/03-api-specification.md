# API Specification

## Overview

This document defines all REST API endpoints available in the Social Block Platform.

The API is organized by feature domain and follows RESTful design principles.

---

# Authentication

## Register User

### Endpoint

```http
POST /api/auth/register
```

### Description

Creates a new user account.

### Access

Public

---

## Login User

### Endpoint

```http
POST /api/auth/login
```

### Description

Authenticates a user and returns a JWT access token.

### Access

Public

---

## Get Current User

### Endpoint

```http
GET /api/auth/me
```

### Description

Returns information about the currently authenticated user.

### Access

Authenticated User

---

# User Profiles

## Get Current User Profile

### Endpoint

```http
GET /api/users/me
```

### Description

Returns the authenticated user's profile.

### Access

Authenticated User

---

## Update Current User Profile

### Endpoint

```http
PUT /api/users/me
```

### Description

Updates profile information.

### Access

Authenticated User

---

## Get Public User Profile

### Endpoint

```http
GET /api/users/{username}
```

### Description

Returns a public profile ("Block Page").

### Access

Public

---

## Get User Posts

### Endpoint

```http
GET /api/users/{id}/posts
```

### Description

Returns all posts created by a user.

### Access

Public

---

# Subscriptions

## Subscribe to User

### Endpoint

```http
POST /api/users/{id}/subscribe
```

### Description

Subscribes the authenticated user to another user.

### Access

Authenticated User

---

## Unsubscribe from User

### Endpoint

```http
DELETE /api/users/{id}/subscribe
```

### Description

Removes an existing subscription.

### Access

Authenticated User

---

## Get Followers

### Endpoint

```http
GET /api/users/{id}/followers
```

### Description

Returns users following a specific profile.

### Access

Public

---

## Get Following

### Endpoint

```http
GET /api/users/{id}/following
```

### Description

Returns users followed by a specific profile.

### Access

Public

---

# Feed

## Get Personalized Feed

### Endpoint

```http
GET /api/posts/feed
```

### Description

Returns posts from subscribed users.

### Access

Authenticated User

---

# Posts

## Create Post

### Endpoint

```http
POST /api/posts
```

### Description

Creates a new post.

### Access

Authenticated User

---

## Get Single Post

### Endpoint

```http
GET /api/posts/{id}
```

### Description

Returns a specific post.

### Access

Public

---

## Update Post

### Endpoint

```http
PUT /api/posts/{id}
```

### Description

Updates an existing post.

### Access

Post Owner

---

## Delete Post

### Endpoint

```http
DELETE /api/posts/{id}
```

### Description

Deletes a post.

### Access

Post Owner or Admin

---

# Media

## Upload Media

### Endpoint

```http
POST /api/media
```

### Description

Uploads an image or video.

### Access

Authenticated User

---

## Delete Media

### Endpoint

```http
DELETE /api/media/{id}
```

### Description

Deletes uploaded media.

### Access

Media Owner or Admin

---

# Likes

## Like Post

### Endpoint

```http
POST /api/posts/{id}/like
```

### Description

Adds a like to a post.

### Access

Authenticated User

---

## Unlike Post

### Endpoint

```http
DELETE /api/posts/{id}/like
```

### Description

Removes a like from a post.

### Access

Authenticated User

---

# Comments

## Create Comment

### Endpoint

```http
POST /api/posts/{id}/comments
```

### Description

Creates a new comment.

### Access

Authenticated User

---

## Get Comments

### Endpoint

```http
GET /api/posts/{id}/comments
```

### Description

Returns all comments for a post.

### Access

Public

---

## Delete Comment

### Endpoint

```http
DELETE /api/comments/{id}
```

### Description

Deletes a comment.

### Access

Comment Owner or Admin

---

# Notifications

## Get Notifications

### Endpoint

```http
GET /api/notifications
```

### Description

Returns all notifications for the authenticated user.

### Access

Authenticated User

---

## Mark Notification as Read

### Endpoint

```http
PATCH /api/notifications/{id}/read
```

### Description

Marks a notification as read.

### Access

Authenticated User

---

## Mark All Notifications as Read

### Endpoint

```http
PATCH /api/notifications/read-all
```

### Description

Marks all notifications as read.

### Access

Authenticated User

---

# Reports

## Submit Report

### Endpoint

```http
POST /api/reports
```

### Description

Reports a user for inappropriate content.

### Access

Authenticated User

---

## Get My Reports

### Endpoint

```http
GET /api/reports/me
```

### Description

Returns reports submitted by the authenticated user.

### Access

Authenticated User

---

# Administration

## Overview

All administrative endpoints require:

```text
ROLE_ADMIN
```

---

# User Management

## Get All Users

### Endpoint

```http
GET /api/admin/users
```

---

## Get User Details

### Endpoint

```http
GET /api/admin/users/{id}
```

---

## Ban User

### Endpoint

```http
PATCH /api/admin/users/{id}/ban
```

---

## Unban User

### Endpoint

```http
PATCH /api/admin/users/{id}/unban
```

---

## Delete User

### Endpoint

```http
DELETE /api/admin/users/{id}
```

---

# Post Moderation

## Get All Posts

### Endpoint

```http
GET /api/admin/posts
```

---

## Hide Post

### Endpoint

```http
PATCH /api/admin/posts/{id}/hide
```

---

## Delete Post

### Endpoint

```http
DELETE /api/admin/posts/{id}
```

---

# Report Management

## Get All Reports

### Endpoint

```http
GET /api/admin/reports
```

---

## Get Report Details

### Endpoint

```http
GET /api/admin/reports/{id}
```

---

## Resolve Report

### Endpoint

```http
PATCH /api/admin/reports/{id}/resolve
```

---

## Reject Report

### Endpoint

```http
PATCH /api/admin/reports/{id}/reject
```

---

# Common API Standards

## Authentication Header

```http
Authorization: Bearer <jwt-token>
```

---

## Pagination

All collection endpoints should support:

```http
?page=0
&size=20
&sort=createdAt,desc
```

---

## Standard Success Response

```json
{
  "success": true,
  "data": {}
}
```

---

## Standard Error Response

```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2026-06-25T10:00:00Z"
}
```
