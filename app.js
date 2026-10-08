/* ==========================================================================
   ICONIC Dental & Aesthetics — Frontend interaction
   ========================================================================== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function scrollBehavior() {
  return prefersReducedMotion ? 'auto' : 'smooth';
}

let currentCleaningPackage = "Routine Ultrasonic Dental Cleaning & Polishing";
let drawerTrigger = null;

/* --------------------------------------------------------------------------
   Default preferred date: tomorrow.

   min is TODAY, not tomorrow. It used to be set to the default value, which
   silently made same-day emergency booking impossible through this form —
   toothache is one of the chips above.
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('preferredDate');
  if (!dateInput) return;

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const iso = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  dateInput.min = iso(today);
  if (!dateInput.value) dateInput.value = iso(tomorrow);
});

/* --------------------------------------------------------------------------
   Mobile drawer navigation
   TASK 5 — adds aria-expanded sync, aria-hidden on the drawer, body scroll
   lock, and a Tab focus trap.
   -------------------------------------------------------------------------- */
function toggleMobileDrawer(open) {
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileDrawerBackdrop');
  const toggle = document.getElementById('mobileMenuToggle');
  if (!drawer || !backdrop) return;

  if (open) {
    drawerTrigger = document.activeElement;
    drawer.classList.add('open');
    backdrop.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    const closeBtn = drawer.querySelector('.drawer-close');
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  } else {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    if (drawerTrigger && typeof drawerTrigger.focus === 'function') {
      drawerTrigger.focus({ preventScroll: true });
    }
    drawerTrigger = null;
  }
}

function drawerJump(selector) {
  toggleMobileDrawer(false);
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const drawer = document.getElementById('mobileDrawer');
  if (drawer && drawer.classList.contains('open')) toggleMobileDrawer(false);
});

/* TASK 5 — Focus trap: Tab cycles inside the open drawer. */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const drawer = document.getElementById('mobileDrawer');
  if (!drawer || !drawer.classList.contains('open')) return;

  const items = drawer.querySelectorAll(
    'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!items.length) return;

  const first = items[0];
  const last = items[items.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

/* --------------------------------------------------------------------------
   Cleaning tier selector
   -------------------------------------------------------------------------- */
function selectCleaningTier(btnEl, packageName, packageSub) {
  currentCleaningPackage = packageName;

  document.querySelectorAll('#cleaningTierList .cleaning-tier-btn').forEach((b) => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  if (btnEl) {
    btnEl.classList.add('active');
    btnEl.setAttribute('aria-pressed', 'true');
  }

  const summaryEl = document.getElementById('selectedCleaningSummary');
  if (summaryEl) {
    summaryEl.innerHTML =
      `<strong>Selected:</strong> ${packageName} <span style="display:block; font-size:0.78rem; color:var(--ink-600);">${packageSub}</span>`;
  }

  const waBtn = document.getElementById('cleaningWhatsappBtn');
  if (waBtn) {
    const msg = encodeURIComponent(
      `Hi ICONIC Dental & Aesthetics, I would like to book the "${packageName}" at your Anna Nagar clinic. Please share available slots.`
    );
    waBtn.href = `https://wa.me/919597767768?text=${msg}`;
  }
}

function bookSelectedCleaningPackage() {
  scrollToBooking(currentCleaningPackage);
}

/* --------------------------------------------------------------------------
   Service category filter
   TASK 15 — fade the grid out, swap visible cards, fade back in.
   -------------------------------------------------------------------------- */
function filterServices(category, tabEl) {
  document.querySelectorAll('.category-tabs .cat-tab').forEach((t) => {
    t.classList.remove('active');
    t.setAttribute('aria-pressed', 'false');
  });
  if (tabEl) {
    tabEl.classList.add('active');
    tabEl.setAttribute('aria-pressed', 'true');
  }

  const grid = document.getElementById('servicesGrid');
  if (!grid) return;

  const swap = () => {
    grid.querySelectorAll('.service-card').forEach((card) => {
      const cardCats = card.getAttribute('data-category') || '';
      const matches = category === 'all' || cardCats.includes(category);
      card.style.display = matches ? '' : 'none';
    });
  };

  if (prefersReducedMotion) {
    swap();
    return;
  }

  grid.style.opacity = '0';
  setTimeout(() => {
    swap();
    grid.style.opacity = '1';
  }, 150);
}

/* --------------------------------------------------------------------------
   Before and after slider
   -------------------------------------------------------------------------- */
function updateBeforeAfterSlider(val) {
  const pct = Number(val);
  const beforeLayer = document.getElementById('baBeforeLayer');
  const divider = document.getElementById('baDividerLine');
  const handle = document.getElementById('baHandle');

  if (beforeLayer) beforeLayer.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
  if (divider) divider.style.left = `${pct}%`;
  if (handle) handle.style.left = `${pct}%`;
}

function setBeforeAfterValue(val) {
  const input = document.getElementById('baRangeInput');
  if (input) input.value = val;
  updateBeforeAfterSlider(val);
}

/* --------------------------------------------------------------------------
   FAQ accordion
   TASK 10 — no more textContent swapping. The CSS rotates the icon.
   aria-expanded is now kept in sync on the button.
   -------------------------------------------------------------------------- */
function toggleFaq(btnEl) {
  const item = btnEl.closest('.faq-item');
  if (!item) return;

  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.faq-list .faq-item').forEach((el) => {
    el.classList.remove('open');
    const btn = el.querySelector('.faq-question');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });

  if (!isOpen) {
    item.classList.add('open');
    btnEl.setAttribute('aria-expanded', 'true');
  }
}

/* --------------------------------------------------------------------------
   Booking scroll and form
   -------------------------------------------------------------------------- */
function scrollToBooking(preselectedTreatment) {
  const section = document.getElementById('booking-section');
  const hiddenInput = document.getElementById('selectedTreatmentInput');

  if (preselectedTreatment && hiddenInput) {
    hiddenInput.value = preselectedTreatment;

    const chips = document.querySelectorAll('#treatmentChips .treatment-chip');
    const target = preselectedTreatment.toLowerCase();
    let matched = false;

    chips.forEach((chip) => {
      chip.classList.remove('selected');
      if (matched) return;

      const text = chip.textContent.toLowerCase();
      const isMatch =
        (target.includes('cleaning') && text.includes('cleaning')) ||
        (target.includes('root canal') && text.includes('root canal')) ||
        (target.includes('braces') && text.includes('braces')) ||
        (target.includes('makeover') && text.includes('makeover')) ||
        (target.includes('implant') && text.includes('implant')) ||
        (target.includes('crown') && text.includes('crown')) ||
        (target.includes('kids') && text.includes('kids')) ||
        (target.includes('extraction') && text.includes('toothache'));

      if (isMatch) {
        chip.classList.add('selected');
        chip.setAttribute('aria-pressed', 'true');
        matched = true;
      } else {
        chip.setAttribute('aria-pressed', 'false');
      }
    });

    if (!matched && chips.length > 0) {
      chips[0].classList.add('selected');
      chips[0].setAttribute('aria-pressed', 'true');
    }
  }

  if (section) section.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
}

/* Keep .selected and aria-pressed in step. The chips and pills are toggle
   buttons whose state is otherwise only a background colour, so a screen
   reader had no way to hear which one was chosen. */
function setSelectedChoice(selector, chosen) {
  document.querySelectorAll(selector).forEach((el) => {
    const isChosen = el === chosen;
    el.classList.toggle('selected', isChosen);
    el.setAttribute('aria-pressed', isChosen ? 'true' : 'false');
  });
}

function selectTreatmentChip(chipEl, treatmentName) {
  setSelectedChoice('#treatmentChips .treatment-chip', chipEl);

  const input = document.getElementById('selectedTreatmentInput');
  if (input) input.value = treatmentName;
}

function selectSlotPill(pillEl, slotLabel) {
  setSelectedChoice('#slotPills .slot-pill', pillEl);

  const input = document.getElementById('selectedSlotInput');
  if (input) input.value = slotLabel;
}

function buildWhatsAppBookingUrl() {
  const name = (document.getElementById('patientName')?.value || '').trim() || 'Patient';
  const phone = (document.getElementById('patientPhone')?.value || '').trim();
  const treatment =
    document.getElementById('selectedTreatmentInput')?.value ||
    'Ultrasonic Dental Cleaning & Oral Checkup';
  const date = document.getElementById('preferredDate')?.value || 'Upcoming available day';
  const slot =
    document.getElementById('selectedSlotInput')?.value || 'Evening (5:00 PM – 8:30 PM)';

  const message =
    `Hi ICONIC Dental & Aesthetics (Anna Nagar),\n\n` +
    `I would like to book an appointment:\n` +
    `• Name: ${name}\n` +
    (phone ? `• Mobile: +91 ${phone}\n` : '') +
    `• Treatment: ${treatment}\n` +
    `• Preferred date: ${date}\n` +
    `• Preferred slot: ${slot}\n\n` +
    `Please confirm my slot with Dr. Raguraam A Ramesh.`;

  return `https://wa.me/919597767768?text=${encodeURIComponent(message)}`;
}

/* --------------------------------------------------------------------------
   Booking submission — TASK 2 (validation) + the fix for the dead form.

   The form carries a Web3Forms access_key but nothing ever consumed it:
   handleBookingSubmit called preventDefault(), rendered "Thank you, {name}"
   and returned, so the page claimed a request had been received when no
   request had been sent anywhere. There was no fetch() in this file at all.

   Now: validate, POST to Web3Forms, and if that fails for any reason fall
   back to WhatsApp so a request is never silently dropped.
   -------------------------------------------------------------------------- */
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_TIMEOUT_MS = 8000;

/* Every field in the summary is user input. textContent only, never innerHTML —
   a name like `<img src=x onerror=...>` used to be parsed as markup. */
function setBookingSummary(text) {
  const summary = document.getElementById('bookingSuccessSummary');
  if (summary) summary.textContent = text;
}

function setFormStatus(message) {
  const status = document.getElementById('formStatus');
  if (!status) return;
  status.hidden = !message;
  status.textContent = message || '';
}

function setFormError(message) {
  const errorEl = document.getElementById('formError');
  if (!errorEl) return;
  errorEl.hidden = !message;
  errorEl.textContent = message || '';
}

function setSubmitBusy(busy) {
  const btn = document.getElementById('bookingSubmitBtn');
  if (!btn) return;
  btn.disabled = busy;
  btn.setAttribute('aria-busy', busy ? 'true' : 'false');
  btn.textContent = busy ? 'Sending…' : 'Request callback';
}

function localDateString(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatPreferredDate(value) {
  if (!value) return 'next available day';
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return value;
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function readBookingForm() {
  const name = (document.getElementById('patientName')?.value || '').trim();
  const digits = (document.getElementById('patientPhone')?.value || '').replace(/\D/g, '');
  return {
    name,
    digits,
    treatment:
      document.getElementById('selectedTreatmentInput')?.value ||
      'Ultrasonic Dental Cleaning & Oral Checkup',
    date: document.getElementById('preferredDate')?.value || '',
    slot:
      document.getElementById('selectedSlotInput')?.value ||
      'Evening (5:00 PM – 8:30 PM)',
  };
}

async function handleBookingSubmit(event) {
  event.preventDefault();

  const form = document.getElementById('quickBookForm');
  const values = readBookingForm();
  const today = localDateString(new Date());

  if (!values.name) {
    setFormError('Enter your full name.');
    document.getElementById('patientName')?.focus();
    return;
  }

  if (!/^[6-9]\d{9}$/.test(values.digits)) {
    setFormError('Enter a valid 10-digit mobile number starting 6, 7, 8 or 9.');
    document.getElementById('patientPhone')?.focus();
    return;
  }

  if (values.date && values.date < today) {
    setFormError('That date has already passed. Choose today or later, or leave it blank.');
    document.getElementById('preferredDate')?.focus();
    return;
  }

  setFormError('');
  setSubmitBusy(true);
  setFormStatus('Sending your request…');

  let sent = false;
  let failure = 'We could not reach the booking server.';

  try {
    const payload = {
      access_key: form?.elements.namedItem('access_key')?.value || '',
      subject: 'New appointment request — ICONIC Dental & Aesthetics',
      from_name: 'ICONIC Dental website',
      name: values.name,
      phone: `+91 ${values.digits}`,
      treatment: values.treatment,
      preferred_date: values.date ? formatPreferredDate(values.date) : 'Next available day',
      preferred_time: values.slot,
      source: typeof location !== 'undefined' ? location.href : '',
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), WEB3FORMS_TIMEOUT_MS);

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams(payload),
        signal: controller.signal,
      });
      const body = await res.json().catch(() => null);

      if (res.ok && body && body.success) {
        sent = true;
      } else {
        failure = (body && body.message) || `The booking server replied ${res.status}.`;
      }
    } finally {
      clearTimeout(timer);
    }
  } catch (err) {
    failure =
      err && err.name === 'AbortError'
        ? 'The booking server did not respond in time.'
        : 'No response from the booking server — you may be offline.';
  }

  setSubmitBusy(false);
  setFormStatus('');

  if (sent) {
    renderBookingOutcome(true, values);
    return;
  }

  /* Never a dead end: WhatsApp is the clinic's primary channel anyway, and the
     fallback link is prefilled with exactly what would have been emailed. */
  console.warn('[booking] Web3Forms submission failed:', failure);
  renderBookingOutcome(false, values, failure);
}

function renderBookingOutcome(success, values, failureMessage) {
  const banner = document.getElementById('bookingSuccessBanner');
  const heading = document.getElementById('bookingSuccessHeading');
  const waLink = document.getElementById('bookingSuccessWaLink');
  if (!banner) return;

  const when = `${formatPreferredDate(values.date)} · ${values.slot}`;

  banner.classList.toggle('is-failed', !success);

  if (heading) {
    heading.textContent = success ? 'Request received' : 'Request not sent';
  }

  if (success) {
    setBookingSummary(
      `Thank you, ${values.name}. Our Anna Nagar reception will call +91 ${values.digits} to confirm your ${values.treatment} slot for ${when}.`
    );
    if (waLink) {
      waLink.textContent = 'Also open in WhatsApp';
      waLink.hidden = false;
      waLink.href = buildWhatsAppBookingUrl();
    }
  } else {
    setBookingSummary(
      `${failureMessage} Your details were not sent. Send them on WhatsApp instead, or call +91 95977 67768 — we will confirm your ${values.treatment} slot for ${when}.`
    );
    if (waLink) {
      waLink.textContent = 'Send this request on WhatsApp';
      waLink.hidden = false;
      waLink.href = buildWhatsAppBookingUrl();
    }
  }

  banner.style.display = 'block';
  banner.scrollIntoView({ behavior: scrollBehavior(), block: 'nearest' });
}

function sendFormToWhatsApp() {
  window.open(buildWhatsAppBookingUrl(), '_blank', 'noopener,noreferrer');
}

/* --------------------------------------------------------------------------
   TASK 6 — Scroll reveal.
   Elements with .reveal start at opacity 0 and slide up when .in is added.
   Runs once per element; the observer is discarded after firing.
   -------------------------------------------------------------------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* --------------------------------------------------------------------------
   TASK 12 — Count up the four stats in the dark section.
   Reduced motion jumps to the final value.
   -------------------------------------------------------------------------- */
function countUp(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const decimals = el.dataset.decimals ? 1 : 0;
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent =
      (decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString('en-IN')) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      statObserver.unobserve(entry.target);

      const el = entry.target;
      if (prefersReducedMotion) {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const decimals = el.dataset.decimals ? 1 : 0;
        el.textContent =
          (decimals ? target.toFixed(decimals) : Math.round(target).toLocaleString('en-IN')) + suffix;
        return;
      }

      countUp(el);
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll('.stat-number[data-count]').forEach((el) => statObserver.observe(el));

/* --------------------------------------------------------------------------
   TASK 13 — Scrollspy.
   Marks the nav link whose section is closest above the header.
   -------------------------------------------------------------------------- */
const spySections = document.querySelectorAll('section[id]');
const spyLinks = document.querySelectorAll('.nav-link');

function updateScrollSpy() {
  let current = '';
  spySections.forEach((section) => {
    if (section.getBoundingClientRect().top <= 140) current = section.id;
  });
  spyLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.target === current);
  });
}

window.addEventListener('scroll', updateScrollSpy, { passive: true });
updateScrollSpy();

/* --------------------------------------------------------------------------
   TASK 14 — Header shrink.
   Adds .scrolled once the page has scrolled past the top utility bar.
   -------------------------------------------------------------------------- */
const siteHeader = document.querySelector('.site-header');

function updateHeaderState() {
  if (!siteHeader) return;
  siteHeader.classList.toggle('scrolled', window.scrollY > 8);
}

window.addEventListener('scroll', updateHeaderState, { passive: true });
updateHeaderState();

/* --------------------------------------------------------------------------
   TASK 18 — Map facade.
   Defers loading the Google Maps iframe until the user asks for it.
   -------------------------------------------------------------------------- */
function loadMap() {
  const facade = document.getElementById('mapFacade');
  if (!facade) return;

  const mapUrl =
    'https://maps.google.com/maps?q=No.66%2F113%2C%20AA%20Block%2C%201st%20Floor%2C%204th%20Avenue%20Shanthi%20Colony%2C%20AnnaNagar%2C%20Chennai%20-%20600%20040.&t=m&z=15&output=embed&iwloc=near';

  const iframe = document.createElement('iframe');
  iframe.src = mapUrl;
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  iframe.title = 'ICONIC Dental & Aesthetics location';

  facade.innerHTML = '';
  facade.appendChild(iframe);
}
/* --------------------------------------------------------------------------
   The loupe — signature interaction
   --------------------------------------------------------------------------
   A magnifying lens that follows the pointer over a `.loupe` plate and shows
   the same photograph at Nx. The clinic sells magnification, so the interface
   demonstrates it rather than describing it.

   Progressive enhancement: the lens is aria-hidden and decorative; every plate
   keeps a full alt text, so nothing is available only inside the lens. Fine
   pointers follow the cursor, coarse pointers tap to pin, and reduced-motion
   users get an instant, unanimated lens.
   -------------------------------------------------------------------------- */
(function initLoupes() {
  const hosts = document.querySelectorAll('.loupe[data-loupe]');
  if (!hosts.length) return;

  const finePointer = window.matchMedia('(pointer: fine)').matches;

  hosts.forEach((host) => {
    const img = host.querySelector('img');
    const lens = host.querySelector('.loupe-lens');
    if (!img || !lens) return;

    const readout = lens.querySelector('[data-read]');
    const zoom = parseFloat(host.dataset.loupe) || 2;
    if (readout) readout.textContent = zoom + '\u00d7';

    let box = { w: 0, h: 0 };      // plate box, CSS px
    let disp = { w: 0, h: 0 };     // image size after object-fit: cover
    let off = { x: 0, y: 0 };      // cover crop offset
    let radius = 0;
    let pinned = false;

    function measure() {
      const rect = host.getBoundingClientRect();
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      if (!rect.width || !rect.height || !nw || !nh) return false;

      box = { w: rect.width, h: rect.height };
      const scale = Math.max(box.w / nw, box.h / nh);   // object-fit: cover
      disp = { w: nw * scale, h: nh * scale };
      off = { x: (box.w - disp.w) / 2, y: (box.h - disp.h) / 2 };
      radius = lens.offsetWidth / 2;
      return true;
    }

    function place(clientX, clientY) {
      const rect = host.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;

      const diameter = radius * 2;
      // The glass cannot travel past the frame, so near an edge it sits at the
      // edge while the pointer keeps going. Everything below is derived from the
      // glass centre, so what you see under the lens is always what is there.
      const x = Math.max(0, Math.min(box.w - diameter, px - radius));
      const y = Math.max(0, Math.min(box.h - diameter, py - radius));
      const cx = x + radius;
      const cy = y + radius;

      lens.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      const scaledW = disp.w * zoom;
      const scaledH = disp.h * zoom;
      let bgX = -((cx - off.x) * zoom - radius);
      let bgY = -((cy - off.y) * zoom - radius);

      bgX = Math.max(-(scaledW - diameter), Math.min(0, bgX));
      bgY = Math.max(-(scaledH - diameter), Math.min(0, bgY));

      lens.style.backgroundSize = `${scaledW}px ${scaledH}px`;
      lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
    }

    function paint() {
      lens.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
    }

    function show(on) {
      if (on && !measure()) return;
      lens.classList.toggle('is-lensing', !!on);
      host.classList.toggle('is-lensing', !!on);
      if (!on && pinned) pinned = false;
    }

    if (img.complete) paint();
    else img.addEventListener('load', paint, { once: true });

    // Fine pointers: follow. Touch: tap to pin, tap again to release.
    if (finePointer) {
      host.addEventListener('pointerenter', (e) => {
        paint();
        show(true);
        place(e.clientX, e.clientY);
      });
      host.addEventListener('pointermove', (e) => {
        if (!lens.classList.contains('is-lensing')) return;
        place(e.clientX, e.clientY);
      });
      host.addEventListener('pointerleave', () => show(false));
    } else {
      host.addEventListener('pointerdown', (e) => {
        paint();
        pinned = !pinned;
        show(pinned);
        if (pinned) place(e.clientX, e.clientY);
      });
      host.addEventListener('pointermove', (e) => {
        if (!pinned) return;
        e.preventDefault();
        place(e.clientX, e.clientY);
      }, { passive: false });
    }

    if ('ResizeObserver' in window) {
      new ResizeObserver(() => { if (lens.classList.contains('is-lensing')) measure(); }).observe(host);
    } else {
      window.addEventListener('resize', () => { if (lens.classList.contains('is-lensing')) measure(); });
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && pinned) show(false);
    });
  });
})();

/* --------------------------------------------------------------------------
   The entrance cover — a cover, not a toll booth.
   --------------------------------------------------------------------------
   Its duration is set by the page, not by a timer: it waits on real events (the
   webfont swap, window.load, the hero decode) and is bounded at both ends — a
   320ms floor so the reticle and the wordmark read on a warm cache, and a
   1400ms ceiling so a slow connection never waits on decoration. The ceiling is
   also the race, so one slow font can never hold the page shut.

   Reduced motion needs no branch here: system.css section 20 collapses the fade
   and zeroes the keyframe delay, so the cover is already gone by the time this
   lifts it.

   The node is removed, not just hidden — and by two routes, `transitionend`
   plus a timeout, because a transition that never runs would otherwise leave it
   in the DOM forever.
   -------------------------------------------------------------------------- */
(function entranceCover() {
  const cover = document.getElementById('entranceCover');
  if (!cover) return;

  const FLOOR = 320;
  const CEILING = 1400;
  const start = performance.now();
  let lifted = false;

  function remove() {
    if (cover.parentNode) cover.parentNode.removeChild(cover);
  }

  function lift() {
    if (lifted) return;
    lifted = true;

    const wait = Math.max(0, FLOOR - (performance.now() - start));
    window.setTimeout(() => {
      cover.classList.add('is-lifting');
      cover.addEventListener('transitionend', remove, { once: true });
      window.setTimeout(remove, 700);
    }, wait);
  }

  // Escape 3 is the keyframe in system.css; this covers a slow network, which
  // the keyframe cannot know about.
  window.setTimeout(lift, CEILING);

  const hero = document.querySelector('.plate img');
  const heroReady = hero && typeof hero.decode === 'function'
    ? hero.decode().catch(() => {})
    : Promise.resolve();

  const fontsReady = document.fonts && document.fonts.ready
    ? document.fonts.ready.catch(() => {})
    : Promise.resolve();

  const loaded = new Promise((resolve) => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve, { once: true });
  });

  Promise.race([
    Promise.all([fontsReady, loaded, heroReady]),
    new Promise((resolve) => window.setTimeout(resolve, CEILING)),
  ]).then(lift);
})();
