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
  });
  if (btnEl) btnEl.classList.add('active');

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
function filterServices(category, tabEl) {
  document.querySelectorAll('.category-tabs .cat-tab').forEach((t) => {
    t.classList.remove('active');
  });
  if (tabEl) tabEl.classList.add('active');

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
    if (indicator) indicator.textContent = '+';
  });

  if (!isOpen) {
    item.classList.add('open');
    const indicator = item.querySelector('.faq-question span:last-child');
    if (indicator) indicator.textContent = '−';
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