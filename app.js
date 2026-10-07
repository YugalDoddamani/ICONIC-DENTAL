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
   Default preferred date: tomorrow
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('preferredDate');
  if (!dateInput) return;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd = String(tomorrow.getDate()).padStart(2, '0');

  dateInput.value = `${yyyy}-${mm}-${dd}`;
  dateInput.min = `${yyyy}-${mm}-${dd}`;
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
        matched = true;
      }
    });

    if (!matched && chips.length > 0) chips[0].classList.add('selected');
  }

  if (section) section.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
}

function selectTreatmentChip(chipEl, treatmentName) {
  document.querySelectorAll('#treatmentChips .treatment-chip').forEach((c) => {
    c.classList.remove('selected');
  });
  if (chipEl) chipEl.classList.add('selected');

  const input = document.getElementById('selectedTreatmentInput');
  if (input) input.value = treatmentName;
}

function selectSlotPill(pillEl, slotLabel) {
  document.querySelectorAll('#slotPills .slot-pill').forEach((p) => {
    p.classList.remove('selected');
  });
  if (pillEl) pillEl.classList.add('selected');

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
   TASK 2 — Validate before showing the success banner.
   Name must be non-empty. Phone must be 10 digits starting 6-9.
   -------------------------------------------------------------------------- */
function handleBookingSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('patientName')?.value.trim() || '';
  const phone = document.getElementById('patientPhone')?.value.trim() || '';
  const treatment = document.getElementById('selectedTreatmentInput')?.value || '';
  const date = document.getElementById('preferredDate')?.value || '';
  const slot = document.getElementById('selectedSlotInput')?.value || '';

  const errorEl = document.getElementById('formError');
  const phoneOk = /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));

  if (!name || !phoneOk) {
    if (errorEl) {
      errorEl.hidden = false;
      errorEl.textContent = 'Enter your name and a valid 10-digit mobile number.';
    }
    return;
  }

  if (errorEl) errorEl.hidden = true;

  const banner = document.getElementById('bookingSuccessBanner');
  const summary = document.getElementById('bookingSuccessSummary');
  const waLink = document.getElementById('bookingSuccessWaLink');

  if (summary) {
    summary.innerHTML =
      `Thank you, <strong>${name}</strong>. Our Anna Nagar reception will call <strong>+91 ${phone}</strong> to confirm your <strong>${treatment}</strong> slot for <strong>${date}</strong> (${slot}).`;
  }
  if (waLink) waLink.href = buildWhatsAppBookingUrl();

  if (banner) {
    banner.style.display = 'block';
    banner.scrollIntoView({ behavior: scrollBehavior(), block: 'nearest' });
  }
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