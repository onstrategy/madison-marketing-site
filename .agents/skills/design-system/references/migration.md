# Migration Guide: shadcn-style → packages/ui Tokens

This reference maps the legacy inline CSS variables common in shadcn-based codebases to the canonical `packages/ui` token system. Use it when adopting the kit in an existing client repo, or when reviewing code that still uses the old naming.

## Mapping Table

### Backgrounds

| shadcn (legacy) | packages/ui | Notes |
|-----------------|-------------|-------|
| `bg-background` | `bg-app` | Page canvas |
| `bg-card` | `bg-surface` | Cards, panels |
| `bg-popover` | `bg-surface` | Popovers share the surface layer |
| `bg-muted` | `bg-hover` | Hover / muted backgrounds |
| `bg-accent` | `bg-hover` | Accent backgrounds map to hover state |
| `bg-sidebar` | `bg-panel` | Sidebar backgrounds |

### Typography

| shadcn (legacy) | packages/ui | Notes |
|-----------------|-------------|-------|
| `text-foreground` | `text-primary` | Main body text |
| `text-card-foreground` | `text-primary` | Text on cards |
| `text-popover-foreground` | `text-primary` | Text in popovers |
| `text-muted-foreground` | `text-muted` | Muted/disabled text |
| `text-accent-foreground` | `text-primary` | Accent text → primary |
| `text-sidebar-foreground` | `text-primary` | Sidebar text |

### Borders

| shadcn (legacy) | packages/ui | Notes |
|-----------------|-------------|-------|
| `border-border` | `border-default` | Standard borders |
| `border-input` | `border-default` | Input borders |
| `border-subtle` | `border-default` | Subtle → default |
| `border-emphasis` | `border-active` | Emphasis → active |
| `border-sidebar-border` | `border-default` | Sidebar borders |

### Brand / Primary

| shadcn (legacy) | packages/ui | Notes |
|-----------------|-------------|-------|
| `bg-primary` | `bg-brand` | Primary CTA background |
| `text-primary-foreground` | `text-brand-fg` | Text on primary buttons |
| `bg-secondary` | `bg-brand-subtle` | Secondary/ghost buttons |
| `text-secondary-foreground` | `text-brand` | Text on secondary buttons |
| `ring-ring` | `ring-brand` | Focus ring color |
| `bg-sidebar-primary` | `bg-brand` | Sidebar primary actions |
| `bg-sidebar-accent` | `bg-hover` | Sidebar hover state |

### Semantic Colors

| shadcn (legacy) | packages/ui | Notes |
|-----------------|-------------|-------|
| `bg-destructive` | `bg-error` | Error/destructive backgrounds |
| `text-destructive` | `text-error` | Error text |
| `text-destructive-foreground` | `text-error-fg` | Text on error backgrounds |
| `bg-success` | `bg-success` | Same name (already aligned) |
| `text-success-foreground` | `text-success-fg` | Shortened to `-fg` |
| `bg-warning` | `bg-warning` | Same name |
| `text-warning-foreground` | `text-warning-fg` | Shortened to `-fg` |

### Numbered Scales (BANNED)

Legacy code often uses numbered color scales (`text-success-700`, `bg-neutral-200`, `text-destructive-500`). These are **forbidden** in `packages/ui` because they bypass the contrast guarantees baked into the token system.

**Replace with:**

- Semantic triads: `bg-success`, `bg-success-subtle`, `text-success-fg`
- Opacity modifiers for fine-tuning: `bg-success/10`, `text-error/80`, `border-warning/50`

The opacity approach works because tokens store raw HSL channels. This gives continuous control without breaking the token system.

| Legacy example | Replacement |
|----------------|-------------|
| `text-success-700 dark:text-success-400` | `text-success` (dark mode automatic) |
| `bg-destructive-100` | `bg-error-subtle` or `bg-error/10` |
| `bg-neutral-200` | `bg-hover` or `bg-surface` |
| `text-neutral-500` | `text-muted` |

## Living Spec

The visual reference for all tokens in use is `packages/ui/src/ui/style-guide.tsx` — it demonstrates elevation nesting, typography hierarchy, brand buttons, and all four semantic triads. Check this file to verify how tokens look in practice.

If a component needs a token that doesn't exist in the mapping above, **do not invent ad-hoc values**. Instead:

1. Check `packages/ui/src/ui/tokens.tsx` to see if the token exists under a different name
2. If truly missing, propose extending `tokens.tsx` and updating the style guide — this keeps the system coherent
