# 🖥️ Frontend Architecture — Technical Documentation

> **Project:** Amine Blog Platform — Frontend  
> **Framework:** Angular 22.1.x (Standalone Components)  
> **Rendering:** SSR via Angular Universal + Express.js  
> **Real-time:** STOMP/SockJS inside a **SharedWorker**  
> **State:** Angular Signals (no NgRx, no BehaviorSubject)  
> **Architecture:** Clean Architecture (Domain → Application → Infrastructure → Presentation)

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Clean Architecture — Layer Model](#2-clean-architecture--layer-model)
3. [Dependency Inversion — Repository Pattern](#3-dependency-inversion--repository-pattern)
4. [Authentication Architecture](#4-authentication-architecture)
5. [Route Guards — authGuard & adminGuard](#5-route-guards--authguard--adminGuard)
6. [Server-Side Rendering (SSR)](#6-server-side-rendering-ssr)
7. [SharedWorker + WebSocket Architecture](#7-sharedworker--websocket-architecture)
8. [State Management with Signals](#8-state-management-with-signals)
9. [Routing & Code Splitting](#9-routing--code-splitting)
10. [Performance Optimizations](#10-performance-optimizations)
11. [Full Data Flow Diagram](#11-full-data-flow-diagram)

---

## 1. Tech Stack

| Technology | Version | Role |
|---|---|---|
| Angular | 22.1.x | Core framework (Standalone API) |
| TypeScript | ~6.0 | Language |
| RxJS | ~7.8 | Async / HTTP streams |
| Angular Signals | Built-in | Reactive state (no NgRx) |
| Angular SSR (`@angular/ssr`) | 22.1.8 | Server-Side Rendering |
| Express.js | 4.x | SSR Node.js server |
| `@stomp/stompjs` | 7.3.0 | STOMP protocol client (in SharedWorker) |
| `sockjs-client` | 1.6.1 | WebSocket fallback transport (in SharedWorker) |
| `marked` + `isomorphic-dompurify` | latest | Safe Markdown rendering |
| Bootstrap | 5.3.8 | Utility CSS |
| Angular Router | Built-in | Lazy-loaded file-based routing |

---

## 2. Clean Architecture — Layer Model

The frontend strictly follows **Clean Architecture**, dividing code into four concentric layers. **Inner layers have zero knowledge of outer layers.**

```
┌────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│   Angular Components, Layouts, Pages, Pipes                 │
│   src/app/presentation/                                     │
│   → Only calls Application Use Cases                        │
│   → Never touches HTTP, never touches Domain directly       │
├────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                        │
│   Use Cases, Guards, State Services (Signals)               │
│   src/app/application/                                      │
│   → Orchestrates Domain + State                             │
│   → Injects abstract Domain Repositories                    │
│   → Zero knowledge of HTTP or Angular infrastructure        │
├────────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE LAYER                     │
│   HTTP Implementations, DTOs, Mappers, Interceptors,       │
│   WebSocket Service, SSR token                             │
│   src/app/infrastructure/                                   │
│   → Implements Domain abstract repository contracts         │
│   → Translates DTOs → Domain Entities via Mappers          │
│   → Registered via DI in app.config.ts                     │
├────────────────────────────────────────────────────────────┤
│                    DOMAIN LAYER                             │
│   Entities, Abstract Repository Interfaces, Domain Errors   │
│   src/app/domain/                                           │
│   → Pure TypeScript — NO Angular imports                    │
│   → The only source of truth for business contracts         │
└────────────────────────────────────────────────────────────┘
```

### Why this matters

- You can **swap the HTTP client** (e.g., switch from `HttpClient` to `fetch`) without touching a single component or use case.
- You can **test use cases** with mock repository implementations, no HTTP needed.
- Presentation layer is **100% decoupled** from API contracts.

---

## 3. Dependency Inversion — Repository Pattern

Every data resource has an **abstract class** in the Domain layer:

```typescript
// domain/auth/repositories/auth.repository.ts
export abstract class AuthRepository {
  abstract login(identifier: string, password: string): Observable<User>;
  abstract getCurrentUser(): Observable<User | null>;
  abstract register(name: string, email: string, password: string): Observable<User>;
  abstract logout(): Observable<void>;
}
```

The **concrete HTTP implementation** lives in Infrastructure:

```typescript
// infrastructure/auth/auth-repository.impl.ts
@Injectable()
export class AuthRepositoryImpl extends AuthRepository {
  private readonly http = inject(HttpClient);
  // ... implements all abstract methods using HttpClient
}
```

They are **wired together** in `app.config.ts` via Angular's DI:

```typescript
{ provide: AuthRepository, useClass: AuthRepositoryImpl }
```

This pattern is repeated for **every domain**: Posts (4 split repositories), Comments, Likes, Notifications, Subscriptions, Profile, Reports, Admin (3 repositories).

> **Note:** The Post domain is split into `PostRepository`, `PostReadRepository`, `PostWriteRepository`, and `PostUpdateRepository` — each interface is a contract for a specific operation type, following the Interface Segregation Principle.

---

## 4. Authentication Architecture

Auth is the most critical cross-cutting concern and spans all four layers.

### 4.1 Bootstrap — APP_INITIALIZER

The very first thing Angular does on startup is resolve the current user **before any component renders**:

```typescript
// app.config.ts
{
  provide: APP_INITIALIZER,
  useFactory: (useCase: GetCurrentUserUseCase) =>
    () => firstValueFrom(useCase.execute()),
  deps: [GetCurrentUserUseCase],
  multi: true,
}
```

**Flow:**

```
Angular Bootstrap starts
        │
        ▼
APP_INITIALIZER fires GetCurrentUserUseCase.execute()
        │
        ▼
AuthRepository.getCurrentUser() → HTTP GET /api/me (withCredentials: true)
        │
        ├── 200 OK → toUserEntity(dto) → AuthState.setUser(user)
        │
        └── 4xx/error → returns null (no throw) → AuthState stays null
        │
        ▼
Bootstrap continues → Routes render → Guards read AuthState signal
```

**Why `APP_INITIALIZER`?**
Guards and components read `AuthState.currentUser()` synchronously as a Signal. If the user were loaded lazily, the guard would always read `null` on first navigation and redirect to login. The initializer ensures state is populated before any guard runs.

### 4.2 AuthState — Signal-based

```typescript
// application/auth/state/auth-state.service.ts
@Injectable({ providedIn: 'root' })
export class AuthState {
  private readonly _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  setUser(user: User): void { this._currentUser.set(user); }
  clearUser(): void { this._currentUser.set(null); }
}
```

- Uses Angular Signals — **no subscriptions**, no `BehaviorSubject`, no memory leaks.
- `currentUser` is exposed as **read-only** to prevent unauthorized mutation.
- `providedIn: 'root'` ensures a singleton across SSR and browser.

### 4.3 Auth Use Cases

| Use Case | Responsibility |
|---|---|
| `GetCurrentUserUseCase` | Called at bootstrap — loads user from cookie session |
| `LoginUseCase` | Calls repo → on success calls `AuthState.setUser()` |
| `LogoutUseCase` | Calls repo → on success calls `AuthState.clearUser()` + disconnects SharedWorker |
| `RegisterUseCase` | Calls repo → on success calls `AuthState.setUser()` |

### 4.4 Cookie-based Auth (No Tokens in JS)

The JWT token is stored in an `httpOnly` cookie managed by the browser — **never accessible from JavaScript**. Every request uses `{ withCredentials: true }` which automatically includes the cookie. This eliminates all XSS token-theft vectors.

---

## 5. Route Guards — `authGuard` & `adminGuard`

Guards are Angular functional guards (`CanActivateFn`) — no class overhead.

```typescript
// application/auth/guards/auth.guards.ts

export const authGuard: CanActivateFn = (_route, state) => {
  const authState = inject(AuthState);
  return authState.currentUser()
    ? true
    : inject(AuthNavigationService).loginUrl(state.url);  // ← redirects with returnUrl
};

export const adminGuard: CanActivateFn = (_route, state) => {
  const user = inject(AuthState).currentUser();
  if (!user) return inject(AuthNavigationService).loginUrl(state.url);
  return user.role === Role.ADMIN ? true : inject(Router).parseUrl('/');
};
```

### Guard Decision Tree

```
Route Activated
      │
      ▼
authGuard checks AuthState.currentUser() [Signal — synchronous]
      │
      ├── NOT null → ✅ Allow navigation
      │
      └── null → UrlTree to /login?returnUrl=<original-path>
                        │
                        └── After login, AuthNavigationService
                            reads returnUrl param and redirects back
```

```
Admin Route Activated
      │
      ▼
adminGuard checks AuthState.currentUser()
      │
      ├── null → redirect to /login
      │
      ├── user.role === 'ADMIN' → ✅ Allow
      │
      └── user.role === 'USER' → redirect to /  (silent 403)
```

### `AuthNavigationService`

Handles **safe return URL construction** after login:

```typescript
loginUrl(returnUrl: string): UrlTree {
  return this.router.createUrlTree(['/login'], {
    queryParams: { returnUrl: this.safeReturnUrl(returnUrl) }
  });
}
```

`safeReturnUrl()` validates the URL is internal (starts with `/`, not `//`) — **prevents open redirect attacks**.

### Routes That Use Guards

| Route | Guard |
|---|---|
| `/new` | `authGuard` |
| `/post/:id/edit` | `authGuard` |
| `/notifications` | `authGuard` |
| `/admin/**` | `adminGuard` (on both `canActivate` + `canActivateChild`) |

---

## 6. Server-Side Rendering (SSR)

The app runs under **Angular Universal** using `@angular/ssr` with an Express.js server. This means every page request is first rendered on the Node.js server, then hydrated on the client.

### 6.1 Architecture

```
Browser requests http://blog.com/post/42
        │
        ▼
Nginx (reverse proxy)
        │
        ▼
Express.js server (Node.js) — server.ts
        │
        ▼
Angular CommonEngine.render()
   - runs Angular with APP_INITIALIZER
   - renders HTML string with real data
   - injects SERVER_REQUEST token with Express `req` object
        │
        ▼
Returns full HTML to browser (SEO-friendly, fast first paint)
        │
        ▼
Browser hydrates Angular (client-side takes over)
```

### 6.2 The Critical SSR Problem — Cookie Forwarding

When Angular renders on the server, **there is no browser cookie jar**. HTTP requests made during SSR don't automatically carry the user's JWT cookie.

**Solution: `cookieForwardingInterceptor`**

```typescript
// infrastructure/auth/interceptors/cookie-forwarding.interceptor.ts
export const cookieForwardingInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) {
    const request = inject(SERVER_REQUEST, { optional: true }); // Express Request

    const cookieHeader = request?.headers['cookie'];
    if (cookieHeader) {
      req = req.clone({ setHeaders: { Cookie: cookieHeader } });
    }
  }
  return next(req);
};
```

**Flow:**

```
Browser sends GET /post/42 (with Cookie: jwt=<token>)
        │
        ▼
Express captures the raw HTTP request
        │
        ▼
Injects it as SERVER_REQUEST token into Angular DI
        │
        ▼
cookieForwardingInterceptor detects isPlatformServer()
        │
        ▼
Extracts Cookie header from Express req → clones outgoing HTTP request with it
        │
        ▼
GET /api/me succeeds on server → AuthState populated → guard passes
        │
        ▼
Rendered HTML contains user-specific content (e.g. unread badge)
```

### 6.3 SSR Token Design

```typescript
// infrastructure/ssr/request.token.ts
export const SERVER_REQUEST = new InjectionToken<Request>('SERVER_REQUEST');
```

Provided in `server.ts` per-request:

```typescript
providers: [
  { provide: APP_BASE_HREF, useValue: baseUrl },
  { provide: SERVER_REQUEST, useValue: req }  // ← scoped to this render
]
```

This is the **standard Angular pattern** for passing server context into the DI tree without coupling infrastructure code to Express directly.

### 6.4 SSR Configuration

```typescript
// app.config.server.ts
const serverConfig: ApplicationConfig = {
  providers: [ provideServerRendering() ]
};
export const config = mergeApplicationConfig(appConfig, serverConfig);
```

The server config **merges** with the base app config — same DI registrations, same interceptors, same use cases. Only `provideServerRendering()` is added.

### 6.5 What Is and Is NOT Rendered on Server

| Feature | Rendered on Server? | Why |
|---|---|---|
| Post list, post detail | ✅ Yes | Full SEO benefit |
| User profiles | ✅ Yes | Public, SEO benefit |
| Auth state (`/api/me`) | ✅ Yes | via cookie forwarding |
| WebSocket (SharedWorker) | ❌ No | `typeof window === 'undefined'` guard |
| Theme toggle | ❌ No | DOM only |

---

## 7. SharedWorker + WebSocket Architecture

This is the most technically interesting part of the frontend. Real-time notifications use a **SharedWorker** — a special browser thread that **lives across multiple tabs**.

### 7.1 Why SharedWorker Instead of a Regular WebSocket?

| Approach | Problem |
|---|---|
| WebSocket in Angular service | One connection per tab. 5 tabs = 5 STOMP sessions. Wasteful. |
| WebSocket in Web Worker | Dedicated per-tab worker — same problem. |
| **SharedWorker** | **One STOMP connection, shared across ALL tabs.** ✅ |

The SharedWorker runs independently of any Angular tab. When a notification arrives, it broadcasts to **all connected Angular tabs** simultaneously.

### 7.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  Browser Process                         │
│                                                          │
│  ┌─────────────┐    MessagePort    ┌─────────────────┐  │
│  │  Tab 1      │◄──────────────────│                 │  │
│  │  Angular    │                   │  SharedWorker   │  │
│  └─────────────┘                   │  (single STOMP  │  │
│                                    │   connection)   │  │
│  ┌─────────────┐    MessagePort    │                 │  │
│  │  Tab 2      │◄──────────────────│  websocket      │  │
│  │  Angular    │                   │  .shared-       │  │
│  └─────────────┘                   │  worker.ts      │  │
│                                    │                 │  │
│  ┌─────────────┐    MessagePort    │                 │  │
│  │  Tab 3      │◄──────────────────│                 │  │
│  │  Angular    │                   └────────┬────────┘  │
│  └─────────────┘                            │           │
└─────────────────────────────────────────────┼───────────┘
                                              │  STOMP/SockJS
                                              ▼
                                    Spring Boot Backend
                                  /user/queue/notifications
```

### 7.3 SharedWorker Internals

```typescript
// workers/websocket.shared-worker.ts
const ports: MessagePort[] = [];  // one per connected Angular tab

workerContext.onconnect = (event) => {
  const port = event.ports[0];
  ports.push(port);     // register the new tab
  port.start();

  port.onmessage = (event) => {
    if (event.data?.type === 'DISCONNECT') {
      // Broadcast REFRESH to ALL tabs (force logout sync)
      for (const p of ports) {
        p.postMessage({ type: 'REFRESH' });
      }
      client?.deactivate();
      client = null;
    }
  };

  connectWebSocket(); // idempotent — won't reconnect if already active
};
```

**Key behaviors:**
1. `ports[]` array accumulates one `MessagePort` per open tab.
2. `connectWebSocket()` checks `client?.active` before creating a new STOMP connection — **idempotent**.
3. On incoming STOMP message: **fan-out** to all ports → all tabs get the notification simultaneously.
4. On `DISCONNECT` message: broadcasts `REFRESH` to all tabs, then deactivates STOMP.

### 7.4 Angular Side — `WebSocketNotificationService`

```typescript
// infrastructure/notification/websocket-notification.service.ts

connect(): void {
  if (typeof window === 'undefined') return; // ← SSR guard

  this.worker = new SharedWorker(
    new URL('../../workers/websocket.shared-worker', import.meta.url),
    { type: 'module' }
  );

  this.worker.port.onmessage = (event) => {
    if (event.data?.type === 'REFRESH') {
      // another tab triggered logout → force full page reload
      this.router.navigateByUrl('/');
      window.location.reload();
      return;
    }

    if (event.data?.type === 'NOTIFICATION') {
      const dto = JSON.parse(event.data.data);
      const notification = toNotificationEntity(dto);
      this.notificationState.addNotification(notification); // → Signal update
    }
  };

  this.worker.port.start();
}

disconnect(): void {
  this.worker?.port.postMessage({ type: 'DISCONNECT' });
}
```

### 7.5 Lifecycle — When Is the Worker Connected?

```
HeaderComponent.ngOnInit()
        │
        ├── if (currentUser())  ← only for authenticated users
        │         │
        │         ├── getUnreadCountUseCase.execute()  ← initial badge count
        │         │
        │         └── webSocketNotificationService.connect()  ← attaches to SharedWorker
        │
        └── (anonymous users) → nothing, no worker, no WebSocket
```

```
User clicks Logout
        │
        ▼
LogoutUseCase.execute()
        │
        ├── AuthRepository.logout() → POST /api/auth/logout (clears cookie)
        │
        └── AuthState.clearUser()
                │
                ▼
HeaderComponent.logout()
        │
        └── webSocketNotificationService.disconnect()
                │
                └── SharedWorker broadcasts REFRESH to all tabs → reload
```

### 7.6 Cross-Tab Logout

When the user logs out from one tab:
1. The Angular tab calls `disconnect()` → sends `DISCONNECT` to SharedWorker.
2. SharedWorker broadcasts `REFRESH` to **all** connected `MessagePort`s.
3. Every other tab receives `REFRESH` → does `window.location.reload()`.
4. On reload, `APP_INITIALIZER` runs → `/api/me` returns 401 → `AuthState` stays null → user sees the public view.

This is **cross-tab logout synchronization** with zero WebSocket broadcast from the server needed.

---

## 8. State Management with Signals

The project uses **Angular Signals** exclusively — no `BehaviorSubject`, no NgRx, no RxJS state streams.

### 8.1 AuthState

```typescript
@Injectable({ providedIn: 'root' })
export class AuthState {
  private readonly _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly(); // read-only outside
}
```

### 8.2 NotificationState

```typescript
@Injectable({ providedIn: 'root' })
export class NotificationState {
  private readonly _unreadCount = signal(0);
  private readonly _notifications = signal<Notification[]>([]);

  readonly unreadCount = this._unreadCount.asReadonly();
  readonly notifications = this._notifications.asReadonly();

  addNotification(n: Notification): void {
    this._notifications.update(list => [n, ...list]); // prepend
    this._unreadCount.update(count => count + 1);
  }

  decrement(): void {
    this._unreadCount.update(count => Math.max(0, count - 1));
  }
}
```

### 8.3 ThemeService

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isDark = signal(false);

  toggle(): void {
    this.isDark.update(v => !v);
    this.document.documentElement.classList.toggle('dark', this.isDark());
  }
}
```

### 8.4 Component-local State

Components use `signal<T>()` directly for local UI state:

```typescript
// In PublicPostsFeed
readonly posts = signal<Post[]>([]);
readonly isLoading = signal(true);
readonly isLoadingMore = signal(false);
readonly errorMessage = signal<string | null>(null);
```

**Why Signals over RxJS subjects for state?**
- No `subscribe()`/`unsubscribe()` boilerplate — no memory leaks.
- Angular's change detection natively understands Signals — only the exact DOM nodes that depend on a Signal re-render.
- Read-only exposure via `.asReadonly()` enforces unidirectional data flow.

---

## 9. Routing & Code Splitting

### 9.1 Router Structure

Three top-level layout shells with nested lazy routes:

```
/                   → MainLayoutComponent
  /                 → HomeComponent           (lazy)
  /new              → CreatePostComponent     (lazy, authGuard)
  /post/:id         → PostDetailComponent     (lazy)
  /post/:id/edit    → EditPostComponent       (lazy, authGuard)
  /profile/:username→ ProfileComponent        (lazy)
  /notifications    → NotificationsComponent  (lazy, authGuard)

/admin              → AdminLayoutComponent    (adminGuard on all children)
  /admin/users      → AdminUsersComponent     (lazy)
  /admin/posts      → AdminPostsComponent     (lazy)
  /admin/reports    → AdminReportsComponent   (lazy)

/                   → AuthLayoutComponent
  /login            → LoginComponent          (lazy)
  /register         → RegisterComponent       (lazy)

/**                 → NotFoundComponent       (lazy)
```

### 9.2 Lazy Loading

Every route uses `loadComponent()` with dynamic `import()`:

```typescript
{
  path: 'notifications',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./presentation/notifications/.../notifications.component')
      .then(m => m.NotificationsComponent)
}
```

**Benefits:**
- Zero admin code is ever shipped to regular users.
- Zero auth page code is in the initial bundle.
- Angular CLI splits each lazy component into its own chunk automatically.
- First load only downloads the shell + current route.

### 9.3 Layout Components

| Layout | Used For |
|---|---|
| `MainLayoutComponent` | All public + authenticated pages (includes Header) |
| `AuthLayoutComponent` | Login / Register (clean, no header) |
| `AdminLayoutComponent` | Admin pages (protected by `adminGuard` at layout level) |

---

## 10. Performance Optimizations

### 10.1 SSR + `provideClientHydration()`

```typescript
provideClientHydration()
```

- Angular renders HTML on the server (fast first paint, SEO).
- On the browser, instead of destroying and re-rendering everything, Angular **reuses existing DOM nodes** (hydration).
- Result: No flicker, no layout shift, zero re-fetching of already-rendered data.

### 10.2 `withFetch()` on HttpClient

```typescript
provideHttpClient(withFetch(), withInterceptors([cookieForwardingInterceptor]))
```

`withFetch()` tells Angular to use the native browser `fetch` API instead of `XMLHttpRequest` — **required for SSR** (Node.js has native `fetch`) and also faster in modern browsers.

### 10.3 SharedWorker — One STOMP Connection for All Tabs

As detailed in Section 7. A user with 5 tabs open only holds **1 WebSocket connection** to the server, not 5.

### 10.4 `signal()` for Change Detection

Angular Signals enable **fine-grained reactivity** — only the specific template expressions that read a changed Signal are re-evaluated, not the entire component tree. This is fundamentally more efficient than `ChangeDetectionStrategy.Default`.

### 10.5 Lazy STOMP / SockJS Import in SharedWorker

```typescript
// Inside SharedWorker
const { default: SockJS } = await import('sockjs-client/dist/sockjs');
```

SockJS is only loaded **when a user logs in and the worker needs to connect** — not on every page load. Anonymous users never load WebSocket code.

### 10.6 Pagination / Infinite Scroll

All list endpoints use pagination. Components implement a `loadMore()` pattern:

```typescript
loadMore(): void {
  if (this.currentPage + 1 < this.totalPages) {
    this.loadPosts(this.currentPage + 1, true, this.isLoadingMore);
  }
}
```

New pages are **appended** to the Signal array, not replaced — no full re-render of existing items.

### 10.7 Static Asset Caching

Express serves static files with aggressive caching:

```typescript
server.get('*.*', express.static(browserDistFolder, { maxAge: '1y' }));
```

All JS/CSS chunks get `Cache-Control: max-age=31536000`. Angular CLI fingerprints filenames, so cache-busting is automatic on new deployments.

---

## 11. Full Data Flow Diagram

**Scenario: Authenticated user opens the app in a new tab**

```
1. Browser → Express SSR → Angular bootstraps
                │
                ▼
2. APP_INITIALIZER → GetCurrentUserUseCase.execute()
                │
                ▼
3. AuthRepositoryImpl.getCurrentUser()
   → cookieForwardingInterceptor (SSR) attaches Cookie header
   → GET /api/me (Spring Boot)
                │
     ┌──────────┴──────────┐
     │ 200 OK              │ 401
     ▼                     ▼
4. toUserEntity(dto)    AuthState stays null
   → AuthState.setUser()
                │
                ▼
5. Angular renders HTML (with user context)
   → Express sends full HTML to browser
                │
                ▼
6. Browser hydrates (provideClientHydration)
                │
                ▼
7. HeaderComponent.ngOnInit()
   → getUnreadCountUseCase → GET /api/notifications/unread-count
   → notificationState.setUnreadCount(n)
   → webSocketNotificationService.connect()
                │
                ▼
8. new SharedWorker('websocket.shared-worker.ts')
   → connects via MessagePort
                │
                ▼
9. SharedWorker (if not already active):
   → new SockJS('/ws')
   → STOMP client.activate()
   → subscribes to /user/queue/notifications
                │
                ▼
10. Another user likes a post →
    Spring Boot pushes NotificationDto via SimpMessagingTemplate
                │
                ▼
11. SharedWorker receives STOMP message
    → port.postMessage({ type: 'NOTIFICATION', data: ... }) to ALL tabs
                │
                ▼
12. WebSocketNotificationService.onmessage()
    → toNotificationEntity(dto)
    → notificationState.addNotification(n)
                │
                ▼
13. Signal updates →
    Header badge re-renders automatically (Angular change detection)
    Notification list prepends the new item
```

---

*Documentation generated from source analysis of `src/app/` — Angular 22.1.x, TypeScript ~6.0.*
