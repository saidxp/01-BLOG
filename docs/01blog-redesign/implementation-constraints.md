# Implementation Constraints

These rules govern the later Codex implementation of the approved Figma design. They exist to prevent a visual redesign from breaking established Angular behavior.

## Existing contracts that must be preserved

- Routes and route hierarchy.
- Route parameters, including post IDs and profile usernames.
- Angular `@if` and `@for` control flow.
- Reactive forms.
- Existing `formControlName` bindings.
- Submit handlers and their validation behavior.
- Loading, error, empty, disabled, and success state behavior.
- Owner checks for editing and destructive actions.
- Role checks for administrative actions and visibility.
- Component inputs and outputs.
- File selection and upload handlers.
- The `#contentTextarea` template reference.
- Markdown rendering and sanitization pipeline.
- Comment update/refresh behavior after submission or mutation.
- Like state and count behavior.
- Notification collection/state behavior.
- WebSocket delivery and unread-count behavior.
- Report modal opening, submission, cancellation, and completion flow.
- Admin mutation handlers for users and posts.

## Implementation target

- Use Bootstrap for responsive and layout primitives where it adds value: containers, grids, spacing utilities, responsive visibility, forms, and selected interaction primitives.
- Use custom CSS for 01Blog's visual identity: typography, tokens, card surfaces, media treatment, Markdown presentation, profile styling, navigation character, admin polish, and responsive refinements.
- Keep the implementation compatible with the existing Angular standalone architecture.
- Prefer reusable component classes and design tokens over repeated screen-local rules.

## Prohibited implementation shortcuts

- Do not edit Bootstrap source files.
- Do not replace real Angular behavior with static mockup HTML.
- Do not remove, rename, or bypass bindings simply to match a Figma screenshot.
- Do not invent unsupported product features.
- Do not add DEV.to-specific features that have no 01Blog use case or backend support.
- Do not silently combine functional bug fixes with styling work; known gaps require explicit scope and testing.
- Do not hard-code authentication, owner, role, notification, Like, comment, or report state.
- Do not duplicate whole components solely to create responsive variants when CSS/layout composition can preserve a shared behavior contract.

## Integration approach

For each approved screen:

1. Map the Figma frame to the existing route and component tree.
2. Identify every current input, output, form binding, conditional, and handler before editing markup.
3. Apply Bootstrap structure only where it does not obscure Angular behavior.
4. Apply the custom visual system through shared tokens and component styles.
5. Test guest, authenticated, owner, visitor, and admin states that apply to the screen.
6. Test desktop, tablet, and mobile behavior.
7. Verify that API, upload, Markdown, comments, Like, subscription, notification, report, and admin flows remain functional.

The visual result must follow the approved design, but functional compatibility takes precedence over static screenshot similarity.
