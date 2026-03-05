/* =========================================================
   Sri Sai Traders – script.js
   Ultra Premium Animations & Interactions
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
  initTsParticles();
  initParticles();
  initProductCanvasParticles();
  initCounters();
  initVanillaTilt();
  initProductCardTilt();
  initScrollTopBtn();
  initSmoothScroll();
  initPageTransition();
  initMouseSpotlight();
});

/* ──────────────────────────────────────────────────────────
   3. HERO ENTRY ANIMATIONS (GSAP)
   ────────────────────────────────────────────────────────── */
function runEntryAnimations() {
  // Trigger the curtain wipe-away first
  animatePageCurtain();

  if (typeof gsap === 'undefined') {
    // Fallback: just show elements
    document
      .querySelectorAll('.hero-badge,.hero-title,.hero-subtitle,.hero-owner,.hero-buttons,.scroll-indicator,.hero-photo-card')
      .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-badge', { y: 30, opacity: 0, duration: 0.7 })
    .from('.hero-title span:nth-child(1)', { y: 60, opacity: 0, duration: 0.8 }, '-=0.3')
    .from('.hero-title span:nth-child(2)', { y: 50, opacity: 0, duration: 0.7 }, '-=0.5')
    .from('.hero-title span:nth-child(3)', { y: 60, opacity: 0, duration: 0.8 }, '-=0.5')
    .from('.hero-subtitle',  { y: 40, opacity: 0, duration: 0.7 }, '-=0.4')
    .from('.hero-owner',     { y: 30, opacity: 0, duration: 0.6 }, '-=0.3')
    .from('.hero-buttons .cta-btn', { y: 30, opacity: 0, stagger: 0.15, duration: 0.6 }, '-=0.3')
    .from('.scroll-indicator', { opacity: 0, duration: 0.6 }, '-=0.2')
    .from('.hero-product-collage .hero-photo-card', {
      y: 30, opacity: 0, scale: 0.95, stagger: 0.12, duration: 0.65,
    }, '-=1.2');

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
    gsap.to('.parallax-hero-content', {
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
   6. tsParticles HERO BACKGROUND
   ────────────────────────────────────────────────────────── */
function initTsParticles() {
  if (typeof tsParticles === 'undefined') return;

  tsParticles.load('tsparticles', {
    fullScreen: { enable: false },
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    particles: {
      number: {
        value: window.innerWidth < 600 ? 35 : 65,
        density: { enable: true, area: 900 },
      },
      color: { value: ['#22c55e', '#38bdf8', '#a78bfa'] },
      shape: { type: 'circle' },
      opacity: {
        value: 0.35,
        animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false },
      },
      size: {
        value: { min: 1, max: 3 },
        animation: { enable: true, speed: 2, minimumValue: 0.5, sync: false },
      },
      links: {
        enable: true,
        distance: 130,
        color: '#38bdf8',
        opacity: 0.12,
        width: 0.8,
      },
      move: {
        enable: true,
        speed: 0.6,
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'bounce' },
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'grab' },
        onClick: { enable: false },
        resize: true,
      },
      modes: {
        grab: { distance: 140, links: { opacity: 0.35 } },
      },
    },
    detectRetina: true,
  });
}

/* ──────────────────────────────────────────────────────────
   7. HERO CANVAS PARTICLE NETWORK (fallback when tsParticles unavailable)
   ────────────────────────────────────────────────────────── */
function initParticles() {
  // If tsParticles loaded successfully, skip canvas fallback
  if (typeof tsParticles !== 'undefined') return;

  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const section = document.querySelector('.hero-section');

  const COUNT = window.innerWidth < 600 ? 40 : 70;
  const CONNECT_DIST = 130;
  let particles = [];
  let animId;

  function resize() {
    canvas.width  = section ? section.offsetWidth  : window.innerWidth;
    canvas.height = section ? section.offsetHeight : window.innerHeight;
  }

  function createParticle() {
    return {
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r:  Math.random() * 2.5 + 1.2,
      op: Math.random() * 0.35 + 0.1,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx = -p.vx;
      if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34,197,94,${p.op})`;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = 'rgba(34,197,94,0.5)';
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          ctx.beginPath();
          ctx.lineWidth   = 0.5;
          ctx.strokeStyle = `rgba(56,189,248,${0.15 * (1 - dist / CONNECT_DIST)})`;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  particles = Array.from({ length: COUNT }, createParticle);
  draw();

  let heroResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(heroResizeTimer);
    heroResizeTimer = setTimeout(() => {
      cancelAnimationFrame(animId);
      resize();
      particles = Array.from({ length: COUNT }, createParticle);
      draw();
    }, 150);
  }, { passive: true });
}

/* ──────────────────────────────────────────────────────────
   8. ANIMATED COUNTERS
   ────────────────────────────────────────────────────────── */
let countersAnimated = false;

function initCounters() {
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
   9. VANILLA TILT – Product cards 3D tilt (enhanced)
   ────────────────────────────────────────────────────────── */
function initVanillaTilt() {
  if (typeof VanillaTilt === 'undefined') return;

  VanillaTilt.init(document.querySelectorAll('.product-card'), {
    max:          18,
    speed:        600,
    glare:        true,
    'max-glare':  0.28,
    perspective:  800,
    scale:        1.06,
    easing:       'cubic-bezier(.03,.98,.52,.99)',
    gyroscope:    true,
  });
}

/* ──────────────────────────────────────────────────────────
   9b. PRODUCT CARD 3D TILT EFFECT (fallback when Vanilla Tilt unavailable)
       Also drives the specular highlight on all cards.
   ────────────────────────────────────────────────────────── */
function initProductCardTilt() {
  /* Specular highlight: cache the rect on enter, update vars on move.
     Works independently of VanillaTilt — adds a realistic specular layer. */
  document.querySelectorAll('.product-card').forEach(card => {
    let rect = null;
    let pendingRaf = false;

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect(); // cache once on enter
    }, { passive: true });

    card.addEventListener('mousemove', e => {
      if (!rect || pendingRaf) return;
      pendingRaf = true;
      requestAnimationFrame(() => {
        const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
        const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
        card.style.setProperty('--card-x', `${x}%`);
        card.style.setProperty('--card-y', `${y}%`);
        pendingRaf = false;
      });
    }, { passive: true });

    card.addEventListener('mouseleave', () => { rect = null; }, { passive: true });
  });

  if (typeof VanillaTilt !== 'undefined') return; // Vanilla Tilt handles the tilt

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
  const rect     = card.getBoundingClientRect();
  const cx       = rect.left + rect.width  / 2;
  const cy       = rect.top  + rect.height / 2;
  const dx       = (e.clientX - cx) / (rect.width  / 2);
  const dy       = (e.clientY - cy) / (rect.height / 2);
  const rotateX  = -dy * 18;
  const rotateY  =  dx * 18;
  const shadowX  =  dx * 20;
  const shadowY  =  dy * 20;

  card.style.transition = 'none';
  card.style.transform  =
    `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.06)`;
  card.style.boxShadow  =
    `${shadowX}px ${shadowY + 24}px 60px rgba(34,197,94,0.22), 0 0 40px rgba(34,197,94,0.10)`;
}

function onTiltLeave(card) {
  card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s ease';
  card.style.transform  = '';
  card.style.boxShadow  = '';
}

/* ──────────────────────────────────────────────────────────
   9c. PRODUCTS SECTION CANVAS PARTICLE NETWORK
   ────────────────────────────────────────────────────────── */
function initProductCanvasParticles() {
  const canvas = document.getElementById('products-canvas');
  if (!canvas || !canvas.getContext) return;

  const ctx     = canvas.getContext('2d');
  const section = document.getElementById('products');
  const COUNT   = window.innerWidth < 600 ? 25 : 45;
  const CONNECT = 120;
  let particles = [];
  let animId;

  function resize() {
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }

  function createParticle() {
    return {
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r:  Math.random() * 1.5 + 0.5,
      op: Math.random() * 0.18 + 0.05,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx = -p.vx;
      if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34,197,94,${p.op})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT) {
          ctx.beginPath();
          ctx.lineWidth   = 0.4;
          ctx.strokeStyle = `rgba(56,189,248,${0.08 * (1 - dist / CONNECT)})`;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  particles = Array.from({ length: COUNT }, createParticle);
  draw();

  let prodResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(prodResizeTimer);
    prodResizeTimer = setTimeout(() => {
      resize();
      particles = Array.from({ length: COUNT }, createParticle);
    }, 150);
  }, { passive: true });
}

/* ──────────────────────────────────────────────────────────
   10. SCROLL-TO-TOP BUTTON
   ────────────────────────────────────────────────────────── */
function initScrollTopBtn() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ──────────────────────────────────────────────────────────
   11. SMOOTH SCROLL FOR NAV LINKS
   ────────────────────────────────────────────────────────── */
function initSmoothScroll() {
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
   12. PAGE TRANSITION – 5-strip curtain wipe
   ────────────────────────────────────────────────────────── */
function initPageTransition() {
  // Build curtain; animate it away after the loader hides (via runEntryAnimations)
  const curtain = document.createElement('div');
  curtain.id = 'page-curtain';
  for (let i = 0; i < 5; i++) {
    const strip = document.createElement('div');
    strip.className = 'curtain-strip';
    curtain.appendChild(strip);
  }
  document.body.appendChild(curtain);
}

function animatePageCurtain() {
  const curtain = document.getElementById('page-curtain');
  if (!curtain) return;

  if (typeof gsap === 'undefined') {
    curtain.remove();
    return;
  }

  gsap.to('.curtain-strip', {
    yPercent: -105,
    duration:  1.1,
    ease:      'power4.inOut',
    stagger:   { each: 0.07, from: 'center' },
    onComplete: () => curtain.remove(),
  });
}

/* ──────────────────────────────────────────────────────────
   13. GALLERY HOVER (glow effect)
   ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(item, { boxShadow: '0 20px 50px rgba(34,197,94,0.3), 0 0 30px rgba(56,189,248,0.15)', duration: 0.4 });
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
   14. FLOATING BUTTONS ENTRANCE
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

/* ──────────────────────────────────────────────────────────
   15. MOUSE TRACKING SPOTLIGHT EFFECT
   ────────────────────────────────────────────────────────── */
function initMouseSpotlight() {
  const el = document.getElementById('spotlight');
  if (!el) return;

  /* Lerp-smoothed tracking so the spotlight glides rather than snaps */
  let targetX = -500, targetY = -500;
  let currentX = -500, currentY = -500;
  let rafId;

  const lerp = (a, b, t) => a + (b - a) * t;

  document.addEventListener('mousemove', e => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    /* Move spotlight off-screen smoothly when cursor leaves */
    targetX = -500;
    targetY = -500;
  });

  function tick() {
    currentX = lerp(currentX, targetX, 0.08);
    currentY = lerp(currentY, targetY, 0.08);
    /* Update the spotlight element directly to limit style recalculation scope */
    el.style.background =
      `radial-gradient(500px circle at ${currentX.toFixed(1)}px ${currentY.toFixed(1)}px, rgba(34,197,94,0.055), transparent 42%)`;
    rafId = requestAnimationFrame(tick);
  }

  tick();

  /* Cancel the loop on page unload to prevent memory leaks */
  window.addEventListener('pagehide', () => cancelAnimationFrame(rafId), { once: true });
}

