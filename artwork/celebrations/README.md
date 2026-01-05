# Celebration Animations

This directory contains animated GIFs displayed when all chores are completed.

## Directory Structure

```
celebrations/
├── christmas/       # Christmas theme animations
├── halloween/       # Halloween theme animations
├── easter/          # Easter theme animations
├── fourth-of-july/  # Fourth of July theme animations
└── default/         # Default/fallback animations (any theme)
```

## Adding New Animations

1. Add your GIF file to the appropriate theme directory
2. Update `js/widgets/chore-container/utils/celebration-animations.js`
3. Add the filename to the `THEME_CELEBRATIONS` config

## Recommended GIF Specifications

- **Size**: 60x60 to 120x120 pixels (will be scaled to fit)
- **Format**: GIF with transparency preferred
- **Duration**: 1-3 seconds loop
- **File size**: Under 100KB per GIF to minimize load time

## Theme Naming Convention

Animation files should use descriptive names:
- `{character}-{action}.gif` (e.g., `santa-dance.gif`, `bunny-hop.gif`)
- Keep names lowercase with hyphens
- Avoid spaces and special characters

## Future: Database Storage

These animations can be migrated to Supabase Storage for:
- Easier updates without code deploys
- Reduced initial app bundle size
- Dynamic theme content management

The `celebration-animations.js` utility supports URLs from any source.
