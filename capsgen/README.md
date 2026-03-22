# CapsGen

A frontend-only capstone title generator built with React and Vite.

## Architecture

- `src/data`: structured domain catalog and template definitions
- `src/engine`: reusable title generation engine with seeded randomness
- `src/components`: small, reusable UI components
- `src/hooks`: local persistence helpers

## Features

- template-based title generation
- domain, technology, and output filters
- batch generation with optional deterministic seed
- editable token swapping inside generated titles
- local bookmarks, history, and filter persistence

## Scripts

- `npm run dev`
- `npm run build`
- `npm run test`
