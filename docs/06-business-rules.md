# Business Rules & Constraints

## Overview

This document defines the business rules governing platform behavior.

---

# User Rules

## Registration

* Username must be unique.
* Email must be unique.

---

## Banned Users

Banned users cannot:

* Log in
* Create posts
* Comment
* Like posts
* Subscribe to users

---

# Subscription Rules

* Users cannot subscribe to themselves.
* Duplicate subscriptions are not allowed.

---

# Post Rules

## Ownership

Only the owner of a post may:

* Edit the post
* Delete the post

---

## Visibility

Posts may have the following statuses:

* ACTIVE
* HIDDEN
* DELETED

---

# Media Rules

Supported formats:

## Images

* JPG
* JPEG
* PNG
* GIF

## Videos

* MP4
* MOV

---

# Like Rules

* One user can like a post only once.
* Users may remove their like.

---

# Comment Rules

* Users may comment on any visible post.
* Users may delete their own comments.
* Admins may remove inappropriate comments.

---

# Notification Rules

A notification is generated when:

* A subscribed user publishes a post.
* An administrative action affects a user.
* A report is resolved.

---

# Report Rules

## Report Submission

A report must contain:

* Reported user
* Reason
* Timestamp

---

## Visibility

Reports are visible only to administrators.

---

# Moderation Rules

Administrators may:

* Ban users
* Unban users
* Delete users
* Hide posts
* Delete posts
* Resolve reports
* Reject reports

---

# Audit Requirements

All administrative actions must be recorded in the Admin Actions table.
