# 01Blog Redesign Mission

This folder is the source of truth for the 01Blog frontend redesign mission. It preserves the findings, decisions, constraints, and progress needed to redesign the existing application without losing working behavior.

## Mission

- The existing 01Blog application is already implemented.
- The mission is to redesign and style the frontend only, not rebuild the product.
- The target implementation is Angular with Bootstrap and custom CSS.
- DEV.to is a UX and information-architecture reference, not something to clone.
- Figma will define the visual system, reusable components, responsive states, and screens.
- Codex will later merge the approved Figma design into the existing Angular frontend.
- Existing functionality must remain working throughout the redesign.

## Workflow

`Subject → Frontend Audit → DEV.to Research → Figma → Design Review → Codex Implementation → Testing`

## Documents

- `frontend-audit.md` records the current frontend architecture, screens, behavior, styling, responsive limitations, and known gaps.
- `devto-research.md` records the UI/UX patterns observed on DEV.to and the borrow-versus-avoid guidance.
- `design-direction.md` defines the intended 01Blog identity and design principles.
- `implementation-constraints.md` lists the Angular behavior and integration contracts that later implementation must preserve.
- `mission-log.md` tracks completed, current, and planned phases.

If a later design or implementation decision conflicts with this documentation, the conflict must be reviewed explicitly rather than silently changing the mission.
