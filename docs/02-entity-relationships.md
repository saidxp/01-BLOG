# Entity Relationships Specification

## Overview

This document describes how entities are related within the Social Block Platform.

Understanding these relationships is essential for database design, API development, authorization rules, and future scalability.

---

# Core Entities

The platform consists of the following primary entities:

* User
* Subscription
* Post
* Media
* Like
* Comment
* Notification
* Report
* Admin Action

---

# User Relationships

## User → Posts

### Relationship

One User can create many Posts.

### Cardinality

```text
User (1) ------ (*) Post
```

### Business Meaning

Each post belongs to exactly one author.

---

## User → Comments

### Relationship

One User can create many Comments.

### Cardinality

```text
User (1) ------ (*) Comment
```

### Business Meaning

Users can comment on multiple posts.

Each comment belongs to one user.

---

## User → Likes

### Relationship

One User can like many Posts.

### Cardinality

```text
User (1) ------ (*) Like
```

### Business Meaning

Users may interact with multiple posts.

A like record tracks which user liked which post.

---

## User → Notifications

### Relationship

One User can receive many Notifications.

### Cardinality

```text
User (1) ------ (*) Notification
```

### Business Meaning

Notifications inform users about activity relevant to their subscriptions and account.

---

## User → Reports

### Relationship

One User can submit many Reports.

### Cardinality

```text
User (1) ------ (*) Report
```

### Business Meaning

Users can report inappropriate accounts or content.

---

# Subscription Relationships

## User → User (Subscription)

### Relationship

Users can subscribe to other users.

### Cardinality

```text
User (*) ------ (*) User
```

Implemented through:

```text
subscriptions
```

### Example

```text
User A subscribes to User B

User C subscribes to User B

User D subscribes to User B
```

### Business Rules

* Users cannot subscribe to themselves.
* Duplicate subscriptions are not allowed.

---

# Post Relationships

## Post → Media

### Relationship

One Post can contain multiple Media files.

### Cardinality

```text
Post (1) ------ (*) Media
```

### Business Meaning

A post may contain:

* One image
* Multiple images
* One video
* Multiple videos

The system should support future expansion without changing the database design.

---

## Post → Comments

### Relationship

One Post can have many Comments.

### Cardinality

```text
Post (1) ------ (*) Comment
```

### Business Meaning

Users interact with content through discussion.

---

## Post → Likes

### Relationship

One Post can receive many Likes.

### Cardinality

```text
Post (1) ------ (*) Like
```

### Business Meaning

Likes provide engagement metrics.

---

# Report Relationships

## Report → Reporter

### Relationship

Each Report is created by one User.

### Cardinality

```text
User (1) ------ (*) Report
```

---

## Report → Reported User

### Relationship

Each Report targets one User.

### Cardinality

```text
User (1) ------ (*) Report
```

### Business Meaning

Multiple users may report the same account.

---

# Admin Relationships

## Admin → Actions

### Relationship

One Administrator can perform many moderation actions.

### Cardinality

```text
User (ADMIN) (1) ------ (*) AdminAction
```

### Example Actions

* Ban User
* Unban User
* Delete Post
* Hide Post
* Resolve Report
* Reject Report

---

# Complete Relationship Diagram

```text
User
 │
 ├── Posts
 │     ├── Media
 │     ├── Likes
 │     └── Comments
 │
 ├── Notifications
 │
 ├── Reports
 │
 └── Subscriptions
       │
       ▼
      User

Admin (User with ADMIN role)
 │
 └── AdminActions
```

---

# Design Decisions

## Why Use a Subscription Table?

Subscriptions create a many-to-many relationship between users.

Using a dedicated table:

* Prevents data duplication
* Simplifies queries
* Improves scalability

---

## Why Separate Media from Posts?

Separating media allows:

* Multiple files per post
* Easier media management
* Future cloud storage integration
* Independent media processing

---

## Why Store Likes Separately?

A dedicated Like table:

* Prevents duplicate likes
* Supports analytics
* Allows future reactions (Love, Laugh, Angry, etc.)

---

## Why Store Notifications?

Pre-generated notifications:

* Reduce expensive queries
* Improve user experience
* Scale better than calculating notifications on every request

---

# Summary

The platform is centered around the User entity.

All major functionality—posts, subscriptions, notifications, reports, and administration—originates from user interactions, making the User table the core of the system's domain model.
