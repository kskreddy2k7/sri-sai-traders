/* Sri Sai Traders – Main Script */

// ── Mobile Menu ──────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

function toggleMenu() {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
}

function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

// Toggle on hamburger click
hamburger.addEventListener('click', toggleMenu);

// Close menu on nav link clicks
navLinks.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', closeMenu);
});

// Close menu when clicking outside
document.addEventListener('click', function (e) {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    closeMenu();
  }
});

// Close menu with Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') { closeMenu(); }
});

// ── Navbar shadow on scroll ───────────────────────────────────
const navbar    = document.getElementById('navbar');
const scrollBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', function () {
  const scrolled = window.scrollY > 20;
  navbar.classList.toggle('scrolled', scrolled);
  scrollBtn.classList.toggle('visible', window.scrollY > 300);
}, { passive: true });

// ── Scroll-to-top button ──────────────────────────────────────
scrollBtn.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── AOS Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 650,
      easing:   'ease-out-cubic',
      once:     true,
      offset:   60,
    });
  }
});

// ── Smooth active nav link highlight ─────────────────────────
(function () {
  const sections = document.querySelectorAll('section[id], header[id]');
  const links    = document.querySelectorAll('.nav-links a');

  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (link) {
            const href = link.getAttribute('href');
            link.style.color = '';
            link.style.background = '';
            if (href === '#' + entry.target.id ||
                (href === '#' && entry.target.id === 'home')) {
              link.style.color      = 'var(--green)';
              link.style.background = 'var(--green-bg)';
            }
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(function (s) { observer.observe(s); });
})();
