# Typography And Text Color Inventory

## Font Family

- `Circular-Std` (with fallbacks) via `$font-family-base`

## Typography Styles Found In App

- `24 / 500 / 34px` -> `page-title`
- `20 / 500 / 1.2` -> `drawer-title`
- `16 / 500 / 1.2` -> `drawer-subtitle`
- `15 / 400 / 1.2` -> `button`
- `14 / 500 / 1.2` -> `label-md`
- `14 / 400 / 1.2` -> `body-md`
- `14 / 400 / 1` -> `body-tight`
- `13 / 500 / 1.2` -> `label-sm`
- `13 / 400 / 1.2` -> `body-sm`
- `12 / 500 / 1.2` -> `label-xs`

## Typography Tokens

- Defined in `src/styles/_typography.scss`
- Apply with:

```scss
@include typography.apply-type(label-md);
```

## Text Color Set

- `#030929` -> `$text-primary`
- `#2f3059` -> `$text-secondary`
- `#687196` -> `$text-muted`
- `#3e40db` -> `$text-link`
- `#a4aac0` -> `$text-placeholder`
- `#ffffff` -> `$text-inverse`
- `#ff0000` -> `$text-danger`

Status text colors:

- `$status-open-color`
- `$status-in-progress-color`
- `$status-complete-color`
- `$status-blocked-color`

## Text Color Tokens

- Defined in `src/styles/_colors.scss` as `$text-color-tokens`
- Optional mixin:

```scss
@include colors.apply-text-color(muted);
```

## Spacing Tokens

- Defined in `src/styles/_spacing.scss`
- Base grid unit: `4px` (`$spacing-base-unit`)
- Grid scale: `0, 4, 8, 12, 16, 20, 24`
- Explicit non-grid exceptions (kept to preserve current layout): `1, 2, 5, 10, 22, 26, 31, 45, 101`

Rule:

- Use the grid scale first.
- Use exception tokens only for intentional optical/layout offsets.
