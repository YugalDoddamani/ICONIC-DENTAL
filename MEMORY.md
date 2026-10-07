# MEMORY.md
### Working memory for ICONIC Dental & Aesthetics — agent handoff

**Read this first in a new session.** It holds what is *not* recoverable by
reading the code: how the repo got into its current shape, what is the user's
call rather than mine, and what would otherwise be re-derived from scratch.

Last updated: the session that rebuilt the glass + entrance cover pass after the
sandbox reset (see §1).

---

## 1. The thing that will block you

**A sandbox reset destroys uncommitted-to-remote work completely.** This has now
happened twice, and the second time it was total:

- Phase 1 reset: `.git` was re-cloned, orphaning the original history.
- **Phase 2 reset (this session's starting point):** the glass-pass commit
  `0951baa` was never pushed. The sandbox came back with the branch at `60ca33e`,
  a clean working tree, **and every file in `/home/user` outside the repo gone** —
  `SAFE-*.html/css/js`, `PR-BODY.md`, `serve-iconic.py`, and the
  `pre-session-b4ae71e` tag. Nothing was recoverable from `git fsck`, reflog,
  `/tmp`, or the remote. Only `origin/arena/3eec5d4f-iconic-dental` (`642b818`,
  the old PR #1 head) survived, because it was pushed.

Two consequences worth internalising:

1. **A backup that lives only on disk is not a backup.** The `SAFE-*` files were
   the documented safety net and they were the first thing lost. The remote is
   the only durable store. Push early.
2. **The work was rebuilt from spec, not recovered.** `MEMORY.md` §5 and
   `DESIGN.md` §3.5 specified the four panes and the cover precisely enough that
   the rebuild is faithful; the loupe was ported verbatim from `642b818`. If a
   third reset happens, the same path is available — but check §8 first.

**If a commit vanishes again:** do *not* assume the working tree still holds the
work (it did not, last time). Run the §8 health check against the working tree
first; it distinguishes "commit lost, files intact" from "everything lost".

---

## 2. What this project is

A single-page site for **ICONIC Dental & Aesthetics**, Shanthi Colony, Anna Nagar,
Chennai 600 040. Dr. Raguraam A Ramesh (BDS, FCE, MFM, MS, TN Reg 36336).
Static — no build step, no framework, no package.json. Three files do everything:
HTML, CSS, JS. Serve the repo root.

**Primary conversion:** a WhatsApp message or a phone call. Everything else is
secondary to that. The phone number is `+91 95977 67768`.

**The design direction is `CALIBRATED BLACK`** — instrument optics on black,
evidence over adjectives. The clinic's one provable advantage is magnified sight
(a surgical microscope, a diagnosis shown on screen, 25×). So the page is built
like the instrument. `DESIGN.md` is the full system and is the authority.
Dials: variance 7 / motion 6 / density 6.

**Do not rewrite `DESIGN.md` from scratch.** It has been revised twice to match
reality after parallel work overrode rules. Where a rule was overridden it is
marked *Revised* with the reason, on purpose. A design doc that quietly disagrees
with the code is worse than no doc.

---

## 3. Why the repo looks the way it does (history)

Four phases, and the seams matter:

1. **Original upload** (`b4ae71e`) — a working, competent site. Ivory + gold +
   serif "quiet luxury". Colour `#f6f5f2`, `Source Serif 4` + `IBM Plex Sans`.
2. **Design pass** — CALIBRATED BLACK. Landed as an *additive* `system.css`
   loaded after `styles.css`, plus edits to `index.html` / `app.js`. `styles.css`
   was deliberately left untouched so the whole direction could be reviewed and
   reverted as one file. Delivered as PR #1, which **merged**.
3. **The user's `TASK` pass** — the user then worked on main in parallel via
   GitHub's web UI: 35 `/* TASK n */` markers through `styles.css` and `app.js`.
   Scroll reveal, scrollspy, stat counters, hero stagger, shrinking header,
   drawer a11y, hover states, map lazy-load. **That is real work and it is
   authoritative.** It is preserved byte-identical.
   Then the user re-uploaded the merged tree as a **fresh single-commit root**
   (`60ca33e`, message "Add files via upload"), which orphaned the original
   history and re-cloned `.git`. It also **silently dropped the loupe component**
   from `app.js` — see §4.3.
4. **Glass + entrance cover** — built, lost to the Phase 2 reset, and rebuilt in
   the follow-up session. Four glass panes, the entrance cover, the loupe
   restored, `--shadow-*` un-nulled.

---

## 4. The four collisions (why the code is shaped this way)

These are the highest-value thing in this file. Each is a *class* of mistake.

### 4.1 Two reveal systems, and the difference was not cosmetic

The `TASK` pass reveals with `.reveal` → `.in`. The design pass had independently
written `.reveal` → `.is-in`. The selectors are not equal:

```
.reveal.in       specificity (0,2,0)   <- TASK pass
html.js .reveal  specificity (0,2,1)   <- design pass
```

`html.js .reveal` sets `opacity: 0`, so it **wins the cascade**. Shipping it
would have pinned **25 elements at opacity 0 permanently** — every browser, no
console error, nothing visibly wrong in a diff. The duplicate was deleted, not
reconciled. **Two implementations of one idea is not redundancy; it is a race.**

Note for the cover work: `index.html` now sets a `js` flag on `<html>` for the
entrance cover (`html:not(.js) .entrance-cover { display: none }`). That is the
same `html.js` mechanism that caused this collision — **the only `html.js`
selector on the page is that one.**

### 4.2 Two scroll states for one element

`updateHeaderState()` toggles `.scrolled` past 8px. The design pass had added a
second listener toggling `.is-scrolled` past 24px. Duplicate deleted; the glass
tint now rides `.scrolled`. **`app.js` owns ALL scroll state** — do not add
another scroll listener. (There are exactly two in the file: `updateScrollSpy`
and `updateHeaderState`, both from the `TASK` pass.)

### 4.3 A live regression that was already on main

The re-uploaded `app.js` had lost the loupe component — **zero references** —
while `index.html` kept 14 mounts and `system.css` kept 10 rules. The signature
interaction was dead: markup present, CSS present, no initialiser, no error.
Restored. It went unnoticed because a decorative enhancement that fails silently
looks identical to one nobody scrolled to. **If a feature spans HTML + CSS + JS,
grep all three when anything is re-uploaded.**

### 4.4 A token that would have nulled the user's work

`--shadow-sm` / `--shadow-md` were set to `none` under the design pass's
zero-elevation rule — but `TASK` CSS uses them on button hover and the shrinking
header. Those shadows would have silently vanished. Real subtle values restored;
the rule was narrowed to the **black grounds only**. **An override layer must
check who else consumes the variables it nulls.**

---

## 5. Glass: four panes, and the constraint is the point

The user asked for glassmorphism. Glass over a *flat* ground renders as a
slightly-lighter grey rectangle — you pay the compositing cost and see nothing.
So glass exists only where there is a photograph or moving content underneath:

| Pane | Sits over | Tint |
|---|---|---|
| `.site-header` | hero plate + paper sections scrolling under it | 62% scrolled / 86% at rest |
| `.sticky-mobile-bar` | scrolling content; carries the CTAs | 86% (near-opaque on purpose) |
| `.plate-anno` | the hero photograph | 50% |
| `.gallery-caption` | six clinic photographs, static | 50% |

**Everything else stays solid.** The mobile drawer is the deliberate omission — a
full-height pane sliding on `transform` while compositing a backdrop filter is
the classic mid-range-Android jank combo. Do not "finish the job" by glassing it.

Every pane ships a **solid tint as its base layer**, with blur added inside an
`@supports` block, so browsers without `backdrop-filter` get an opaque bar rather
than an unreadable one. Preserve that pattern.

Blur radii are deliberate, not decorative: **8px on the two fixed panes** (the
header recomposites every scroll frame), **12px on the two static ones**. The
panes take the system's `2px` radius, not an invented `12px` corner — anti-default
rule 6 is explicit that the lens is the only round object on the page.

---

## 6. Open decisions — the user's call, not mine

Documented in-file with `TODO(ship-blocker)` comments and in `DESIGN.md`:

1. **`4.9` rating with no source** (`index.html:252`). State the source and count
   or drop it.
2. **`2,000+ patients` / `4,000+ treatments`** (`index.html:643`). Round and
   unsourced. **Now worse:** the `TASK 12` counters animate them up from zero
   (`data-count="2000"` / `"4000"`), which draws more attention to figures that
   can't be defended. A *performed* number reads more like a claim than a printed
   one — and DCI's *Revised Dentist (Code of Ethics) Regulations, 2014* §8.1
   treats unsourced claims as misleading advertising. If the counters stay, the
   numbers want a source first. Recorded as rule 14 in `DESIGN.md`, not changed.
3. **The before/after pair is stock**, not this clinic's patients. Labelled on the
   page ("Illustrative comparison · not a clinic patient") rather than deleted.
   Real consented cases are the fix, and the strongest asset this clinic could own.
4. **`og:image` is a placeholder URL** (`index.html:18`). Needs the real deploy
   path and a 1200×630 crop. WhatsApp is the main booking channel — a bare link
   converts far worse than a photo card.
5. **Treatments thumbnails:** 8 of 10 are 600×400 stock photos of *other*
   clinics. Either replace with real photos or delete `.service-img-wrap` from
   non-featured rows. A stock thumbnail at 84px dilutes the evidence.
6. **1.9 MB of unreferenced assets ship**, including `gallery-6.jpeg` which is a
   byte-identical duplicate of `gallery-2.jpeg` (md5 `cbf0bac9…`).
   `gallery-7.png` alone is 1.93 MB.

---

## 7. Facts that took work to derive — don't re-derive

**Contrast (WCAG, computed not asserted).** White on WhatsApp green `#1fa855` =
**3.09:1**; white on old gold-600 = 3.99:1; `#a3a3a3` on white = 2.52:1. All
below AA — that's why saturated fills now take a near-black label
(ink on green = 6.3:1, ink on brass = 7.35:1) and `--gold-600` is re-pointed to
the darker brass ink `#7c5f14` (5.5:1 on paper).

**The palette argument.** Old ivory `#f6f5f2` is `oklch(97% 0.004 91)`; brand
brass sits at hue 86–92. The old palette painted the brand hue across the *entire
page background* — which is why nothing could ever read as brass: everything was
already brass. Warmth is now accent-only, on cool paper (`oklch(96.6% 0.004 122)`)
and near-black (`oklch(15.9% 0.002 107)`).

**The hero was never two columns.** `.hero-grid { display:block; max-width:880px }`
had no breakpoint override, so the "two-column hero" never rendered on any screen
and the site's best asset (790×1280) was cropped into a 380–460px letterbox.

**Entrance cover timings.** 320ms floor / 1400ms ceiling, raced against
`document.fonts.ready` + `window.load` + hero decode. A literal 1.5s was
measured and rejected: the page is 392 KB blocking, so +1.5s would add **+191%**
to a fast-4G load and **+76%** to a typical one on a static site with nothing to
wait for.

**The three escapes on the cover** are independent by design: `html:not(.js)` +
the head `<noscript>`; the `cover-escape` keyframe at 2400ms; and `transitionend`
plus a timeout in the controller that removes the node. If you touch the cover,
keep all three — the failure mode they prevent is a black rectangle over the
whole site.

---

## 8. Health check — run this to prove the merge is intact

```bash
cd /home/user/ICONIC-DENTAL
grep -c TASK styles.css                              # expect 35
git diff --stat main -- styles.css                   # expect EMPTY
grep -c 'function initLoupes' app.js                 # expect 1
grep -c 'function entranceCover' app.js              # expect 1
grep -c 'loupe-lens' index.html                      # expect 7
grep -c 'entranceCover' index.html                   # expect 1
grep -c 'is-in\|html.js .reveal' system.css          # expect 0 (no cascade killer)
grep -c 'function headerState\|function scrollReveals' app.js   # expect 0
grep -c '@supports ((backdrop-filter' system.css     # expect 4
node --check app.js && echo "js ok"
```

Expected in `system.css`: exactly 4 `@supports ((backdrop-filter` blocks, named
`.site-header`, `.sticky-mobile-bar`, `.plate-anno`, `.gallery-caption`. Both
stylesheets should also pass a real parser — `npx csstree-validator system.css
styles.css` reports nothing.

**Preview:** `python3 /home/user/serve-iconic.py` → port 8000, serves the repo
root, refuses dotfile paths so `.git` is never reachable. It lives *outside* the
repo on purpose so it never lands in a PR. If `/` 404s while `/index.html` works,
its dotfile guard is over-matching the root — the guard must ignore `.`/`..`
segments.

---

## 9. Backup locations

| Path | What |
|---|---|
| `/home/user/PR-BODY.md` | Finished PR title + body, ready to paste |
| `/home/user/serve-iconic.py` | Preview server |
| `origin/arena/3eec5d4f-iconic-dental` (`642b818`) | PR #1's head — the only surviving copy of the original design pass, and the source the loupe was ported from |

**There are no `SAFE-*` files any more.** They were lost with the sandbox reset
and are not being recreated: the pushed branch *is* the backup now. Push before
anything risky.

---

## 10. Working notes

- **Never force-overwrite `styles.css`.** It carries the user's `TASK` work. It
  is the single most dangerous file in this repo to "clean up." Diff it first,
  always.
- **The user works in parallel via GitHub's web UI.** Before starting anything,
  `git fetch` and check whether main has moved. Assume it has.
- **Verify claims with measurements.** Every number above was computed, not
  recalled. That's what made the 1.5s-loader and glass-scope arguments land where
  opinion alone wouldn't have.
- **The site is static.** No build, no dependencies, no tests to run. Validation
  is: parse the HTML, balance the braces, validate the CSS, grep for undefined
  `var()`, curl the assets.
- **Voice rules** (`DESIGN.md` §4.7): short declaratives, name the mechanism not
  the feeling, numbers instead of adjectives, reviews quoted verbatim. Never
  "smile you deserve", "world-class", or any superlative.

---

*This file is process memory, not a client deliverable. It is committed
deliberately — an untracked file survives only as bytes on disk, and this repo has
already lost a commit once (§1). It travels as its own commit, so dropping it
before the PR merges is one command:*

```bash
git rm MEMORY.md && git commit -m "Drop process memory from the PR"
```
