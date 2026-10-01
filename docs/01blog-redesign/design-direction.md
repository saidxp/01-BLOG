# Design Direction

## Product identity

**Premium student/developer blogging community**

01Blog should feel like a credible place for students and developers to document learning, publish technical work, follow peers, and discuss ideas. It should feel considered and editorial without becoming formal, corporate, or visually sterile.

## Keywords

- Editorial.
- Premium.
- Calm.
- Modern.
- Readable.
- Developer-friendly.
- Community-oriented.

## Avoid

- Generic Bootstrap look.
- SaaS dashboard look.
- Social-media clone.
- Excessive gradients.
- Glassmorphism.
- Neon styling.
- Giant radii.
- Decorative overload.
- Pixel-for-pixel DEV.to cloning.

## Design principles

### Content first

Navigation and controls support posts, profiles, and discussions rather than competing with them.

### Article titles carry visual weight

Titles should be the first scannable element in feeds and the dominant element on article pages.

### Quiet metadata

Author details, time, tags, Like counts, comment counts, and status information should remain legible but subordinate.

### Reusable PostCard

Explore, Following, guest, and profile feeds should use a shared component system with controlled variants for media and owner actions.

### Narrow Markdown reading measure

Long-form content should have a constrained line length, generous line height, strong heading rhythm, responsive media, and purpose-built code styles.

### Subtle borders and shadows

Use crisp low-contrast borders and restrained elevation. Surfaces should feel structured, not float excessively.

### Single accent color

Use one primary accent for selected navigation, primary actions, links, and focus. Error, warning, and success colors remain semantic.

### Systematic spacing

Base layouts and components on a documented spacing scale so pages feel related even when their content differs.

### Mobile-first responsive behavior

Components must be designed for narrow screens intentionally, not merely compressed from desktop.

### Secondary context disappears before primary content

Sidebars, extended profile data, and secondary actions collapse or move before feeds, article text, forms, or discussions lose usability.

### Consistent icon family

Use one clear icon system for navigation and actions. Emoji may remain in user content or rare community moments, not as the default control language.

### Accessible focus and interaction states

Every interactive component needs visible hover, focus, active, disabled, loading, and destructive states where applicable.

## Viewport references

Figma should define responsive behavior around these approximate reference widths:

- Desktop: approximately 1440 px.
- Tablet: approximately 768–900 px.
- Mobile: approximately 390 px.

These are design references rather than hard-coded device assumptions. Components must remain fluid between breakpoints.
