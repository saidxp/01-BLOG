# Authentication & Authorization Specification

## Overview

The application uses JWT-based authentication and role-based authorization.

---

# Authentication Flow

## Registration

1. User submits registration request.
2. System validates data.
3. Password is encrypted using BCrypt.
4. User record is created.
5. User receives success response.

---

## Login

1. User submits credentials.
2. System validates credentials.
3. JWT token is generated.
4. Token is returned to the client.
5. Client stores token.

---

## Authenticated Requests

The client sends:

```http
Authorization: Bearer <token>
```

Spring Security validates the token before processing the request.

---

# Roles

## USER

Permissions:

* View profiles
* Subscribe to users
* Create posts
* Edit own posts
* Delete own posts
* Like posts
* Comment on posts
* Report users
* Read notifications

---

## ADMIN

Permissions:

* View all users
* Ban users
* Unban users
* Delete users
* View reports
* Resolve reports
* Reject reports
* Hide posts
* Delete posts

---

# Protected Resources

## Public

* Register
* Login
* Public profiles

## Authenticated

* Posts
* Likes
* Comments
* Notifications
* Reports
* Subscriptions

## Admin Only

* User moderation
* Post moderation
* Report management

---

# Security Standards

## Password Storage

Passwords must never be stored in plain text.

Use:

* BCrypt

---

## JWT Expiration

Recommended:

* Access Token: 15–60 minutes

---

## HTTPS

All production traffic must use HTTPS.
