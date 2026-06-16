# Pfluger Design System — Tailwind handoff

Two files = the whole theme. For a **Tailwind v3** project.

- `pfluger-theme.css` — the CSS variables (`:root` tokens), the semantic text classes, and `.btn-cta`.
- `tailwind.theme.js` — the Tailwind config `extend` block that registers the color + font tokens.

## Setup (paste this to your agent)

> Set up this project with Tailwind and use the attached Pfluger theme for all styling.
> 1. Merge the `extend` object from `tailwind.theme.js` into `tailwind.config.js` under `theme.extend`.
> 2. Copy the `:root` and `@layer` blocks from `pfluger-theme.css` into the global Tailwind stylesheet (the one with `@tailwind base/components/utilities`).
> 3. Use the semantic text classes for ALL text — never inline `text-{size} font-{weight} text-{color}` combos:
>    - Headings: `text-hero` `text-h1` `text-h2` `text-h3` `text-title` `text-h4`
>    - Body (14px): `text-body` `text-body-muted` `text-body-subtle`
>    - Small (12px): `text-caption` `text-meta` `text-label` `text-badge`
>    - Stats: `text-stat` `text-stat-lg`; code/IDs: `text-code`; links: `text-link`
> 4. Use theme tokens for color — `bg-background` `bg-card` `bg-secondary`, `border-border`, `text-foreground` `text-muted-foreground` `text-foreground-subtle`, brand `bg-accent`/`text-accent` (sky blue), and state `text-success` `text-warning` `text-info` `text-neutral` `text-destructive` (with `/10` `/20` opacity as needed). No hardcoded `bg-gray-*` or hex.
> 5. Primary buttons use `.btn-cta` plus their own size/radius utilities.

## Gotcha
A token must exist BOTH as a CSS var (in `pfluger-theme.css`) AND as a registered color (in `tailwind.theme.js`). A var without a registered color = the `text-x`/`bg-x` class silently does nothing and the build still passes.
