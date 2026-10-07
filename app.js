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
   -------------------------------------------------------------------------- */
function toggleMobileDrawer(open) {
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileDrawerBackdrop');
  if (!drawer || !backdrop) return;

  if (open) {
    drawerTrigger = document.activeElement;
    drawer.classList.add('open');
    backdrop.classList.add('open');

    const closeBtn = drawer.querySelector('.drawer-close');
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  } else {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');

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
   -------------------------------------------------------------------------- */
/* These are filters over one shared list, not tabs with tabpanels, so they carry
   aria-pressed rather than role="tab". */
function filterServices(category, tabEl) {
  document.querySelectorAll('.category-tabs .cat-tab').forEach((t) => {
    t.classList.remove('active');
    t.setAttribute('aria-pressed', 'false');
  });
  if (tabEl) {
    tabEl.classList.add('active');
    tabEl.setAttribute('aria-pressed', 'true');
  }

  document.querySelectorAll('#servicesGrid .service-card').forEach((card) => {
    const cardCats = card.getAttribute('data-category') || '';
    const matches = category === 'all' || cardCats.includes(category);
    card.style.display = matches ? '' : 'none';
  });
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
   -------------------------------------------------------------------------- */
function toggleFaq(btnEl) {
  const item = btnEl.closest('.faq-item');
  if (!item) return;

  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.faq-list .faq-item').forEach((el) => {
    el.classList.remove('open');
    const indicator = el.querySelector('.faq-question span:last-child');
    const question = el.querySelector('.faq-question');
    if (indicator) indicator.textContent = '+';
    if (question) question.setAttribute('aria-expanded', 'false');
  });

  if (!isOpen) {
    item.classList.add('open');
    const indicator = item.querySelector('.faq-question span:last-child');
    const question = item.querySelector('.faq-question');
    if (indicator) indicator.textContent = '−';
    if (question) question.setAttribute('aria-expanded', 'true');
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

function handleBookingSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('patientName')?.value.trim() || '';
  const phone = document.getElementById('patientPhone')?.value.trim() || '';
  const treatment = document.getElementById('selectedTreatmentInput')?.value || '';
  const date = document.getElementById('preferredDate')?.value || '';
  const slot = document.getElementById('selectedSlotInput')?.value || '';

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
