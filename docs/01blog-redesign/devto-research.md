# DEV.to UX Research

> **DEV.to is an information architecture and UX reference only. 01Blog must have its own identity.**

The public DEV.to experience was inspected on desktop, tablet-like, and mobile viewports. Public feed, article detail, Markdown/code presentation, a real profile, comments, keyboard focus, disabled states, and a 404 page were directly observed. The authenticated editor and notification list could not be inspected directly; conclusions about those surfaces are limited to public DEV documentation.

## Content-first visual hierarchy

- Article titles carry the greatest visual weight.
- Author, date, tags, reactions, comments, and reading time are deliberately quieter.
- The interface behaves like a reading and documentation environment rather than a decorative social feed.
- Primary actions use a clear accent; secondary actions are outlined; tertiary actions are text or icon controls.
- Community navigation and context support the content without visually overpowering it.

This hierarchy suits a developer community because long-form text, code, authorship, and discussion are immediately scannable.

## Neutral surfaces and card philosophy

- The page uses a warm off-white background with white content surfaces.
- Cards rely on subtle one-pixel outlines or very low-opacity shadows.
- Corner radii are restrained, generally around 6–8 px rather than oversized.
- Color is used sparingly for actions, links, focus, and selected states.
- Cards organize information; they are not ornamental floating panels.
- Feed cards can be text-first or include optional full-width media.

## Feed structure

### Desktop

- Three-column composition: left community/navigation rail, central feed, and right contextual/community rail.
- Main feed width is approximately 640 px.
- Tabs sit directly above the stream.
- Sidebars contain navigation, popular tags, events, discussions, and other community context.

### Tablet, approximately 768–900 px

- The right sidebar disappears first.
- The left navigation rail remains while the feed uses the remaining width.
- Primary feed behavior and hierarchy remain unchanged.

### Mobile, approximately 390 px

- Both sidebars disappear from the content canvas.
- A hamburger provides access to navigation.
- Feed tabs remain directly below the header.
- Cards become full-width with reduced gutters and naturally wrapping metadata.

The important responsive principle is progressive removal: supplementary context disappears before primary content.

## PostCard anatomy

A typical preview contains:

1. Optional cover or embedded media.
2. Author or organization avatar.
3. Author name and publication time/date.
4. Large article title.
5. A small set of tags.
6. Reaction and comment metadata.
7. Reading time aligned as secondary information.

Concepts that map well to 01Blog:

- Keep the author-to-title-to-metadata order predictable.
- Make media optional and crop it consistently.
- Keep Like, comments, and time/date information secondary.
- Let titles remain the primary navigation target.
- Use the same card structure in Explore, Following, guest feeds, and profiles.
- Keep owner-only edit/delete controls out of the normal reading hierarchy.

## Article reading experience

- The desktop article surface is about 796 px wide, with an inner reading column around 668 px.
- Body text is approximately 20 px with a 30 px line height.
- Large titles, generous section spacing, and a narrow measure make long-form reading comfortable.
- Desktop social actions use a separate sticky rail rather than interrupting the article.
- Author and related-post context live in a right sidebar.
- Mobile removes the sidebars and converts article actions into a bottom toolbar.
- Covers use a wide editorial ratio; DEV recommends approximately 1000 × 420.

## Markdown and code blocks

- Paragraphs, headings, lists, tables, images, and block elements have deliberate vertical rhythm.
- Inline code uses a quiet contrasting surface.
- Code blocks use a near-black background, monospace text, syntax coloring, and horizontal scrolling.
- Images scale to the content column.
- Technical content remains readable without widening the primary text measure.

01Blog should apply a dedicated Markdown typography system rather than inheriting generic component styles.

## Profile structure

Desktop:

- Large profile summary surface over a neutral background band.
- Avatar overlaps the top edge.
- Follow and overflow actions appear prominently.
- Name, bio, joined date, link, and structured profile fields are clearly grouped.
- Badges/extended information form secondary context beside the post list.
- Pinned content is visually identified.

Mobile:

- Profile content becomes a single stream.
- Fields stack vertically.
- Secondary information collapses behind a disclosure control.
- Posts follow immediately after the summary.

For 01Blog, the visitor state should prioritize Subscribe/Unsubscribe. The owner state should replace that control with Edit Profile and must not expose visitor-only actions.

## Comment hierarchy

- Comment composer is visually separate from the thread.
- Avatars, author, date, overflow actions, message, Like, and Reply have stable positions.
- Nested replies use indentation and collapse/expand controls.
- Mobile reduces indentation rather than removing hierarchy.
- Interaction controls remain below the comment body and do not compete with the text.

This makes discussions readable because identity, message content, and actions remain distinct.

## Responsive strategy

- Preserve the central task at every breakpoint.
- Hide the right contextual rail before the left navigation rail.
- Replace the remaining navigation rail with a mobile drawer.
- Reduce padding before reducing legibility.
- Allow tags and metadata to wrap.
- Move persistent article actions from a desktop side rail to a mobile bottom bar.
- Stack profile and comment structures without changing their information order.
- Keep media fluid and code horizontally scrollable.

## Accessibility observations

Directly observed:

- Skip-to-content link.
- Strong visible keyboard focus ring.
- Semantic page and article headings.
- Accessible descriptions for icon-only controls.
- Programmatic expanded/collapsed state in comment threads.
- Clearly disabled comment Submit/Preview controls when the composer is empty.
- Descriptive labels for major actions such as Follow, Subscribe, Submit, Preview, and Reply.

A complete screen-reader, zoom, keyboard traversal, and contrast audit was not performed, so these observations are not accessibility certification.

## Patterns to borrow

- Content-first information hierarchy.
- Neutral page and card surfaces.
- Clear feed tabs.
- One reusable PostCard structure.
- Optional media with a predictable ratio.
- Narrow long-form reading measure.
- Dedicated Markdown and code styles.
- Social controls separated from the reading column.
- Readable nested comments.
- Strong profile summary with posts below.
- Progressive responsive removal of secondary context.
- Compact mobile navigation and article actions.
- Strong focus states, semantic headings, and explicit labels.
- Helpful error, loading, disabled, and empty-state patterns.

## Patterns not to copy

- DEV's logo, exact indigo color, badge art, or emoji reaction system.
- Pixel-for-pixel header, card, article, or profile layouts.
- DEV++, challenges, shop, events, organizations, and advertising structures.
- Multiple reaction types when 01Blog supports a single Like behavior.
- Reading-list, boost, series, subscription, or tag-following features without backend support.
- DEV's dense navigation inventory, which is too large for the current 01Blog scope.
- `Relevant / Latest / Top` labels when 01Blog's real feed model is Explore/Following.
- Any styling that erases 01Blog's student learning-journey identity.
