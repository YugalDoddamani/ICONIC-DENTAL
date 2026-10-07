# CALIBRATED BLACK
### Design system for ICONIC Dental & Aesthetics — Shanthi Colony, Anna Nagar, Chennai

One line: **the page is built like the instrument.** The clinic's only real
differentiator is magnified sight — a surgical microscope and a diagnosis the
patient sees on screen before treatment starts. So the interface is near-black
fields, brass hairlines, measured type, and one signature move that lets you
magnify the photograph yourself.

Status: direction committed, first build landed in `system.css`.
Not yet folded into `styles.css` — see Appendix C.

---

## 1. Design read

> Reading this as **a single-page local clinic landing site** for **Chennai
> patients choosing a dentist (anxious first-timers, families, cosmetic
> enquiries)**, with a **precision-instrument** language, leaning toward
> **clinical editorial — instrument optics on black, evidence over adjectives.**

Why not the alternatives:

- **Not spa-wellness.** That is the current state and it is the wrong promise.
  Warmth at a dental clinic reads as "we will be gentle with you because we
  can't show you anything." This clinic can show you everything.
- **Not SaaS-clean.** Blue-and-white trust isn't the gap; every competitor in
  Anna Nagar already looks like that.
- **Trust-first, so the dials come down, not up** — but trust is earned here by
  *evidence density* (credentials, protocol, hours, magnification) rather than
  by softness. Density is the trust signal; that is the deliberate inversion.

No clarifying question was needed: the page has one job (get a WhatsApp message
or a callback request) and one provable advantage (magnification). Both are
unambiguous.

---

## 2. Three dials

| Dial | Value | Why |
|---|---|---|
| **DESIGN_VARIANCE** | **7** | Below the 8 marketing default because this is medical and people need to feel the grid is dependable. Above 6 because the current page has *no* compositional idea: the hero is an 880px centred column on every breakpoint (`.hero-grid { display:block; max-width:880px }` — the "two-column hero" never actually renders). One strong off-centre hero, a numbered index, and a 12-column discipline everywhere else. |
| **MOTION_INTENSITY** | **5** | Below the 6 default. Authored motion is roughly a 3: hairline reveals and a lens that follows a cursor. The dial reads 5 only because the one signature interaction is *direct* — it responds at the speed of the hand. Nothing on this page moves by itself. No parallax, no Ken Burns, no carousels, no scroll-jacking, no counters ticking up. |
| **VISUAL_DENSITY** | **6** | Above the 4 default, on purpose. The differentiator is evidence, so the page carries more data than a typical landing page: a five-cell instrument readout, a numbered treatment index, a credential ledger, a protocol ledger. The rule that keeps it from becoming a cockpit: **density lives only in mono ledgers and spec rows — never in body copy.** Paragraphs stay at 62ch on a 1.62 line height. |

---

## 3. Anti-default lock

Banned outright for this project. Each one is either a generic LLM default or a
specific mistake this page already made.

1. **No ivory / parchment / "quiet luxury" premium.** The current ground
   `#f6f5f2` is `oklch(97% 0.004 91)` — hue 91. The brand brass is hue 86–92.
   The old palette spread the brand hue across the entire page background, which
   is why nothing could ever read as brass: everything was already brass. Warmth
   now exists **only in the accent**, never in the ground.
2. **No second warm neutral.** Paper is cool: `#f3f4f1` = `oklch(96.6% 0.004 122)`.
3. **No purple/indigo gradient, no `#2563eb` SaaS blue, no mint-teal medical.**
   The teal lives in the clinic's *unused* stock assets (see Appendix A) — it is
   the visual language of a stock photo agency, not of this practice.
4. **No three equal feature cards with line icons in circles.** The
   "what to expect" list is a ruled protocol ledger instead.
5. **No glassmorphism, no backdrop-blur, no frosted pills.** The header
   currently ships `backdrop-filter: blur(8px)`; it's removed. A clinic promises
   clarity — nothing on this page is ever blurry.
6. **No rounded-everything.** Radii are `2px`, and `0` for data rows. The only
   round object on the page is the loupe lens, because a lens is round by nature.
   Review avatars became 2px initials chips; the status dot became a square pip.
7. **No shadows on black.** Black is edged with hairlines, never lifted.
8. **No white text on a saturated fill.** Brass and WhatsApp green both take a
   near-black label. This is also an accessibility fix: the current
   `.btn-whatsapp` is white on `#1fa855` = **3.09:1 — below AA.**
9. **No unverifiable numbers.** `2,000+ patients`, `4,000+ treatments`, and a
   bare `4.9 rating` with no source are exactly the claims the Dental Council of
   India's ethics code treats as misleading advertising. Cite the source or cut
   the figure.
10. **No stock white-coat photography.** A stock model in a Chennai clinic is
    the single biggest credibility leak on the page. Photograph *this* room with
    *this* dentist, or show nothing.
11. **No urgency mechanics.** No countdowns, no "only 2 slots left", no discount
    badges, no exclamation marks. Ever.
12. **No decorative star-glyph rows.** One rating, one number, one source.
13. **No motion the user cannot stop.** Nothing animates on scroll except a
    one-time 240ms hairline and eyebrow reveal.

---

## 4. Taste system

### 4.1 Aesthetic name

**Calibrated Black** — *clinical instrument-optics.*

It fits because the practice's promise is *measured sight*: 25× magnification,
a 4-step sterilization protocol, appointments that start on time, "prices quoted
first." Black is the brand's own colour (the logo wordmark) and brass is the
logo's own gold. The system is not decorating the clinic — it is quoting it.

### 4.2 Signature element

**The loupe.** A 2.5× lens that follows the pointer across the hero plate and
2× across each clinic photograph, with a brass ring and a mono `2.5×` readout.

Why this one: the clinic sells magnification, and the page's own copy says
"drag to see how cleaning changes the *surface of the enamel*." The lens makes
the claim physical instead of adjective-shaped. It is not decoration — it is the
product demo, running on real photographs of the real room.

Implementation contract:
- Progressive enhancement. The lens is `aria-hidden` and decorative; every plate
  keeps full alt text. Nothing essential is only visible inside the lens.
- Fine pointers: follows the cursor. Coarse pointers: tap to pin, tap to release.
- The glass cannot travel past the frame, so near an edge it sits at the edge —
  the magnified content always matches the point under the *glass centre*.
- Under `prefers-reduced-motion` the lens still works but stops animating.

Supporting punctuation (same optics family, used everywhere): the **register
mark**, a 7px brass crosshair that opens every eyebrow. It is the page's period.

### 4.3 Palette roles

Warmth is the accent's job. The grounds are cool, so brass can do its work.

| Role | Token | Hex | OKLCH | Contrast |
|---|---|---|---|---|
| Instrument black (ground) | `--scope-900` | `#0d0d0c` | `oklch(15.9% 0.002 107)` | — |
| Black, raised (panels) | `--scope-800` | `#1a1a18` | `oklch(21.5% 0.003 107)` | — |
| Clinical paper (reading ground) | `--paper-100` | `#f3f4f1` | `oklch(96.6% 0.004 122)` | — |
| Paper, pure (forms/cards) | `--paper-000` | `#ffffff` | `oklch(100% 0 90)` | — |
| Neutral grey (behind the comparison) | `--neutral-100` | `#e8e8e6` | `oklch(93.0% 0.003 106)` | — |
| Brass — the fill | `--brass-500` | `#c09a3e` | `oklch(70.4% 0.118 86)` | ink on it **7.35** |
| Brass — on black (eyebrows, readouts) | `--brass-300` | `#e2c97e` | `oklch(84.0% 0.099 92)` | on black **11.9** |
| Brass — the hairline `rgba(211,178,92,.3)` | `--brass-400` | `#d3b25c` | `oklch(77.5% 0.112 89)` | on black **9.4** |
| Brass ink — on paper only | `--brass-700` | `#7c5f14` | `oklch(50.2% 0.095 86)` | on paper **5.5 / white 6.0** |
| Ink primary | `--ink-950` | `#0d0d0c` | `oklch(15.9% 0.002 107)` | on paper **19.4** |
| Ink secondary | `--ink-600` | `#55554e` | `oklch(44.7% 0.011 107)` | on paper **6.9** |
| Dim, on black | `--scope-dim` | `#a9a9a1` | `oklch(73.2% 0.011 107)` | on black **8.1** |
| Open / available | `--ok-400` | `#5cc78e` | `oklch(75.1% 0.130 158)` | on black **8.9** |
| WhatsApp fill | `--whatsapp-green` | `#1fa855` | `oklch(64.4% 0.165 151)` | ink on it **6.3** |

Roles, not colours:
- **Brass is never body text and never decoration.** It marks: the live value,
  the active state, the actionable row, the annotation. If it isn't pointing at
  something, it isn't brass.
- **Black is not "dark mode".** It is the *look-at-this* surface: the hero, the
  doctor, the trust ledger, the frame of the page.
- **Paper is where you read and fill things in.**
- Exactly two radii: `0` for data rows and tiled plate grids, `2px` for
  everything interactive. `9999px` is reserved for the lens.
- Exactly zero elevations. Black is edged; paper is edged. Nothing floats.

**Boundary rule:** a boundary between sections is a tone change **or** a
hairline, never both.

### 4.4 Type

Three faces, two superfamilies, one of which was drawn for technical
documentation and one for engraved display.

| Role | Face | Weights | Rules |
|---|---|---|---|
| Statements | **Instrument Serif** | 400 + italic | Only at ≥ 2.3rem. Two sentences maximum. Never in UI, never in a button, never in a label. Italic is reserved for the half of the statement that carries the promise — three uses per page, maximum. |
| UI, headings, body | **IBM Plex Sans** | 400 / 500 / 600 | Headings 600, `-0.02em`. Body 400 at 1.0625rem / 1.62. Nothing below 0.84rem in this face. |
| Every number, label, spec, code | **IBM Plex Mono** | 400 / 500 | Uppercase labels at 0.68–0.72rem, tracking 0.11–0.16em. `font-variant-numeric: tabular-nums`. |

Hierarchy rules, in order of force:
1. **Every numeral on this page is mono and tabular.** `25×`, `30–40`, `9:30–20:30`,
   `10+`, `4.9`, `Reg № 36336`, `01…10`. This is the system's strongest tell and
   it is applied without exception. Numbers are how this page talks.
2. Scale: statement `clamp(2.3rem, 5.1vw, 3.9rem)` · section head
   `clamp(1.5rem, 3.1vw, 2.15rem)` · body `1.0625rem` · label `0.7rem`.
3. Every section opens with the same three-part head: **register mark + mono
   numeral + mono name** (`01 — Preventive care`), then the heading, then a
   hairline that runs the full width of the container. The hairline is the
   section's opening bracket.
4. Measure: 62ch body, 24ch statement, 44ch hero lede. Nothing wider.

### 4.5 Primary viewport

Desktop, 1240px container, 12 columns. Copy is the readout; the photograph is
the specimen. Deliberately asymmetric — 6.6 / 5.4, not 6 / 6.

```
┌─ black strip: address ──────────────── open ● Mon–Sat 9:30 · phones ─┐
│ ▓WHITE LOGO CHIP▓   CLEANING  TREATMENTS  DR. RAGURAAM  RESULTS  CLINIC  VISIT   [phone] [BOOK]
├──────────────────────────────────────────────────────────────────────┤   ↑ black, hairline bottom
│ ✛ SHANTHI COLONY · ANNA NAGAR · CHENNAI 600 040      ┌─────────────┐  │
│                                                      │  ⌐        ¬ │  │  ← brass hairline frame
│ Most dentistry is done by feel.                      │             │  │     + corner ticks
│ Here it is done by sight.  ← italic, brass           │   25× lens  │  │     + pointer loupe
│                                                      │  follows    │  │
│ Ultrasonic cleaning, microscope-guided root canals.   │  the cursor │  │
│                                                      └─────────────┘  │
│ [ BOOK AN APPOINTMENT ]  [ MESSAGE ON WHATSAPP ]      SURGICAL MISC. 25×·LED
│ ─────────────────────────────────────────────────────────────────────│
│ DR. RAGURAAM A RAMESH · BDS, FCE, MFM, MS · TN REG 36336              │
├──────────────────────────────────────────────────────────────────────┤
│ YEARS 10+ │ MAGNIFICATION 25× │ STERILIZATION CLASS-B │ MON–SAT 9:30–20:30 │ RATING 4.9
└──────────────────────────────────────────────────────────────────────┘
```

Grounds, top to bottom — three black beats frame the page:

```
SCOPE  · mobile strip + header + hero + readout      ← the instrument
paper  · 01 cleaning spotlight (black panel on paper)
white  · 02 treatments index
SCOPE  · 03 Dr. Raguraam + 04 protocol ledger        ← the middle beat
grey   · 05 before / after   (neutral surround: colour judgement)
white  · 06 inside the clinic (tiled plates + loupe)
paper  · 07 reviews + FAQ
paper  · 08 booking + visit  (hairline between, not a tone change)
SCOPE  · footer + sticky action bar                  ← the instrument closes
```

### 4.6 Motion intent — MOTION_INTENSITY 5

**Moves:**
- The loupe, pointer-driven, ~90ms follow with instant start. The only element
  with real personality.
- The brass focus ring: 2px, 2px offset, `--brass-300` on black / `--brass-700`
  on paper. Identical on every focusable element.
- One-time section reveal: hairline draws 240ms, eyebrow rises 6px. Triggered by
  `IntersectionObserver`, staggered 60ms, once per section, never per card.
- The before/after comparator: user-driven drag only.

**Stays still:** the hero photograph (no Ken Burns, no parallax, no zoom-on-hover
— the loupe is the opt-in version), every gallery image, all body text, all form
controls, the header (no shrink-on-scroll, no hide-show).

**Reduced motion:** the lens works but stops animating; `scroll-behavior: smooth`
is switched off; all durations collapse to ~0. The comparator still drags,
because the user is the one driving it.

### 4.7 Voice

Same taste, in words.
- **Short declaratives.** "Painless is the default." "Prices are quoted first."
  "The same dentist each visit."
- **Name the mechanism, not the feeling.** "Topical numbing before every
  injection" beats "gentle, caring dentistry". "The microscope output is shown on
  a chairside screen" beats "we explain everything".
- **Numbers instead of adjectives.** 30–40 minutes. Single sitting. Class-B.
  9:30 to 8:30. 25×.
- **Reviews quoted verbatim**, typos and all. Never polished, never shortened
  with ellipses, never given a stock avatar.
- **Never**: "smile you deserve", "world-class", "painless!", "best dentist in
  Chennai", any superlative, any exclamation mark.
- **Say what you don't know.** "We will confirm at the appointment." "If you are
  not sure which one you need, book a consultation."

### 4.8 Non-goals — what this design refuses

- Refuses to look like a spa, a salon, or a "smile studio".
- Refuses warm parchment + gold hairline "premium clinic" (its own previous state).
- Refuses stock white-coat models, teal blobs, "450+ Happy Patient" badges.
- Refuses gradients on text, glass, blur, glow, drop shadows.
- Refuses scarcity and discount mechanics.
- Refuses illustration or stock where a real photograph of this room exists.
- Refuses motion the user can't stop.
- Refuses inventing or rounding up a number.
- Refuses to publish a patient comparison photo without consent and a visible
  label until it's real.
- Refuses to put brass on anything that isn't worth pointing at.

---

## 5. First-build checklist

Ordered by impact per unit of risk. Items 1–8 are the next implementation pass;
9–13 are hardening. ✔ = already landed in this session.

1. **Content before pixels.** Confirm the four stats are defensible (`2,000+`
   patients and `4,000+` treatments currently aren't) and add the source and
   count to the `4.9`. Get three consented before/after cases.
2. **Kill the nine dead assets (1.9 MB)** — `gallery-6.jpeg` is a byte-identical
   duplicate of `gallery-2.jpeg`. Convert `gallery-7.png` (1.93 MB, the largest
   file shipped) to WebP. See Appendix A.
3. ✔ **Token layer** in `system.css` §1–2: two grounds, brass scale, ink scale,
   two radii, zero elevation, mono data rule, spacing bands.
4. ✔ **Type swap**: Instrument Serif + IBM Plex Sans + IBM Plex Mono, and the
   mono-for-numerals rule applied across the page.
5. ✔ **Hero rebuild**: asymmetric 12-column, black ground, specimen plate with
   brass frame and corner ticks, mono annotation, five-cell readout strip.
   The old stacked-and-centred hero is gone.
6. ✔ **The loupe**, one component, seven mounts, pointer- and touch-aware.
7. **Treatments index, final pass.** The bones are already right (numbered rows,
   hairlines, a featured row). Decide the thumbnails: eight of the ten are 600×400
   stock photographs of other clinics. Either replace them with real photos of
   these nine treatments, or delete `.service-img-wrap` from non-featured rows
   entirely — a stock thumbnail at 84px adds nothing and dilutes the evidence.
8. **Section-by-section refinements** against the ground rhythm in §4.5, then
   delete the superseded rules from `styles.css` (§6 fold-in).
9. **Accessibility pass.** ✔ `aria-expanded` on the FAQ, ✔ `aria-pressed` on both
   filter groups, ✔ decorative stars hidden from assistive tech, ✔ `.sr-only`
   utility added, ✔ global `:focus-visible`, ✔ AA-failing white-on-green buttons
   fixed, ✔ `prefers-reduced-motion` block. Still open: promote the filter groups
   to real `radiogroup` semantics with arrow-key handling; audit the drawer for
   `aria-modal` + focus trap; verify the sticky bar never covers the form submit.
10. **Performance.** `fetchpriority="high"` on the hero plate ✔. Add `width`/
    `height` to every image (hero plate done ✔) to stop CLS, add `loading="lazy"`
    to the gallery ✔, then run Lighthouse on 4G throttling — LCP should be the
    hero plate, and it's a 250 KB portrait JPEG that deserves a 900×1200 WebP.
11. **Sharing.** ✔ OG + Twitter card meta added, with a `theme-color`. Still
    needs a real 1200×630 crop, because WhatsApp is this clinic's main booking
    channel and a bare link converts far worse than a photo card.
12. **Print sheet.** Stale-print rule: hide the loupe, the sticky bar and the
    CTAs; flip every ground to white. Half a page of rules already in place.
13. **Re-purge inline styles.** 19 inline `style="…color:…"` declarations remain
    in `index.html`. A token system can't be enforced while they're there.

---

## Appendix A — What reading the repo turned up

Real issues found while specifying this. Ordered by cost to the clinic.

| # | Finding | Evidence | Action |
|---|---|---|---|
| A1 | **The desktop hero never actually rendered two columns.** `.hero-grid { display:block; max-width:880px; margin:0 auto }` with no breakpoint override — so on every screen the copy is a centred column and the photograph stacks underneath it. The best asset on the site (a 790×1280 portrait of the microscope) was being cropped into a 380–460px letterbox. | `styles.css:529` | Fixed in the hero rebuild (§5.5) |
| A2 | **Primary CTA fails contrast.** White on `--whatsapp-green #1fa855` = 3.09:1. Hover on `.btn-gold` (white on `#9e7a25`) = 3.99:1, and gold-600 as *text* on white = 3.99:1 — all below AA 4.5:1. | computed | Fixed: saturated fills now take an ink label (6.3:1 / 7.35:1); `gold-600` re-pointed to the 5.5:1 brass ink |
| A3 | **Invalid ARIA.** `.category-tabs` declares `role="tablist"` but its buttons have no `role="tab"` and there are no tabpanels. | `index.html` | Fixed: `role="group"` + `aria-pressed` (they are filters over one list) |
| A4 | **No `sr-only` utility exists**, so every icon-only label (social pills `IG/FB/YT`, the `+`/`−` FAQ glyphs, the star rows) was read aloud as punctuation. | grep: 0 hits | Fixed: `.sr-only` added, glyph rows hidden |
| A5 | **Unverifiable stats.** `2,000+ patients`, `4,000+ treatments`, `4.9 rating` with no source, and a deleted-per-review `#a3a3a3` body grey that failed AA on white (2.52:1). | `index.html` | Flagged with `TODO(ship-blocker)` comments; §3.9 |
| A6 | **1.9 MB of unreferenced assets**, and `gallery-6.jpeg` is an exact duplicate of `gallery-2.jpeg` (md5 `cbf0bac9…`). `gallery-7.png` alone is 1.93 MB. | md5sum / grep | Checklist step 2 |
| A7 | **`.site-footer` shipped `#a3a3a3` on black (7.17:1, fine)** but the same value was used inline on white elsewhere in the old palette — the colour had two meanings. | grep | Resolved by the two-ground rule |
| A8 | **`html { scroll-behavior: smooth }` ignored `prefers-reduced-motion`.** The JS respected it; the CSS didn't. | `styles.css:65` | Fixed in the reduced-motion block |
| A9 | **No OG/Twitter tags at all**, for a clinic whose primary conversion channel is WhatsApp link-sharing. | `index.html` | Added, pending a 1200×630 crop |
| A10 | **`backdrop-filter: blur(8px)` on a sticky header** — banned by §3.5. | `styles.css:222` | Removed |
| A11 | **19 inline colour declarations** fight any token system. | grep | Checklist step 13 |
| A12 | **Two identical white sections in a row** (`#transformations-section` and `#gallery-section` both `.section-pure`). Rhythm flat spot. | `index.html` | Fixed by the ground rhythm |

## Appendix B — What landed in this session

- `system.css` — the taste layer (new, ~1550 lines).
- `index.html` — hero rebuilt, ground classes, section eyebrows with
  numbered register marks, `og:`/`theme-color`, ARIA fixes, `width`/`height` on
  the hero image, loupe mounts, an "Illustrative comparison · not a clinic
  patient" label on the stocked before/after pair, nav trimmed from 7 to 6 items.
- `app.js` — the loupe component (self-contained IIFE), plus
  `aria-expanded`/`aria-pressed` state now kept in sync by the existing handlers.
- Untouched on purpose: `styles.css`. The direction is delivered as an
  additive layer so it can be reviewed and reverted as one file.

## Appendix C — Fold-in plan

`system.css` is loaded after `styles.css` and wins every equal-specificity
contest. That is deliberate for review, not for shipping: the page currently
downloads ~34 KB of CSS it then overrides.

Fold-in, in order:
1. Merge `system.css` §1 (token remap) and §2 (new tokens) into the `:root`
   block of `styles.css`; delete the now-duplicated legacy declarations.
2. Move §3–§17 into `styles.css` in place of the rules they supersede
   (the old `.hero-grid`, `.hero-visual-card`, `.hero-floating-badge`,
   `.trust-pill-bar`, `.micro-feature`, `.section-dark` etc. all become dead).
3. Rename the section banners in `styles.css` to match §4.5's ground rhythm.
4. Drop the second `<link>`, re-run the contrast table in §4.3, and re-run
   Lighthouse.

Estimated result: ~40 KB instead of 74 KB of CSS, one file, one vocabulary.

---

### Sources

- DCI *Revised Dentist (Code of Ethics) Regulations, 2014*, §8.1 — advertising
  must maintain decorum; self-aggrandisement and boasting of cases are unethical:
  [dciindia.gov.in (PDF)](https://dciindia.gov.in/Rule_Regulation/Gazette_Notification_reg_DCI_Revised_Dentists_Code_of_Ethics_Regulations_2014_27.06.2014.pdf) ·
  [IDA Code of Ethics](https://www.ida.org.in/AboutUs/Details/Code-of-Ethics)
- Practitioner summary of what that means for dental marketing in India (no
  outcome claims, no patient testimonials, no superlatives):
  [ichelonconsulting.com](https://ichelonconsulting.com/insights/dental-clinic-marketing-india-dci-nmc-compliant)
