# Pip's Iceberg Office — Flow Rundown

A room-by-room breakdown of how the app currently works, for planning flow changes.

> Updated after implementing `FLOW-FIX-SPEC.md` (Fixes 1–5). Fix 6 — gating
> "Next room →" behind interaction — was proposed but declined; navigation
> stays freely browsable.

## App-level structure

- **`app.component.ts`** owns navigation state: `screen = signal<'intro' | 1..10 | 'outro'>('intro')`.
- Going between screens calls `go(target)`, which fades the current screen out (150ms), swaps `screen()`, scrolls to top, then fades in.
- **Intro screen**: cover title/description + "Start the tour →" (goes to stop 1) and "Jump to recap" (goes straight to outro). Shows an illustrated iceberg horizon with Pip standing on it, plus a static code snippet (not interactive).
- **10 stops (rooms)**: each is its own component, rendered via `@switch` on `screen()`. Each room emits `next` / `prev` / `jump(stopNumber)` back up to `AppComponent`, which just calls `go()`.
- **Outro screen**: recap grid grouped by "wing" (4 categories). **Generated, not hand-maintained** — each room exports its own `RECAP_LINE` const next to its title/code, and `app.component.ts` builds the grid from `HALLWAY_STOPS` (wing per stop, from `room-shell.component.ts`) + those 10 exports via `buildRecap()`. Editing a room's concept and its recap line now happens in the same file, so they can't drift apart. Has "Walk it again ↺" → back to intro.
- Progress rail (top of every room, in `room-shell.component.ts`) lists all 10 stops with wing groupings and is **clickable** — users can jump to any stop directly, not just linearly.

## Shared room template (`room-shell.component.ts`)

Every room is visually identical in structure — only the content inside changes:

1. **Rail** — 10-step nav, current step highlighted, completed steps marked `done`.
2. **Meta line** — "Wing X · {Wing Name} — Stop N of 10".
3. **Title + subtitle** — the room's narrative framing of the concept.
4. **Compare grid** (3 columns): **Before panel** | **After panel** | **Code rail** (Before code block stacked over After code block). Each `.panel` is `position: relative` with extra bottom padding reserved for a reset control.
5. **Control row** — step counter, "← Back", "Next room →" (label becomes "Finish" on stop 10, always enabled).

Each room passes `oldCode`/`newCode` (static strings shown verbatim) and a `solved` boolean that just adds a highlight glow to the "After" code block once the user has interacted with the After panel (tracked via each room's own `engaged` signal — **cosmetic only, doesn't gate navigation**).

### Standard interaction contract (every panel, every room)

Implemented via a shared `src/app/shared/reset-button.component.ts` (`<app-reset-button>`), positioned bottom-right of every panel identically:

1. User clicks the panel's action control.
2. The result renders (state change, animation — room-specific).
3. The action control becomes a **no-op** (usually visually `disabled`) — clicking it again while a result is showing does nothing.
4. A single **"↺ Reset"** button, bottom-right of the panel, goes from disabled to enabled.
5. Clicking Reset returns that panel to its initial state (action control re-enables, Reset re-disables).

No room has a `setTimeout`-based auto-clear anymore. Nothing in the app gates or validates progression — "Next room →" is always enabled regardless of whether the user has interacted with anything.

---

## Wing A — Front Office

### Stop 1 — "The Iceberg Notice Board" (`notice-board.component.ts`)
**Teaches:** `output<void>()` (ask-only) replacing `model()` (read+write) for a "touch" signal.

- **Before panel:** A board reading "Today's Plan" + 3 clickable penguin buttons. First click on any penguin messes the board (scribbles appear, text strikes through, mood → busy); further clicks are a no-op until **Reset** is clicked.
- **After panel:** 3 penguin buttons. First click sets "Request sent — only Pip can edit" (board turns calm/accent-colored, mood → happy); further clicks are a no-op until **Reset** is clicked. (Previously auto-cleared after 1.2s — that timeout is gone.)

### Stop 2 — "Checking on the Chicks" (`checking-chicks.component.ts`)
**Teaches:** `markAsTouched()` cascading to descendants automatically (vs. manually touching each nested control).

- **Before panel:** 4 chick buttons (🐣) in a 2×2 grid, tapped individually (✔ appears, taps counter increments "X / 4 taps"). Once all 4 are checked, further taps are a no-op; **Reset** clears all 4 and the counter.
- **After panel:** One button wrapping all 4 chicks. First click checks all 4 at once ("1 tap — done", mood → proud); further clicks are a no-op until **Reset**.

---

## Wing B — Rules & Conditions

### Stop 3 — "Four Booths, One Rule" (`universal-ticket.component.ts`)
**Teaches:** the `{ when: () => ... }` condition option unifying `disabled`, `required`, `hidden`, `readonly`.

- **Before panel:** 4 booths (Shipping/●, Newsletter/■, Promo Code/★, Account/◆), each revealed individually by clicking its `?` button (count shown "X / 4 shapes learned"). Once all 4 are revealed, further clicks are a no-op; **Reset** clears all 4 back to `?`.
- **After panel:** All 4 booths look identical. First click on any one reveals `★` on **all 4** simultaneously ("1 click — all 4 done", mood → proud); further clicks are a no-op until **Reset**.

### Stop 4 — "The Bouncer Booth" (`bouncer-booth.component.ts`)
**Teaches:** `minDate()`/`maxDate()` built-ins vs. a hand-rolled validator that only checks one bound.

- **3 test cases**, each with a real `Date` value: "Jun 2025" (2025-06-01), "Jun 2026" (2026-06-01), "Jan 2099" (2099-01-01).
- **Verdicts are computed, not hardcoded** — both panels compare each case's date against the same `MIN_DATE`/`MAX_DATE` constants shown in the printed code (`2026-01-01` / `2026-12-31`), so editing a case's date or label can never silently contradict the code sample next to it.
- **Before panel:** clicking a date tests it against `MIN_DATE` only (no upper bound — reproduces the bug faithfully). Each case can be tested once; **Reset** clears all 3 verdicts.
- **After panel:** clicking a date tests it against both `MIN_DATE` and `MAX_DATE`. Same one-shot-per-case + **Reset** pattern. With all 3 tested, exactly 1/3 should read "okay."

---

## Wing C — Waiting Room

### Stop 5 — "The Doorbell" (`doorbell.component.ts`)
**Teaches:** `debounce(field, ms, 'blur')` — waiting for blur, not just keystroke pauses.

- **Before panel:** "Press" rings the bell after a 400ms delay (mood → busy while pending, happy once rung); "Walk away" is permanently disabled (tooltip: "Not a wait mode in the old version"). **Reset** clears the ring.
- **After panel — now genuinely differentiated (Fix 2):**
  - **"Press"** → mood goes `busy` (wing-flap) during the 400ms delay, status reads "pressing…".
  - **"Walk away"** → mood goes `walking` (waddle + footstep animation) during the 400ms delay, status reads "walking away…".
  - Both converge on `proud` + "rang" once the delay completes. Both buttons disable once pending/rung; **Reset** re-enables them.
  - The point: a user watching can now tell *which* trigger fired from the penguin's animation and status text alone, not just that both happened to work.

### Stop 6 — "The Fish Counter Line" (`waiting-game.component.ts`)
**Teaches:** `debounce` scoped to only the async check, not instant sync checks too.

- **Two questions:** "Is your name spelled right?" (instant/sync) and "Is there a fish left?" (900ms async).
- **Before panel:** "Ask both" (disables once clicked) forces both questions to show "waiting…" and resolve together after 900ms. **Reset** (separate button, bottom-right) clears back to idle.
- **After panel:** "Ask both" (disables once clicked) resolves the name question **instantly**; the fish question shows "checking…" and resolves independently after 900ms. **Reset** clears back to idle.
- Note: this room already had a dedicated action+reset split conceptually before the spec; it's now visually consistent with every other room via the shared `<app-reset-button>` instead of a single button that relabeled itself.

### Stop 7 — "The Seat Re-Check Booth" (`seat-recheck-booth.component.ts`)
**Teaches:** `reloadValidation()` forcing a fresh check on demand (vs. Reactive Forms' `updateValueAndValidity()`, which Signal Forms had no equivalent for).

- **Both panels now show two persistent, always-visible labels (Fix 3):** `Reality: {Available | Taken}` and `Form says: {Available | Taken}`, so the mismatch between them is something the user can literally read, not infer from a stat color.
- **Before panel:** "Someone books it" sets Reality → Taken (one-shot, then disabled); "Form says" is hardcoded to always read "Available" (nothing rechecks it — Recheck stays permanently disabled). **Reset** clears the booking.
- **After panel:** "Someone books it" sets Reality → Taken (one-shot, then disabled). "Form says" only updates when **Recheck** is clicked (which is disabled until there's an unsynced booking, and pulses while pending). **Reset** clears both Reality and Form-says back to Available.

---

## Wing D — Back Office

### Stop 8 — "The Nurse's Station" (`nurse-station.component.ts`)
**Teaches:** `getError(field, 'kind')` direct lookup vs. manually scanning an errors array.

- **4 symptoms/error kinds:** `tooShort`, `required`, `missingNumber`, `noSpecialChar`.
- **Before panel:** "Scan chart" animates through all 4 items one at a time (280ms interval each, the room's core mechanic — unchanged), highlighting `required` once reached. Once fully scanned, the button disables; **Reset** clears the scan back to step 0.
- **After panel:** "Ask directly" instantly highlights `required` (one-shot, then disabled). **Reset** clears it.

### Stop 9 — "The Translator Booth" (`translator-booth.component.ts`)
**Teaches:** legacy `Validator`/CVA-style validators now being picked up automatically by Signal Forms (no code changes needed on the legacy component).

- **Before panel:** "Send report" (one-shot, then disabled) → paper arcs and drops with "lost" after 600ms. **Reset** clears it.
- **After panel:** "Send report" (one-shot, then disabled) → a translator penguin carries the paper across (600ms) → "delivered ✓". **Reset** clears it.

### Stop 10 — "The Universal Adapter Desk" (`adapter-desk.component.ts`)
**Teaches:** one component (`app-custom-input`) now supporting Reactive Forms / template-driven `ngModel` / Signal Forms all at once, plus a universal `reset(f)`.

- **3 sockets:** Reactive (▲), Template (●), Signal (◆).
- **Before panel:** click each socket individually to light it (count "X / 3 plugged in"). Once all 3 lit, further clicks are a no-op; **Reset** clears all 3.
- **After panel:** the "🔌" adapter button lights all 3 sockets at once (one-shot, then disabled, "settle" animation). The old bespoke "RESET" lever has been **restyled into the same shared `<app-reset-button>`** used everywhere else (Fix 1's explicit exception — it was already a dedicated reset control, just visually unique before).

---

## What Fixes 1–5 changed (for reference — see `FLOW-FIX-SPEC.md` for the original ask)

- **Fix 1:** every room's Before/After panels now follow the identical click → result → Reset contract described above, via a shared `<app-reset-button>` component. No more auto-timeouts, no more "click again once complete to reset," no more per-room bespoke reset styling.
- **Fix 2:** Doorbell's After panel "Walk away" is now animation- and copy-distinct from "Press."
- **Fix 3:** Seat Re-Check Booth shows `Reality:`/`Form says:` simultaneously in both panels.
- **Fix 4:** Bouncer Booth verdicts are computed from real dates against shared `MIN_DATE`/`MAX_DATE` constants instead of being hardcoded per case.
- **Fix 5:** the outro recap is generated from each room's own `RECAP_LINE` export instead of a separately hand-maintained constant.
- **Fix 6** (gate "Next room →" behind interaction) was proposed but **declined** — navigation remains fully free in both directions.

## Quick reference table

| # | Room | File | Concept | Reset scope (both panels) |
|---|------|------|---------|---------------------------|
| 1 | Iceberg Notice Board | `notice-board.component.ts` | `output()` vs `model()` | clears messy/asked state |
| 2 | Checking on the Chicks | `checking-chicks.component.ts` | `markAsTouched()` cascade | clears all 4 chicks + tap count |
| 3 | Four Booths, One Rule | `universal-ticket.component.ts` | `{ when }` condition | clears all 4 booth reveals |
| 4 | The Bouncer Booth | `bouncer-booth.component.ts` | `minDate()`/`maxDate()` (computed verdicts) | clears all 3 test results |
| 5 | The Doorbell | `doorbell.component.ts` | `debounce(..., 'blur')` (Press vs Walk away now visually distinct) | clears ring + pending state |
| 6 | The Fish Counter Line | `waiting-game.component.ts` | scoped `debounce` on async only | clears both question states |
| 7 | The Seat Re-Check Booth | `seat-recheck-booth.component.ts` | `reloadValidation()` (Reality/Form-says labels) | clears booking + sync state |
| 8 | The Nurse's Station | `nurse-station.component.ts` | `getError(field, kind)` | clears scan/found state |
| 9 | The Translator Booth | `translator-booth.component.ts` | legacy CVA validators auto-picked-up | clears send state |
| 10 | Universal Adapter Desk | `adapter-desk.component.ts` | one component, 3 form APIs + `reset(f)` | clears socket lights |

Let me know what you want changed next.
