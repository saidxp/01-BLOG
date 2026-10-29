# 01-BLOG


> Engineered with **Clean Architecture**, **Angular Universal (SSR)**, **Spring Boot 4**, **Spring Security (JWT access token in HttpOnly Cookies)**, **PostgreSQL**, **STOMP/WebSocket Real-Time Notifications**, and a **Dockerized Nginx Gateway**.

---

## 📑 Quick Navigation & Detailed Documentation

This repository contains exhaustive, software-engineer-grade specifications for every layer of the platform:

| Document | Scope & Highlights | Link |
|---|---|---|
| 🖥️ **Frontend Architecture** | Angular 22+, Clean Architecture (Domain / Application / Infrastructure / Presentation), Signals Reactive State, SharedWorker STOMP WebSocket, SSR Cookie Forwarding, Auth Guards | [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) |
| ⚙️ **Backend & API Reference** | Spring Boot 4 MVC, Spring Security filter chains, Stateless JWT in HttpOnly Cookies, Dual-layer CORS, JPA/Hibernate schemas, Full REST API Catalog & STOMP Broker | [BACKEND_API_DOCUMENTATION.md](./BACKEND_API_DOCUMENTATION.md) |
| 📖 **Interactive API Docs (Swagger UI)** | Live interactive REST API testing interface, schema inspector & OpenAPI 3.0 specification | [http://localhost:1998/api/swagger-ui.html](http://localhost:1998/api/swagger-ui.html) |
| 🗄️ **Database & JPA Schema** | PostgreSQL 15 relational ERD, 8 JPA Entities (`User`, `Post`, `Comment`, `Like`, `Subscription`, `Notification`, `MediaUpload`, `Report`), constraints & fetch strategies | [Section Below](#🗄️-database-architecture--entity-relationships-jpa-schema) |
| 📦 **Infrastructure & Compose** | Multi-container Docker setup, Nginx reverse proxy routing, persistent PostgreSQL volume | [docker-compose.yml](./docker-compose.yml) |

---

## 🏛️ End-to-End System Architecture

The following system architecture diagram illustrates how client requests and real-time streams interface with the **Nginx** ingress router, fanning out across the **Angular SSR Server** (port 4000), the **Spring Boot REST/WebSocket Backend** (port 8080), and the **PostgreSQL** relational database (port 5432):

```mermaid 

flowchart LR
    subgraph CLIENT["CLIENT / BROWSER"]
        direction TB
        ANG["Angular Application"]
        HYD["Angular Hydration"]
        SIG["Angular Signals State Management"]
        SW["SharedWorker Cross-tab Coordination"]
        STOMP["STOMP over WebSocket"]

        ANG --> HYD --> SIG --> SW --> STOMP
    end

    subgraph NGINX["NGINX — Reverse Proxy & Ingress Router"]
        direction TB
        NAPI["location /api/"]
        NROOT["location /"]
        NMEDIA["location /media/"]
    end

    subgraph SERVER["DOCKER / APPLICATION SERVER"]
        direction TB

        subgraph SSR["ANGULAR SSR SERVER"]
            direction LR
            NODE["Node.js / Express<br/>Port 4000"]
            RENDER["Server-side Rendering of HTML"]
            COOKIE["SSR Cookie-forwarding Interceptor"]
            HYDRATE["Client Hydration Support"]
            HTML["Initial HTML Delivery"]

            NODE --> RENDER --> COOKIE --> HYDRATE --> HTML
        end

        subgraph BACKEND["SPRING BOOT BACKEND"]
            direction TB

            subgraph WS["STOMP SIMPLE BROKER"]
                direction LR
                WSE["WebSocket Endpoint<br/>/ws"]
                TOPIC["/topic/*"]
                USER["/user/*"]

                WSE --> TOPIC
                WSE --> USER
            end

            subgraph REST["REQUEST PROCESSING PIPELINE"]
                direction LR
                SEC["Spring Security Filter Chain"]
                JWT["JWT Authentication Filter"]
                CTRL["REST Controllers<br/>/api/auth<br/>/api/posts<br/>/api/users<br/>/api/*"]
                SERVICE["Application / Service Layer"]
                JPA["Spring Data JPA"]
                ORM["Hibernate ORM"]

                SEC --> JWT --> CTRL --> SERVICE --> JPA --> ORM
            end

            TOMCAT["Tomcat — Port 8080"]
        end
    end

    subgraph DATABASE["POSTGRESQL DATABASE"]
        direction TB
        PG[("PostgreSQL 15<br/>Port 5432")]
        TABLES["Users, Posts, Categories,<br/>Tags, Comments, Likes,<br/>Followers, Notifications"]

        PG --- TABLES
    end

    ANG -->|"HTTP :80"| NROOT
    NROOT -->|"Proxy"| NODE

    SW -.->|"Real-time data flow"| WSE
    STOMP -.->|"WebSocket Upgrade"| NGINX
    NGINX -.->|"/ws — WebSocket proxy"| WSE

    NAPI --> SEC
    NMEDIA --> SEC

    SSR -.->|"SSR API requests / cookies"| SEC
    ORM -->|"JDBC / TCP :5432"| PG

    classDef client fill:#e8f0fe,stroke:#4285f4,color:#174ea6
    classDef gateway fill:#e8f5e9,stroke:#43a047,color:#1b5e20
    classDef frontend fill:#fce4ec,stroke:#d81b60,color:#880e4f
    classDef backend fill:#ede7f6,stroke:#673ab7,color:#311b92
    classDef database fill:#fff3e0,stroke:#fb8c00,color:#7f3b00

    class ANG,HYD,SIG,SW,STOMP client
    class NAPI,NROOT,NMEDIA gateway
    class NODE,RENDER,COOKIE,HYDRATE,HTML frontend
    class WSE,TOPIC,USER,SEC,JWT,CTRL,SERVICE,JPA,ORM,TOMCAT backend
    class PG,TABLES database
```

### Architectural Overview & Port Mapping
The following diagram illustrates how incoming traffic traverses from client devices through **Nginx**, fanning out to the **Angular SSR Server**, **Spring Boot REST/WebSocket API**, and persistent storage:

```mermaid
flowchart TB
    B["CLIENT / BROWSER<br/>Angular App: Hydrated + Signals<br/>SharedWorker: STOMP WebSocket"]

    N["NGINX GATEWAY<br/>Reverse Proxy & Ingress Router"]

    F["ANGULAR SSR SERVER<br/>Node.js / Express Engine<br/><br/>• Pre-renders HTML for SEO<br/>• SSR Cookie Forwarding Interceptor<br/>• Client Hydration<br/>• Fast First Contentful Paint"]

    API["SPRING BOOT BACKEND<br/>Tomcat :8080 + Spring Security<br/><br/>• SecurityFilterChain + JwtAuthFilter<br/>• REST Controllers: /api/auth, /api/posts, etc.<br/>• SimpleBroker STOMP: /ws, /topic, /user<br/>• Spring Data JPA + Hibernate 6"]

    DB[("POSTGRESQL DATABASE<br/>postgres:15<br/><br/>• users, posts, comments<br/>• likes, subscriptions<br/>• notifications, media_uploads<br/>• reports")]

    B -->|"HTTP :80 / WebSocket"| N

    N -->|"/ — proxy to :4000"| F
    N -->|"/api/ — proxy to :8080"| API
    N -->|"/media/ — proxy to :8080"| API

    F -.->|"SSR API requests / cookie forwarding"| API
    B <-->|"STOMP over WebSocket /ws"| N
    N <-->|"WebSocket proxy"| API

    API -->|"JDBC :5432"| DB

    classDef client fill:#dbeafe,stroke:#2563eb,color:#1e3a8a
    classDef gateway fill:#fef3c7,stroke:#d97706,color:#78350f
    classDef app fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef database fill:#f3e8ff,stroke:#9333ea,color:#581c87

    class B client
    class N gateway
    class F,API app
    class DB database

```

### 🗄️ PostgreSQL Database Schema & Entity Relationships
The following diagram illustrates the complete relational database schema and table relationships (`users`, `posts`, `comments`, `likes`, `subscriptions`, `notifications`, `media_uploads`, `reports`, and `flyway_schema_history`):

```mermaid

erDiagram
    USERS {
        BIGINT id PK
        VARCHAR username
        VARCHAR email
        VARCHAR password_hash
        VARCHAR role
        VARCHAR status
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TEXT bio
        VARCHAR avatar_url
    }

    POSTS {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR media_url
        VARCHAR media_type
        TIMESTAMP created_at
        TIMESTAMP updated_at
        VARCHAR title
        TEXT content
    }

    COMMENTS {
        BIGINT id PK
        BIGINT user_id FK
        BIGINT post_id FK
        TEXT content
        TIMESTAMP created_at
    }

    LIKES {
        BIGINT id PK
        BIGINT user_id FK
        BIGINT post_id FK
        TIMESTAMP created_at
    }

    SUBSCRIPTIONS {
        BIGINT id PK
        BIGINT subscriber_id FK
        BIGINT subscribed_to_id FK
        TIMESTAMP created_at
    }

    REPORTS {
        BIGINT id PK
        BIGINT reporter_id FK
        BIGINT reported_user_id FK
        BIGINT post_id FK
        TEXT reason
        TIMESTAMP created_at
    }

    NOTIFICATIONS {
        BIGINT id PK
        BIGINT recipient_id FK
        BIGINT post_id FK
        TEXT message
        BOOLEAN is_read
        TIMESTAMP created_at
    }

    MEDIA_UPLOADS {
        BIGINT id PK
        VARCHAR url
        BIGINT uploaded_by FK
        BOOLEAN is_confirmed
        TIMESTAMP created_at
        VARCHAR media_type
        BIGINT post_id FK
    }

    FLYWAY_SCHEMA_HISTORY {
        INT installed_rank PK
        VARCHAR version
        VARCHAR description
        VARCHAR type
        TEXT script
        INT checksum
        VARCHAR installed_by
        TIMESTAMP installed_on
        INT execution_time
        BOOLEAN success
    }

    USERS ||--o{ POSTS : creates
    USERS ||--o{ COMMENTS : writes
    POSTS ||--o{ COMMENTS : contains
    USERS ||--o{ LIKES : gives
    POSTS ||--o{ LIKES : receives
    USERS ||--o{ SUBSCRIPTIONS : subscriber
    USERS ||--o{ SUBSCRIPTIONS : subscribed_to
    USERS ||--o{ REPORTS : reporter
    USERS ||--o{ REPORTS : reported_user
    POSTS o|--o{ REPORTS : reported_post
    USERS ||--o{ NOTIFICATIONS : recipient
    POSTS o|--o{ NOTIFICATIONS : related_post
    USERS ||--o{ MEDIA_UPLOADS : uploader
    POSTS o|--o{ MEDIA_UPLOADS : attached_media
```
---

## 🔄 Sequence Diagram: Request & Real-time Flow

The following data flow diagram traces the lifecycle of user actions across the platform—highlighting initial Server-Side Rendering (SSR) page delivery, browser hydration, cross-tab SharedWorker STOMP WebSocket synchronization, and authenticated REST interactions:

```mermaid

sequenceDiagram
    actor User as User Browser
    participant App as Nginx Gateway
    participant SSR as Angular SSR (:4000)
    participant Spring as Spring Boot (:8080)
    participant DB as PostgreSQL (:5432)
    participant WS as SharedWorker (WS)

    Note over User,SSR: 1. Initial Page Load (SSR)

    User->>App: GET /posts/storyby/post
    App->>SSR: Proxy pass (Port 4000)
    SSR->>Spring: Server-side fetch (with forwarded cookies)
    Spring->>DB: Query post and author data
    DB-->>Spring: Return data
    Spring-->>SSR: 200 OK (Post JSON)
    SSR-->>App: Pre-rendered HTML and dehydrated state
    App-->>User: 200 OK (Fast First Paint and SEO-ready HTML)

    Note over User,WS: 2. Hydration and Real-time Sync

    User->>User: Client hydration and Signals boot
    User->>WS: Connect to SharedWorker
    WS->>App: WS Upgrade /api/ws (STOMP)
    App->>Spring: Proxy WS connection
    Spring-->>WS: CONNECTED (Session established)

    Note over User,Spring: 3. Interacting (Like / Comment)

    User->>App: POST /api/posts/42/likes (Cookie + accessToken)
    App->>Spring: Proxy /api/posts/42/likes
    Spring->>Spring: Validate authentication and cookie
    Spring->>DB: Insert like record and save notifications
    Spring->>WS: STOMP post to /user/author/post/notifications
    WS-->>User: Broadcast to all open tabs via MessagePort

    Note over User,WS: All tabs receive notifications in real time

```

---

## 🧩 Architectural Pillars

### 1. Frontend: Clean Architecture + Signals (Angular 22)
* **Domain Layer**: Pure entities (`User`, `Post`, `Comment`) and repository interfaces (`AuthRepository`). Zero external dependencies.
* **Application Layer**: Business use cases (`LoginUseCase`, `GetFeedUseCase`) and signal-based state stores (`AuthStateService`, `NotificationStateService`).
* **Infrastructure Layer**: Concrete implementations (`AuthRepositoryImpl`), HTTP interceptors forwarding JWT cookies during SSR and CSR, and WebSocket client services.
* **Presentation Layer**: Standalone components, reactive forms, signal computed selectors, Bootstrap 5.3 + CSS design-token styling.
* **SharedWorker Real-Time Optimization**: A single background Web Worker manages the STOMP/SockJS connection across all browser tabs, eliminating duplicated socket connections and syncing unread counts across all active tabs instantly.

### 2. Backend: Secure Spring Boot 4 Engine
* **Stateless Authentication with HttpOnly Cookies**: A signed JWT access token is stored exclusively in an `HttpOnly`, `SameSite=Lax` cookie (cookie name: `jwt`, 1-hour expiry) to protect against XSS and token-theft attacks. The `Secure` flag is enabled automatically under the `prod` Spring profile (or via `COOKIE_SECURE=true`).
* **Spring Security Filter Chain**: Custom `JwtAuthenticationFilter` intercepts requests, extracts cookies, resolves claims, and sets the authenticated `SecurityContextHolder`.
* **Layered Onion Architecture**: Controller (`@RestController`) $\to$ Service (`@Service`, `@Transactional`) $\to$ Repository (`JpaRepository`) $\to$ Database Entities.
* **STOMP In-Memory Message Broker**: Dispatches user-targeted events (`SimpMessagingTemplate.convertAndSendToUser`) for likes, comments, and mentions.
* **Media Storage**: Configurable static media uploads served through protected path handlers.

### 3. Gateway & Reverse Proxy (Nginx)
* Single point of ingress on port **80**.
* Routes root traffic (`/`) to the Angular Universal Node.js engine at `http://frontend:4000`.
* Routes backend endpoints (`/api/`) and media uploads (`/media/`) to `http://backend:8080`.
* Preserves original request metadata with `Host`, `X-Real-IP`, and `X-Forwarded-For` headers.

---

## 🗄️ Database Architecture & Entity Relationships (JPA Schema)

The persistent storage layer is built upon PostgreSQL 15, managed directly through **Jakarta Persistence (JPA)**, **Hibernate 6**, and versioned via **Flyway** migrations.

### Physical PostgreSQL Database Schema
The following diagram illustrates the physical tables, column data types, foreign keys, and indexes present in the PostgreSQL `blogdb` database:

---

### 2. JPA Entities & Relational Cardinality

| Entity / Table | Primary Key | Foreign Keys & Relationships | Key Constraints & Indexes |
|---|---|---|---|
| **`users`** (`User.java`) | `id` (BIGINT) | Parent to posts, comments, likes, subscriptions, notifications, media, reports | `UNIQUE(username)`, `UNIQUE(email)`, Enums: `Role` (USER, ADMIN), `UserStatus` (ACTIVE, BANNED) |
| **`posts`** (`Post.java`) | `id` (BIGINT) | `user_id` $\to$ `users.id` (Many-to-One, Lazy) | Non-null `title` & `content`, optional `media_url` and `media_type` |
| **`comments`** (`Comment.java`) | `id` (BIGINT) | `user_id` $\to$ `users.id`<br>`post_id` $\to$ `posts.id` | Many-to-One (Lazy) on both user and post. Full textual content |
| **`likes`** (`Like.java`) | `id` (BIGINT) | `user_id` $\to$ `users.id`<br>`post_id` $\to$ `posts.id` | `@UniqueConstraint(columnNames = {"user_id", "post_id"})` ensures idempotent one-like-per-user-per-post |
| **`subscriptions`** (`Subscription.java`) | `id` (BIGINT) | `subscriber_id` $\to$ `users.id`<br>`subscribed_to_id` $\to$ `users.id` | `@UniqueConstraint(columnNames = {"subscriber_id", "subscribed_to_id"})` enforces single follow edge between users |
| **`notifications`** (`Notification.java`) | `id` (BIGINT) | `recipient_id` $\to$ `users.id`<br>`post_id` $\to$ `posts.id` | Event payload with `is_read` flag. Dispatched over STOMP `/user/{id}/queue/notifications` |
| **`media_uploads`** (`MediaUpload.java`) | `id` (BIGINT) | `uploaded_by` $\to$ `users.id`<br>`post_id` $\to$ `posts.id` (Nullable) | Tracks pre-upload lifecycle (`is_confirmed`), linked to post upon publication |
| **`reports`** (`Report.java`) | `id` (BIGINT) | `reporter_id` $\to$ `users.id`<br>`reported_user_id` $\to$ `users.id`<br>`post_id` $\to$ `posts.id` (Nullable) | Moderation audit log detailing violation reports on users and specific posts |

### 3. JPA Data Access & Performance Optimizations
* **Lazy Loading by Default (`FetchType.LAZY`)**: Every `@ManyToOne` relationship uses `FetchType.LAZY` to avoid accidental `EAGER` joins and prevent $N+1$ query cascades across the persistence layer.
* **Composite Unique Constraints**: Database-level uniqueness (`likes(user_id, post_id)` and `subscriptions(subscriber_id, subscribed_to_id)`) prevents race-condition duplications.
* **Audit Lifecycle Hooks**: Entity creation and mutation timestamps are automated through `@PrePersist` and `@PreUpdate` lifecycle callbacks.

---

## 🛠️ Tech Stack & Ecosystem

```
Frontend:
  ├── Angular 22 (Standalone Components)
  ├── Angular Universal (SSR with Express engine)
  ├── Angular Signals (Fine-grained state reactivity)
  ├── RxJS (Complex stream piping)
  ├── STOMP.js & SockJS (WebSocket protocol)
  └── Web SharedWorkers (Cross-tab connection pooling)

Backend:
  ├── Java 17+ / Spring Boot 4.x
  ├── Spring Security (Stateless JWT Filter)
  ├── Spring Data JPA / Hibernate 6
  ├── Spring WebSocket & STOMP Messaging
  ├── PostgreSQL 15 (Relational persistence)
  └── Maven Build System

DevOps & Infrastructure:
  ├── Docker & Docker Compose
  ├── Nginx Alpine (Reverse Proxy & Ingress)
  └── Multi-stage container builds
```

---

## 🚀 Running the Platform Locally

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/)
- Node.js 20+ (for standalone frontend development)
- JDK 17+ & Maven (for standalone backend development)

### Environment Variables (`.env` at project root)

| Variable | Required | Purpose |
|---|---|---|
| `JWT_SECRET` | ✅ | HMAC signing key for access tokens (≥ 256-bit recommended) |
| `JWT_EXPIRATION` | ✅ | Access-token lifetime in ms (e.g. `3600000`) |
| `APP_HOST` | ✅ | Public host (LAN IP or domain) users browse to — single source of truth for CORS, WebSocket origins and SSR. On a new machine change only this and regenerate the certificate |
| `APP_PORT` | ❌ | Public HTTPS port exposed by Nginx (default `8443`) |
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | ❌ | Database credentials (defaults keep local dev working; override in production) |
| `COOKIE_SECURE` | ❌ | Set to `true` when serving over HTTPS so the auth cookie carries the `Secure` flag |
| `BOOTSTRAP_ADMIN_USERNAMES` | ❌ | Comma-separated usernames auto-promoted to `ROLE_ADMIN` at backend startup |
| `SPRING_PROFILES_ACTIVE` | ❌ | Set to `prod` to force Secure cookies and disable SQL echo |

### 1. Unified Startup (Docker Compose)

From the project root:

```bash
# Clone the repository
git clone https://github.com/saidxp/01-BLOG.git
cd 01-BLOG

# 1) Point the platform at this machine: edit .env and set APP_HOST to your LAN IP or domain
#    (single source of truth — CORS, WebSocket and SSR all read it)

# 2) Generate the self-signed TLS certificate for that host (first run, or after any IP change)
bash nginx/set-up-se.sh <YOUR_IP>

# Start all micro-services (Nginx, Angular SSR, Spring Boot, PostgreSQL)
docker compose up --build -d

# Open the platform (accept the self-signed certificate once)
# https://<YOUR_IP>:8443
```

### 2. Verified Service Ports

| Service | Container Name | Internal Port | Exposed Port |
|---|---|---|---|
| **Nginx (Ingress Gateway)** | `blog-nginx` | `80` / `443` | `http://localhost:1998` (redirects to HTTPS) · `https://localhost:8443` |
| **Angular SSR Frontend** | `blog-frontend` | `4000` | Routed through Nginx `/` |
| **Spring Boot Backend** | `blog-backend` | `8080` | Routed through Nginx `/api/` |
| **PostgreSQL Database** | `blog-postgres` | `5432` | Internal bridge network |

### 3. Local REST API Testing (Swagger UI & OpenAPI)

Once the backend container is running, the interactive Swagger UI and OpenAPI documentation are accessible locally for executing and testing all REST endpoints:

| Interface | URL | Description |
|---|---|---|
| 🌐 **Swagger UI (via Nginx Gateway)** | [http://localhost:1998/api/swagger-ui.html](http://localhost:1998/api/swagger-ui.html) | Interactive web UI to execute & test all REST endpoints |
| ⚙️ **Swagger UI (Direct Backend)** | [http://localhost:8080/api/swagger-ui.html](http://localhost:8080/api/swagger-ui.html) | Direct connection to Tomcat port 8080 |
| 📄 **OpenAPI Specification (JSON)** | [http://localhost:1998/api/v3/api-docs](http://localhost:1998/api/v3/api-docs) | Raw OpenAPI 3 JSON definition |

---
### 4. Docker Map 
```mermaid

flowchart TB
    B["Browser"]

    subgraph HOST["Docker Host"]
        subgraph COMPOSE["Docker Compose: 01-blog"]
            subgraph NET["Bridge Network: app-net"]
                N["Nginx<br/>Ports: 80 / 443"]
                F["Angular SSR Frontend<br/>Port: 4000"]
                API["Spring Boot Backend<br/>Port: 8080"]
                DB[("PostgreSQL 15<br/>Port: 5432")]

                N -->|"/"| F
                N -->|"/api"| API
                N -->|"/media"| API
                API -->|"JDBC: postgres:5432"| DB
            end

            V1[("Volume: postgres_data")]
            V2[("Volume: blog_media")]

            DB --- V1
            API --- V2
        end
    end

    B -->|"HTTP :1998"| N
    B -->|"HTTPS :8443"| N
```
## 👥 Authors & Presentation Credit
Developed and architected by Said Oubaaisse .  
For technical inquiries or architecture walkthroughs, consult the [Backend Documentation](./BACKEND_API_DOCUMENTATION.md) and [Frontend Architecture](./FRONTEND_ARCHITECTURE.md).
