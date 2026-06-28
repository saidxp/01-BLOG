# Project Architecture Specification

## Overview

The application follows Clean Architecture principles to ensure maintainability, scalability, and separation of concerns.

---

# Architectural Layers

## Presentation Layer

Responsibilities:

- Receive HTTP requests
- Validate incoming data
- Return HTTP responses

Components:

- Controllers
- Request DTOs
- Response DTOs

---

## Application Layer

Responsibilities:

- Execute use cases
- Coordinate business workflows

Components:

- Services
- Use Cases

Examples:

- Create Post
- Subscribe User
- Submit Report
- Ban User

---

## Domain Layer

Responsibilities:

- Contain business rules
- Define domain entities
- Remain independent from frameworks

Entities:

- User
- Post
- Comment
- Notification
- Report
- Subscription

---

## Infrastructure Layer

Responsibilities:

- Database access
- Security implementation
- File storage
- External integrations

Components:

- Repositories
- JWT Services
- Storage Services
- Database Configuration

---

# Recommended Package Structure


├── auth
│   ├── controller
│   ├── service
│   ├── repository
│   ├── dto
│   └── mapper
│
├── user
│   ├── controller
│   ├── service
│   ├── repository
│   ├── dto
│   └── mapper
│
├── post
│   ├── controller
│   ├── service
│   ├── repository
│   ├── dto
│   └── mapper
│
├── comment
├── notification
├── report
├── subscription
├── admin
│
├── common
│   ├── exception
│   ├── security
│   ├── config
│   └── util

---

# Storage Architecture

## Database

Recommended:

- PostgreSQL

---

## Media Storage

Options:

### Local File System

Suitable for:

- Development
- Small deployments

### AWS S3

Suitable for:

- Production
- Scalable deployments

---

# Scalability Considerations

- Use pagination on all list endpoints.
- Store media outside the database.
- Index frequently queried columns.
- Generate notifications asynchronously.
- Maintain audit logs for moderation actions.

---

# Design Principles

- Single Responsibility Principle
- Dependency Inversion Principle
- Separation of Concerns
- Domain-Centric Design
- Framework Independence

---
 