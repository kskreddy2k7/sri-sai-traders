/* =========================================================
   Sri Sai Traders – script.js
   Premium Animations & Interactions
   ========================================================= */

'use strict';

/* ──────────────────────────────────────────────────────────
   1. PAGE LOADER
   ────────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  // Give the progress bar a moment to fill, then hide
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    runEntryAnimations();
  }, 2000);
});

// Block scroll while loading
document.body.style.overflow = 'hidden';

/* ──────────────────────────────────────────────────────────
   2. INIT AOS
   ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
    });
  }

  initNavbar();
  initMobileMenu();
  initParticles();
  initCounters();
  initProductCardTilt();
  initScrollTopBtn();
  initSmoothScroll();
  initPageTransition();
});

/* ──────────────────────────────────────────────────────────
   3. HERO ENTRY ANIMATIONS (GSAP)
   ────────────────────────────────────────────────────────── */
function runEntryAnimations() {
  if (typeof gsap === 'undefined') {
    // Fallback: just show elements
    document
      .querySelectorAll('.hero-badge,.hero-title,.hero-subtitle,.hero-owner,.hero-buttons,.scroll-indicator')
      .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-badge', { y: 30, opacity: 0, duration: 0.7 })
    .from('.hero-title span:nth-child(1)', { y: 60, opacity: 0, duration: 0.8 }, '-=0.3')
    .from('.hero-title span:nth-child(2)', { y: 60, opacity: 0, duration: 0.8 }, '-=0.5')
    .from('.hero-subtitle',  { y: 40, opacity: 0, duration: 0.7 }, '-=0.4')
    .from('.hero-owner',     { y: 30, opacity: 0, duration: 0.6 }, '-=0.3')
    .from('.hero-buttons .cta-btn', { y: 30, opacity: 0, stagger: 0.15, duration: 0.6 }, '-=0.3')
    .from('.scroll-indicator', { opacity: 0, duration: 0.6 }, '-=0.2');

  // Parallax hero blobs on scroll
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to('.blob-1', {
      y: -120,
      scrollTrigger: { trigger: '.hero-section', scrub: 1.5 },
    });
    gsap.to('.blob-2', {
      y: -80,
      scrollTrigger: { trigger: '.hero-section', scrub: 2 },
    });
    gsap.to('.hero-section .relative.z-10', {
      y: 100,
      opacity: 0.6,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Stats counter trigger
    ScrollTrigger.create({
      trigger: '#home + section',  // stats band
      start: 'top 80%',
      once: true,
      onEnter: () => animateCounters(),
    });

    // Why cards staggered entrance
    gsap.from('.why-card', {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.why-card',
        start: 'top 85%',
      },
    });
  }
}

/* ──────────────────────────────────────────────────────────
   4. NAVBAR SCROLL BEHAVIOUR
   ────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const onScroll = () => {
    const scrolled = window.scrollY > 50;
    navbar.classList.toggle('scrolled', scrolled);

    // Active link highlight
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });

    // Scroll-to-top button visibility
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ──────────────────────────────────────────────────────────
   5. MOBILE MENU
   ────────────────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden', isOpen);
    hamburger.classList.toggle('open', !isOpen);
    hamburger.setAttribute('aria-expanded', String(!isOpen));
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      hamburger.classList.remove('open');
    });
  });
}

/* ──────────────────────────────────────────────────────────
   6. HERO PARTICLES
   ────────────────────────────────────────────────────────── */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const COUNT = window.innerWidth < 600 ? 15 : 30;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size   = Math.random() * 6 + 3;
    const left   = Math.random() * 100;
    const top    = Math.random() * 100;
    const dur    = (Math.random() * 8 + 6).toFixed(1);
    const tx     = (Math.random() * 80 - 40).toFixed(0);
    const ty     = (Math.random() * 80 - 40).toFixed(0);
    const delay  = (Math.random() * 5).toFixed(1);

    Object.assign(p.style, {
      width:  `${size}px`,
      height: `${size}px`,
      left:   `${left}%`,
      top:    `${top}%`,
      '--dur': `${dur}s`,
      '--tx':  `${tx}px`,
      '--ty':  `${ty}px`,
      animationDelay: `${delay}s`,
    });

    fragment.appendChild(p);
  }
  container.appendChild(fragment);
}

/* ──────────────────────────────────────────────────────────
   7. ANIMATED COUNTERS
   ────────────────────────────────────────────────────────── */
let countersAnimated = false;

function initCounters() {
  // Observers as fallback (if ScrollTrigger not available)
  if (typeof IntersectionObserver === 'undefined') return;

  const counterEls = document.querySelectorAll('.counter');
  if (!counterEls.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          animateCounters();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  counterEls.forEach(el => observer.observe(el));
}

function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;

  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = Math.floor(eased * target);

      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };

    requestAnimationFrame(update);
  });
}

/* ──────────────────────────────────────────────────────────
   8. PRODUCT CARD 3D TILT EFFECT (event delegation)
   ────────────────────────────────────────────────────────── */
function initProductCardTilt() {
  // Use event delegation on the products grid container
  const grids = document.querySelectorAll('#products .grid');
  grids.forEach(grid => {
    grid.addEventListener('mousemove', e => {
      const card = e.target.closest('.product-card');
      if (card) onTiltMove(e, card);
    });
    grid.addEventListener('mouseleave', e => {
      const card = e.target.closest('.product-card');
      if (card) onTiltLeave(card);
    }, true);
  });
}

function onTiltMove(e, card) {
  if (!card) card = e.currentTarget;
  const rect   = card.getBoundingClientRect();
  const cx     = rect.left + rect.width  / 2;
  const cy     = rect.top  + rect.height / 2;
  const dx     = (e.clientX - cx) / (rect.width  / 2);
  const dy     = (e.clientY - cy) / (rect.height / 2);
  const rotateX = -dy * 8;
  const rotateY =  dx * 8;

  card.style.transition = 'none';
  card.style.transform  =
    `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
}

function onTiltLeave(card) {
  if (!card) card = this;
  card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  card.style.transform  = '';
}

/* ──────────────────────────────────────────────────────────
   9. SCROLL-TO-TOP BUTTON
   ────────────────────────────────────────────────────────── */
function initScrollTopBtn() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ──────────────────────────────────────────────────────────
   10. SMOOTH SCROLL FOR NAV LINKS
   ────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  // Target only explicit navigation anchors to avoid interfering with unrelated links
  const navSelectors = [
    'a.nav-link[href^="#"]',
    'a.mobile-link[href^="#"]',
    'footer a[href^="#"]',
    'a[href="#contact"]',
    'a[href="#about"]',
    'a[href="#products"]',
    'a[href="#gallery"]',
    'a[href="#home"]',
  ].join(',');

  document.querySelectorAll(navSelectors).forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ──────────────────────────────────────────────────────────
   11. PAGE TRANSITION EFFECT (between page loads / links)
   ────────────────────────────────────────────────────────── */
function initPageTransition() {
  if (typeof gsap === 'undefined') return;

  // Create overlay element
  const overlay = document.createElement('div');
  overlay.id = 'page-transition';
  document.body.appendChild(overlay);

  // Animate out on load
  gsap.from(overlay, {
    scaleY: 1,
    transformOrigin: 'top',
    duration: 0.8,
    ease: 'power3.inOut',
    delay: 0.1,
  });
}

/* ──────────────────────────────────────────────────────────
   12. GALLERY HOVER (extra glow)
   ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(item, { boxShadow: '0 20px 50px rgba(22,163,74,0.35)', duration: 0.4 });
      }
    });
    item.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(item, { boxShadow: 'none', duration: 0.4 });
      }
    });
  });
});

/* ──────────────────────────────────────────────────────────
   13. FLOATING BUTTONS ENTRANCE
   ────────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  if (typeof gsap === 'undefined') return;

  gsap.from('.float-btn', {
    scale: 0,
    opacity: 0,
    stagger: 0.15,
    duration: 0.5,
    ease: 'back.out(1.7)',
    delay: 2.2,
  });
});
