# "See It For Real" — Demo Walkthrough

A click-by-click script for demonstrating each room's **💻 See It For Real** view —
the plain, real-website version of the same Before/After comparison as the story
view, using actual form fields instead of penguins.

How to use this: in each room, click the **💻 See It For Real** tab (next to
**🐧 The Story**) to swap into the real-form view. The **Do** lines tell you what
to click or type on each side. The **Watch for** line is the exact moment the
difference becomes visible — pause there before switching sides.

A good habit for all ten: do the Before action, name out loud what's wrong or
missing, then do the *identical* action on the After side so the contrast lands
while it's fresh.

---

## Chapter 1 — The Iceberg Notice Board → Display name

**Before — Do:** Without typing anything, click "(simulate another part of the
page touching this field)".
**Watch for:** "Name is required" appears — even though you never touched the
input yourself.

**After — Do:** Type something, delete it, then click outside the input.
**Watch for:** the error only appears now, once you've actually left the field.
There's no other button that can trigger it anymore.

---

## Chapter 2 — Checking on the Chicks → Shipping address form

**Before — Do:** Leave Street, City, and ZIP all empty. Click Submit.
**Watch for:** only Street turns red with "Street is required." City and ZIP stay
clean, even though they're just as empty.

**After — Do:** Same thing — leave all three empty, click Submit.
**Watch for:** all three turn red at once.

---

## Chapter 3 — Four Booths, One Rule → Checkout form

**Before — Do:** Check "Same as shipping" (the address field vanishes instantly,
no animation). Check "Subscribe to newsletter" (the frequency dropdown pops in
about 400ms late, with a visible pause). Type anything into Promo code (the
"Applied ✓" badge springs in with a bouncy wobble).
**Watch for:** three fields, three different-feeling transitions.

**After — Do:** Do the same three things.
**Watch for:** every one of them fades and slides in with the exact same smooth
timing.

**Note:** this is the subtlest room — the point isn't any single field, it's that
Before feels like three different pieces of software and After feels like one.

---

## Chapter 4 — The Bouncer Booth → Appointment date

**Before — Do:** Pick a date several years in the future.
**Watch for:** it's accepted with no complaint.

**After — Do:** Pick that exact same far-future date.
**Watch for:** "Please pick a date within the next 90 days."

---

## Chapter 5 — The Guestbook Podium → Phone number

**Before — Do:** Type a full phone number quickly, then click away immediately —
don't pause while typing.
**Watch for:** it stays as raw digits, never reformats.

**After — Do:** Do the exact same thing — type quickly, click away immediately.
**Watch for:** it reformats to `(555) 123-4567` the instant you leave the field.

---

## Chapter 6 — The Fish Counter Line → Choose a username

**Before — Do:** Type 1–2 characters (too short) and wait.
**Watch for:** it takes about half a second before "At least 3 characters"
shows up.

**After — Do:** Type 1–2 characters.
**Watch for:** "At least 3 characters" appears the instant you type — no wait.
(Type 3+ characters and pause, and only then does "checking availability…"
show up for a moment.)

---

## Chapter 7 — The Seat Re-Check Booth → Ticket quantity

**Before — Do:** Click "(simulate another buyer)" a few times.
**Watch for:** the "seats left" label never budges, no matter how many times
you click it.

**After — Do:** Click "(simulate another buyer)" a few times (label still
stuck — nothing auto-updates), then click "Refresh availability."
**Watch for:** the number jumps down to match reality only after you click
Refresh.

---

## Chapter 8 — The Nurse's Station → Create password

**Before — Do:** Type a password missing just one thing, e.g. `password1`
(has a number, no symbol).
**Watch for:** a whole block listing all three rules — even the ones you
already satisfied.

**After — Do:** Type that exact same password.
**Watch for:** only "Must contain a symbol" shows up — the one rule you
actually failed.

---

## Chapter 9 — The Translator Booth → Tax ID (legacy field)

**Before — Do:** Type an invalid tax ID — anything that isn't exactly 9
digits, like `abc`.
**Watch for:** nothing happens anywhere on the panel. No red text, no summary.

**After — Do:** Type that exact same invalid value into the same-looking
field.
**Watch for:** a summary box appears above the Submit button: "Please fix:
Tax ID must be exactly 9 digits" — the field itself hasn't changed at all.

---

## Chapter 10 — The Universal Adapter Desk → Star ratings

**Before — Do:** Look at the three rating controls.
**Watch for:** they look completely different — stars for Service, a
dropdown for Food, radio buttons for Venue.

**After — Do:** Rate all three, then click Reset.
**Watch for:** all three are the exact same clickable star widget, and one
click clears all three at once.
