# Frontend Architecture Audit

This document records the current frontend implementation before any redesign work. It is descriptive only; the issues listed here are not fixed as part of this documentation phase.

## Technology and application structure

- Angular core: 22.1.6.
- Angular CLI: 22.1.8.
- TypeScript: 6.
- RxJS: 7.8.
- The frontend uses standalone Angular components rather than NgModule-based feature modules.
- SSR and client hydration are configured.
- Bootstrap is not currently installed.
- Angular Material is not currently installed.
- No dedicated icon library is installed; the current UI frequently uses emoji.
- Markdown is rendered with `marked` and sanitized with `isomorphic-dompurify`.
- Real-time notifications use STOMP/SockJS.

The source follows a layered architecture:

`presentation → application use cases/state → domain entities/repositories → infrastructure HTTP/WebSocket implementations`

Presentation components should continue to depend on application-facing behavior rather than bypassing the existing layers.

## Routes

The primary routes are:

- `/` — home with public/explore and authenticated feed states.
- `/new` — create post.
- `/post/:id` — post detail.
- `/post/:id/edit` — edit post.
- `/profile/:username` — user profile.
- `/notifications` — notifications.
- `/admin/users` — user administration.
- `/admin/posts` — post administration.
- `/admin/reports` — report administration.
- `/login` — login.
- `/register` — registration.

The main public/authenticated routes use `MainLayout`; administrative routes use `AdminLayout`; login and registration use `AuthLayout`.

There is currently no wildcard/404 route. `/admin` has no default child route and can render an empty shell.

## Existing screens

- Login.
- Registration.
- Home with public/explore and following feeds.
- Dynamic user profile for owners and visitors.
- Edit profile.
- Create post.
- Edit post.
- Post detail.
- Notifications.
- Reporting modal flow.
- Admin users.
- Admin posts.
- Admin reports.

There is no real admin dashboard screen and no dedicated 404 screen.

## Reusable components

Important reusable presentation pieces include:

- Header.
- Main, authentication, and administration layouts.
- Public and authenticated feed components.
- PostCard.
- LikeButton.
- CommentList.
- SubmitComment.
- SubscribeButton.
- UserPostList.
- EditProfile.
- Notification views/state consumers.
- ReportModal.
- ConfirmModal.

The redesign should refine and reuse these boundaries where practical instead of duplicating screen-specific markup.

## Angular bindings and contracts to preserve

The templates use Angular's modern `@if` and `@for` control flow. Existing bindings include:

- Reactive form groups and `formControlName` fields.
- Form submit handlers for authentication, post creation/editing, comments, and profile editing.
- Router links and route parameters, especially post IDs and profile usernames.
- Loading, error, empty, and conditional display state.
- Owner checks for post/profile editing and deletion.
- Role checks for administrative visibility.
- Component inputs and outputs for posts, likes, comments, profiles, subscriptions, and modal actions.
- File selection/upload handlers for post and profile media.
- The `#contentTextarea` template reference used by the Markdown editor.
- Markdown rendering and sanitization.
- Comment list refresh/update behavior after submissions.
- Like state/count changes.
- Modal confirmation and report events.

Visual changes must not replace these bindings with static HTML.

## Authentication and authorization state

- Authentication is cookie-based.
- An application initializer calls `/api/me` to recover the current user.
- The shared authentication state exposes the current user through Angular state/signals.
- Login and registration populate the current-user state.
- Logout clears it.
- The header conditionally displays authenticated and role-specific actions.
- An SSR interceptor forwards cookies during server rendering.
- Backend authorization is currently relied upon for protected actions.

Known gap: there are no frontend route guards, including for admin routes. This must be documented and reviewed separately; it is not being changed during the redesign documentation phase.

## Notifications and WebSocket behavior

- A shared notification state holds the notification collection and unread count.
- STOMP/SockJS provides live notification delivery.
- Header notification state and the notifications screen must remain synchronized.
- The unread-count behavior must continue to work across navigation and responsive header variants.

## Current styling

- The global `front/src/styles.css` is effectively empty apart from a comment.
- Most styling is component-scoped external CSS.
- There is no SCSS design-token system.
- Bootstrap is not present.
- Angular Material is not present.
- Login and submit-comment styling is minimal or empty.
- Feeds, forms, modals, and admin tables repeat similar CSS instead of sharing a defined visual system.
- The header is more visually developed than most of the application.
- The current palette is mainly black, gray, red, and a stronger blue in the header.

## Responsive weaknesses

- The viewport meta tag and some fluid/max-width layouts exist.
- Modals generally use a constrained percentage width.
- The header contains the clearest mobile breakpoint, around 640 px.
- Admin sidebar/table layouts are weak on small screens.
- Several forms need better mobile gutters.
- Editor/toolbars do not reliably wrap.
- Embedded media and iframes are not consistently responsive.
- Responsive behavior is handled locally rather than through a systematic grid and breakpoint strategy.

## Design-safe areas

The following are generally safe to restyle when bindings and semantics remain intact:

- Typography and color tokens.
- Page backgrounds and content surfaces.
- Spacing, gutters, and max-width containers.
- Card borders, shadows, radii, and internal layout.
- Header visual treatment and responsive arrangement.
- Feed tab presentation.
- Form control and button styling.
- Modal presentation.
- Markdown typography and code-block styling.
- Profile composition and media treatment.
- Admin navigation/table presentation.
- Empty, loading, and error presentation.

## Logic-sensitive areas

Extra care is required around:

- Route definitions and route parameters.
- Current-user initialization and cookie forwarding.
- Owner and role conditionals.
- Reactive forms, validators, and submit handlers.
- Component inputs/outputs.
- Post/comment/like/subscription/report use cases.
- File uploads and editor textarea references.
- Markdown sanitization.
- Comment refresh behavior.
- Notification subscriptions and unread counts.
- Confirmation/report modal flows.
- Admin mutation actions.

## Known functional gaps

These gaps are recorded only and must not be silently treated as redesign work:

- No frontend route guards.
- No real admin dashboard.
- Admin reports are mostly read-only; there is no complete resolution workflow.
- Edit Profile appears incorrectly on visitor profiles, although the editor content itself is owner-conditioned.
- Video cover rendering is incomplete; detail media can be rendered through an image element.
- Post cards do not render all available media.
- No wildcard/404 route.
