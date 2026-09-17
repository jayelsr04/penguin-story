# Pip's Iceberg Office — Complete Presentation & Demo Script

Run each chapter in two halves: the **🐧 Minigame** (the metaphor, narrated),
then flip the tab to **💻 See It For Real** and repeat the same beat on an
actual form field. Ten chapters, same two-part rhythm every time.

**Open — Say:** "Every room in Pip's office had a small, everyday annoyance.
You'll see how it used to work, how it works now, and then what that exact same
fix looks like on a real website form." **Show:** Click "Start the tour."

---

## Chapter 1 — Notice Board
A notice board tells everyone what's happening today.

### 🐧 Minigame
**Say:** "Before, any penguin walking by can scribble on the board directly —
even though they're not in charge of it. After, they can only send a request;
only Pip can actually make the edit. It's safer when one owner controls the
real change."
**Show:** Click a penguin in Before (board gets messed up) → Reset → click a
penguin in After (sends a request instead).

### 💻 See It For Real
**Say:** "Here it's a 'Display name' field. Before, some other part of the page
can reach in and flip it to 'touched' directly, so an error can pop up for no
reason the user caused. After, the only way to touch it is to actually leave
the field."
**Show:** Before — click "(simulate another part of the page touching this
field)" without typing anything → error appears with no real cause. After —
type, clear it, click away → error only shows now.

---

## Chapter 2 — Checking on the Chicks
Pip has four baby chicks to check off as "seen today."

### 🐧 Minigame
**Say:** "Before, he taps each chick one at a time — four separate taps. After,
one tap checks the whole nest at once. If you're checking off a group, it
should take one action, not one per item."
**Show:** Tap each chick individually in Before, count 4 taps. Tap the nest
once in After.

### 💻 See It For Real
**Say:** "This is a shipping address form with Street, City, and ZIP. Before,
submitting only actually validates the first field — the other two silently
skip. After, submitting checks all three at once."
**Show:** Before — leave all 3 fields empty, click Submit → only Street turns
red. After — same empty fields, Submit → all 3 turn red together.

---

## Chapter 3 — Four Booths, One Rule
Four booths — Shipping, Newsletter, Promo Code, Account — each used to have
its own weird rule for when it turns on.

### 🐧 Minigame
**Say:** "Before, you learn each booth's rule separately — they all behave
differently. After, all four follow the exact same shape, so learning one
means you understand all four."
**Show:** Reveal each booth one at a time in Before. Click any one booth in
After → all four reveal together.

### 💻 See It For Real
**Say:** "Same idea on a checkout form: a 'Same as shipping' checkbox, a
newsletter checkbox, and a promo code field. Before, each one animates on its
own clock — one snaps instantly, one lags behind, one bounces. After, all
three use the exact same transition, so they feel like one consistent system."
**Show:** Before — toggle all 3 controls, notice each moves differently. After
— same 3 controls, all animate identically.

---

## Chapter 4 — The Bouncer Booth
Pip's bouncer checks birthdates at the rope.

### 🐧 Minigame
**Say:** "Before, he only checks if a date is too early — a ticket dated 2099
sails right through. After, he checks both ends: too early *and* too far in
the future. A real check needs both boundaries."
**Show:** Test all 3 dates in Before — 2099 wrongly gets in. Same 3 dates in
After — 2099 correctly rejected.

### 💻 See It For Real
**Say:** "Here it's a real appointment date picker. Before, picking a date
years from now is silently accepted. After, the same far-future date gets
rejected with a clear reason."
**Show:** Before — pick a date years out → accepted, no complaint. After —
pick that exact same date → "Please pick a date within the next 90 days."

---

## Chapter 5 — The Guestbook Podium
A guestbook checks your name once you're done writing it.

### 🐧 Minigame
**Say:** "Before, it assumes you're done the moment you pause your pen, even
mid-thought. After, it waits until you actually step back from the podium.
Sometimes it's better to wait for someone to really be finished, not just
guess from a pause."
**Show:** Type + pause in Before → checks right away. Same in After → nothing
happens until you actually click away.

### 💻 See It For Real
**Say:** "This is a phone number field. Before, it only reformats if you keep
typing without pausing — click away fast and it stays raw. After, leaving the
field always triggers the reformat, no matter how you got there."
**Show:** Before — type quickly, click away immediately → stays unformatted.
After — same fast click-away → formats instantly to `(555) 123-4567`.

---

## Chapter 6 — The Fish Counter Line
Two questions get asked: one instant ("Is your name spelled right?"), one that
genuinely takes a moment ("Is there a fish left?").

### 🐧 Minigame
**Say:** "Before, both questions wait the same amount of time to answer — even
the instant one. After, the instant question answers immediately, and only
the genuinely slow one makes you wait. Don't make people wait for an answer
that's already known."
**Show:** "Ask both" in Before — both sit and wait together. Same in After —
spelling answers instantly, fish question keeps checking.

### 💻 See It For Real
**Say:** "Same split on a username field: a length check that should be
instant, and an availability check that genuinely needs a moment. Before, both
are stuck behind the same half-second delay. After, the length check is
instant and only availability waits."
**Show:** Before — type a too-short name → half-second delay before the
warning. After — same short name → warning appears instantly.

---

## Chapter 7 — The Seat Re-Check Booth
A seat is already taken in reality, but the seating chart doesn't know it yet.

### 🐧 Minigame
**Say:** "Before, trying the seat looks fine and the chart never corrects
itself — there's no way to learn the truth. After, there's a refresh button:
press it, and the chart re-checks and catches up to reality."
**Show:** Click the seat in Before — looks fine, chart never updates. Same in
After, then press refresh → chart corrects to "Taken."

### 💻 See It For Real
**Say:** "Here it's a concert ticket quantity selector with a 'seats left'
label. Before, simulating another buyer never moves that number. After, the
same simulated buyers happen, but a 'Refresh availability' button lets you
pull the real count on demand."
**Show:** Before — click "(simulate another buyer)" repeatedly → label never
changes. After — same clicks, then "Refresh availability" → number updates.

---

## Chapter 8 — The Nurse's Station
A patient's chart lists several possible problems.

### 🐧 Minigame
**Say:** "Before, to find one specific problem, she reads the entire list in
order until she happens to reach it. After, she asks for that one thing
directly and gets the answer immediately. If you know what you're looking for,
you shouldn't have to search everything else first."
**Show:** "Scan chart" in Before — checks every item in order. "Ask directly"
in After — jumps straight to the answer.

### 💻 See It For Real
**Say:** "This is a Create Password field. Before, one mistake shows every
rule in the book, even the ones you already got right. After, it shows only
the one rule you actually failed."
**Show:** Before — type a password missing one rule → dumps all 3 rules.
After — same password → shows only the 1 rule that failed.

---

## Chapter 9 — The Translator Booth
An old-fashioned clerk and a newer office speak different "stamp languages."

### 🐧 Minigame
**Say:** "Before, paperwork stamped the old way gets thrown away and ignored.
After, a translator penguin automatically carries it across and makes sure
it's understood — without the old clerk changing anything about how he works."
**Show:** "Send report" in Before — paper dropped and lost. Same in After —
translator carries it across successfully.

### 💻 See It For Real
**Say:** "Here it's a legacy tax-ID field, styled to look old on purpose.
Before, typing something invalid produces no error anywhere on the page.
After, that exact same unchanged field now correctly shows its error in the
form's main summary."
**Show:** Before — type an invalid tax ID → no error shown anywhere. After —
same invalid value → error appears in the summary above Submit.

---

## Chapter 10 — The Universal Adapter Desk
Three plug sockets on Pip's desk each used to need their own device.

### 🐧 Minigame
**Say:** "Before, you need three separate plugs, one per socket. After, one
universal adapter fits all three at once — plug in once, everything lights up
together. One flexible tool beats juggling three."
**Show:** Plug each socket individually in Before. Plug the one adapter in
After — all three light up together.

### 💻 See It For Real
**Say:** "Same idea with a star-rating widget used in three mini-forms.
Before, each form needed a visibly different control — stars, a dropdown,
radio buttons. After, it's the same star widget dropped in three times, and
one Reset clears all three together."
**Show:** Before — notice the 3 rating widgets all look different. After —
same widget used 3 times; Reset clears all at once.

---

**Close — Say:** "Ten small annoyances, each made simpler, faster, more
consistent, or more trustworthy — and every one of them holds up the same way
on a real form, not just in the metaphor." **Show:** Jump to the recap page to
see all ten changes listed together.
