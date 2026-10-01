# Redesign Mission Log

## Phase 1 — Subject analysis

**Status: COMPLETE**

- Read the 01Blog subject.
- Confirmed the responsive framework requirement.
- Confirmed Bootstrap is allowed.
- Established the goal: redesign the existing frontend, not rebuild functionality.

## Phase 2 — Frontend architecture audit

**Status: COMPLETE**

- Inspected the repository.
- Documented existing screens, components, routes, architecture, and functionality.
- Identified functional gaps.
- Confirmed that Bootstrap and Angular Material are absent.

## Phase 3 — DEV.to UX research

**Status: COMPLETE**

- Inspected DEV.to on desktop, tablet, and mobile.
- Studied feed structure, post cards, article detail, profile, comments, responsive behavior, and accessibility indicators.
- Documented borrow-versus-avoid guidance.

## Phase 4 — Figma preparation

**Status: COMPLETE**

- Prepared the master Figma brief.
- DEV.to screenshots will be supplied manually as visual references.
- Confirmed that Figma is responsible for design only.
- Required the final design to be Bootstrap-friendly and map to the existing Angular structure.

## Phase 5 — Figma Design

**Status: IN PROGRESS**

Figma is defining the visual system, responsive screens, component variants, and interaction states using the audit, research, direction, and constraints in this folder.

## Phase 6 — Design Review

**Status: PLANNED**

Review the Figma output against:

- The original subject.
- The real project architecture.
- DEV.to research.
- Responsive behavior.
- Bootstrap feasibility.

## Phase 7 — Codex Implementation

**Status: IN PROGRESS**

Implementation begins only after design approval. Codex will merge the approved design into the existing Angular frontend while preserving application behavior.

### Stage 1 — Foundation

**Status: COMPLETE**

- Added Bootstrap 5.3 as a CSS-only layout and responsive utility dependency; no Bootstrap JavaScript was enabled.
- Added the approved global color, typography, spacing, radius, border, shadow, focus, and semantic-state tokens.
- Added Inter with system-font fallbacks and established global body, surface, button, and form foundations.
- Established structural styling for `MainLayout`, `AuthLayout`, and `AdminLayout` without redesigning feature pages.
- Rebuilt the global header in Angular for guest, authenticated, and admin states.
- Preserved current-user signals, role checks, notification state, unread count, WebSocket startup, profile navigation, logout behavior, and existing routes.
- Added an Angular-controlled mobile navigation menu with explicit expanded state and Escape/outside-click dismissal.
- Kept Following as the existing Home page state and did not add the unsupported prototype route.
- Verified the production browser and SSR bundles and checked the header at 390, 768, 900, and 1440 px.
- Verified guest, authenticated, admin, unread-notification, profile-menu, mobile-menu, and logout states with a temporary mocked API; no backend files were changed.

### Stage 2 — Core User UI

**Status: PAUSED — IMPLEMENTATION SUBSTANTIALLY COMPLETE, VERIFICATION INCOMPLETE**

Implementation was stopped at the user's request. The repository remains in its current uncommitted working state.

#### Complete

- Added shared visual foundations for 01Blog buttons, avatars, loading skeletons, empty/error states, feed lists, pagination footers, and Markdown content.
- Redesigned the guest public feed and authenticated Explore/Following feed presentation while preserving the existing `/` route and signal-driven tab behavior.
- Preserved feed loading, error, empty, pagination, and loading-more states.
- Redesigned the reusable `PostCard` using real post data and existing routes.
- Added defensive image/video/text-only rendering based on the existing `MediaType`, including compatibility with serialized enum strings.
- Preserved author, avatar, title, timestamp, Like count, comment count, media URL/type, and post route data.
- Did not add bookmarks, tags, reading time, excerpts, card Like state, fake community content, or a `/following` route.
- Applied the premium profile composition using only available profile data.
- Corrected the visitor-visible Edit Profile bug: owners now receive Edit Profile only; visitors receive Subscribe/Unsubscribe and Report only.
- Preserved owner state, subscribed state, inline profile editing, avatar upload, reporting, and user-post pagination bindings.
- Implemented the editorial Post Detail structure with constrained reading width and responsive cover media.
- Correctly branched Post Detail image and video covers.
- Added Markdown styles for headings, paragraphs, links, lists, blockquotes, inline code, code blocks, tables, images, videos, horizontal overflow, and YouTube embeds.
- Preserved the existing `marked` plus DOMPurify pipeline and the YouTube hostname allowlist.
- Preserved owner Edit/Delete actions, `ConfirmModal`, `LikeButton`, comment submission, comment listing, and local comment insertion behavior.
- Kept comment work limited to compatibility styling; the dedicated Comments redesign has not started.

#### Unfinished

- Full Stage 2 responsive and interaction verification is incomplete.
- Following was implemented but was not yet manually clicked and verified in the current test run.
- The 900 px and 1440 px Stage 2 layouts were not yet checked in the current test run.
- Owner profile editing was not yet exercised end to end.
- Visitor subscribed and unsubscribed states were not yet visually verified in the current test run.
- Report modal opening, confirmation, and submission were not yet exercised in the current test run.
- Image and video Post Detail routes were not yet visually inspected in the current test run.
- Post Detail owner versus non-owner controls were not yet fully verified in the current test run.
- Long Markdown tables, code overflow, images, and YouTube embeds were not yet visually checked at every required viewport.
- Final Stage 2 screenshots were not curated or copied into the deliverables folder.
- The Stage 2 final build and SSR smoke check still need to be rerun after the last whitespace-only cleanup so the final handoff has fresh verification evidence.

#### Current build and test status

- The latest Angular production build completed successfully with browser and server bundles and no TypeScript or Angular template errors.
- That successful build was run after the Stage 2 implementation; one trailing-whitespace-only CSS cleanup happened afterward.
- The build still reports the existing `sockjs-client/dist/sockjs` CommonJS optimization warning.
- The Stage 2 SSR server started successfully at `http://localhost:4000` and rendered both guest and cookie-mocked authenticated pages.
- Playwright verified the guest feed at 390 px, including text-only, image, and video PostCard variants.
- Playwright verified the authenticated Explore feed at 768 px, including the unread notification state and long-title wrapping.
- No final Stage 2 SSR HTTP smoke assertion has been recorded yet.

#### Known issues and test-environment limitations

- The real backend was not running during the Stage 2 browser checks. A temporary mock API on port 8080 supplied test users, profiles, feeds, posts, comments, subscription state, and report responses.
- Mock authentication does not use the Login screen. It is simulated with the browser cookie `test-role=member`.
- The mock API does not implement the real SockJS/STOMP notification endpoint, so authenticated browser checks can show `/ws/info` connection errors. This does not verify real-time notifications.
- Mock image and video URLs are external test assets and are not application data or repository assets.
- SSR requests for `/favicon.ico` are currently routed through Angular and can log the existing `NG04002: 'favicon.ico'` warning/error. This was observed before Stage 2 and has not been changed.
- Angular 22.1.8 requires Node 22.22.3 or newer; verification used Node 24.15.0 through NVM because the default WSL Node version is 22.22.1.
- The working tree also contains pre-existing/unrelated untracked items, including `figma/` and `test.java`; they were not changed or removed as part of this checkpoint.

#### Exact next safe task

Resume with **Stage 2 verification only**. Do not redesign or refactor first. Using the current working tree, run a fresh production build and SSR HTTP smoke test, then finish the explicit state matrix: Following; owner profile and edit flow; visitor subscribed/unsubscribed and report flow; image/video Post Detail; owner/non-owner Post Detail; and long Markdown at 390, 768, 900, and 1440 px. Capture final screenshots. Make only narrowly scoped Stage 2 fixes for defects directly observed during that verification, rerun the affected checks, update this log, and stop before Stage 3.

### Stage 3 — Remaining Application UI

**Status: COMPLETE — MOCK-VERIFIED, REAL BACKEND REGRESSION REMAINS**

#### Complete

- Redesigned Login and Register inside the existing `AuthLayout`, preserving reactive controls, validators, loading state, backend errors, and redirect handlers.
- Removed the temporary `Test For Now` Login label and replaced it with the real Email address label.
- Created one consistent editorial authoring system for Create and Edit Post.
- Preserved `#contentTextarea`, Markdown selection/cursor helpers, inline image/video upload, YouTube insertion, cover selection, validation, create submission, edit loading/population, and update behavior.
- Redesigned Notifications with clear read/unread rows, avatar fallback, timestamps, loading/error/empty states, and pagination.
- Preserved the shared `NotificationState`, mark-as-read request, unread decrement, post navigation, and WebSocket-compatible state source.
- Finished CommentList, SubmitComment, LikeButton, and ConfirmModal styling.
- Preserved the flat comment model, local comment insertion, deletion permissions, pagination, Like state, submission states, and confirmation outputs.
- Made ConfirmModal an accessible `alertdialog` with labelled content, responsive actions, Escape dismissal, focus trapping, initial focus placement, and trigger-focus restoration.
- Redesigned Admin Users, Posts, and Reports inside the existing `AdminLayout`.
- Preserved all real table fields, pagination, Ban/Unban, Delete User, View/Delete Post, and expandable report reasons.
- Used Bootstrap responsive table wrappers so narrow screens scroll tables locally without creating page-level horizontal overflow.
- Added shared global presentation patterns for page headings, form shells, controls, field errors, alerts, pagination, status badges, and moderation tables.
- Did not add drafts, tags, AI tools, preview mode, scheduling, Mark All Read, nested replies, comment reactions, analytics, search, or report-resolution actions.

#### Build and SSR verification

- Fresh Angular production build passed on Node 24.15.0 after the final ConfirmModal focus fix.
- Browser and server bundles completed without TypeScript or Angular template errors.
- The existing `sockjs-client/dist/sockjs` CommonJS optimization warning remains the only build warning.
- The generated SSR server was started on isolated port 4100.
- HTTP 200 smoke checks passed for `/`, `/login`, `/register`, `/new`, `/notifications`, `/post/41/edit`, `/admin/users`, `/admin/posts`, and `/admin/reports`.
- SSR still logs failed backend fetches while the real API is offline; this is expected in the current environment.
- The existing `/favicon.ico` SSR `NG04002` warning remains and was not changed during Stage 3.

#### Responsive and interaction verification

- Playwright checks covered 390, 768, 900, and 1440 px.
- Login/Register structure and Login validation errors were checked at 390 px.
- Create Post was checked at 390, 768, and 1440 px; its Markdown toolbar scrolls internally on mobile without page overflow.
- Edit Post loading/population was checked at 900 px with mocked real-shape post data.
- Notifications were checked at 390 px with mocked read/unread rows, long content, fallback avatars, pagination, mark-as-read, and navigation.
- Comments and ConfirmModal were checked at 390 and 768 px with mocked real-shape post/comment data.
- Comment local insertion cleared the composer and prepended the returned comment; confirmed deletion removed the permitted comment.
- ConfirmModal moved focus to Cancel, closed with Escape, and restored focus to the Delete Comment trigger.
- Admin Users was checked at 390 px, Reports at 900 px, and Posts at 1440 px using mocked real-shape records and long text.
- Admin table overflow stayed inside the Bootstrap responsive wrapper; report expansion and Ban-to-Unban state updates were exercised.
- Screenshots are stored in the local `.playwright-cli/` verification output.

#### Remaining limitations and known issues

- The real backend was not running, so Stage 3 API-dependent verification used Playwright route mocks matching the current DTO shapes.
- Real authentication redirects, uploads, create/update submissions, deletes, notification WebSocket delivery, and mutations against persistent backend data still require the final integration pass.
- Browser console checks contain the expected `http://localhost:8080/api/me` connection refusal while the API is offline.
- The favicon SSR `NG04002` issue and SockJS CommonJS warning remain pre-existing known issues.

#### Exact next safe task

Begin the final **full-project polish and real-backend integration/regression stage**. Start the actual backend and frontend, then rerun the complete guest/member/owner/visitor/admin matrix with persistent data. Verify authentication, uploads, Create/Edit, notification WebSocket delivery and read synchronization, likes/comments/deletes, profile subscribe/report, admin mutations, Stage 2 media/Markdown cases, and all responsive widths. Fix only defects directly observed during that integrated run, resolve or explicitly accept the favicon and CommonJS warnings, curate final screenshots, and update this log with final evidence.

### Stage 4 — Authentication UX, Comment Time, Card Consistency, and Profile Statistics

**Status: COMPLETE — REAL BACKEND VERIFIED**

- Added semantic comment timestamps using the existing backend `createdAt` value, with SSR-safe initial rendering, browser-relative labels, exact accessible date/time text, and minute refreshes.
- Added one shared authentication-navigation service plus functional authenticated/admin route guards.
- Guests remain able to read public feeds, posts, profiles, and comments; protected routes and Like, Comment, Subscribe, and Report actions redirect to Login with a validated internal return URL.
- Updated Login to accept either username or email through the existing backend `identifier` contract and return users to the original protected page after authentication.
- Standardized the reusable PostCard at a `48rem` maximum width while retaining responsive full-width behavior, natural content height, and the existing image/video/text variants.
- Added exact `postsCount` and `commentsReceivedCount` aggregates to the public profile response without a database migration.
- Added a responsive profile contribution card beside the post list at 900 px and above, stacking above posts on smaller screens.
- Added targeted backend tests for profile aggregates and frontend tests for relative time, safe return URLs, guest route protection, and non-admin route protection.
- Removed two obsolete Angular starter assertions that referenced the deleted generated title and starter markup so the real frontend test suite can run.

#### Verification

- Maven tests passed: 2 tests, 0 failures.
- Angular unit tests passed: 7 tests, 0 failures.
- Angular production browser and SSR bundle build passed; the existing SockJS CommonJS optimization warning remains.
- Real-backend browser verification passed for username login, email login, logout, protected-route return navigation, guest Like/Comment/Subscribe/Report redirects, comment timestamps, and profile statistics.
- Responsive profile/PostCard checks passed at 390, 900, and 1440 px with no page-level horizontal overflow; the existing feed/card structure remains valid at 768 px.
- Screenshots were captured at `output/playwright/profile-stats-1440.png` and `output/playwright/profile-stats-390.png`.

## Phase 8 — Functional/Responsive Testing

**Status: PLANNED**

Verify that existing behavior remains intact across applicable guest, authenticated, owner, visitor, and admin states, and across desktop, tablet, and mobile widths.

---

Last updated: 2026-09-27 (Stage 4 authentication UX, comment time, card consistency, and profile statistics complete)
