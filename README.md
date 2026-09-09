# Pip's Iceberg Office 🐧

A small interactive Angular app that shows — visually, no code required —
what changed in Signal Forms v22, told through Pip the Penguin's office
on Iceberg Island.

Each "rule" is shown as a side-by-side split screen: **Old Way** vs
**New Way**. Tap "Watch what happens" to play the little animation and see
the outcome change live.

## What's covered

1. **The Notice Board** → the `touched` breaking change (only Pip/the form
   updates shared state now; everyone else just asks).
2. **Checking on the Chicks** → `markAsTouched()` now cascades to every
   field in a group with one call.
3. **Three Booths, One Rule** → every feature now shares one consistent
   `when` condition instead of a different shape each.
4. **The Fish Counter Line** → debounce is now scoped to async checks only,
   so instant checks don't wait on the slow ones.

## Running it locally

You'll need [Node.js](https://nodejs.org) installed (v18 or newer).

```bash
npm install
npm start
```

Then open **http://localhost:4200** in your browser.

## Project structure

```
src/app/
  penguin/               → the reusable animated Pip mascot (SVG + signals)
  shared/
    scene-shell.component.ts   → the split-screen layout + nav used by every scene
  scenes/
    notice-board.component.ts        → Rule 1
    checking-chicks.component.ts     → Rule 2
    universal-ticket.component.ts    → Rule 3
    waiting-game.component.ts        → Rule 4
  app.component.ts        → intro/outro screens + scene navigation
```

Everything is built with standalone Angular components and Angular
signals — no routing library, no state management library, just
`signal()` and `@if`/`@for` control flow blocks.

## Customizing

- To add a 5th rule, copy one of the files in `src/app/scenes/`, adjust
  the story and animation, then add a case for it in
  `src/app/app.component.ts`.
- Pip's mood (`happy`, `confused`, `busy`, `proud`) is controlled per
  scene — see the `mood()` method in each scene component.
