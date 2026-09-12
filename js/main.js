/* ================================================================
   YETI RACING — MAIN JAVASCRIPT
   Formula Student Team | CUSAT
   ================================================================ */

'use strict';

/* ────────────────────────────────────────────
   LOADING SCREEN
──────────────────────────────────────────── */
const loader = document.getElementById('loader');
const loaderPct = document.querySelector('.loader-pct');
let pct = 0;
const pctTimer = setInterval(() => {
  pct = Math.min(pct + Math.floor(Math.random() * 12) + 3, 99);
  if (loaderPct) loaderPct.textContent = pct + '%';
}, 80);

window.addEventListener('load', () => {
  clearInterval(pctTimer);
  if (loaderPct) loaderPct.textContent = '100%';
  setTimeout(() => {
    loader?.classList.add('done');
  }, 500);
});

/* ────────────────────────────────────────────
   CUSTOM CURSOR (desktop only)
──────────────────────────────────────────── */
if (window.matchMedia('(pointer:fine)').matches) {
  const dot  = document.querySelector('.c-dot');
  const ring = document.querySelector('.c-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  const moveCursor = () => {
    if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(moveCursor);
  };
  moveCursor();

  document.querySelectorAll('a, button, .team-card, .ach-card, .g-item').forEach(el => {
    el.addEventListener('mouseenter', () => { dot?.classList.add('hovering'); ring?.classList.add('hovering'); });
    el.addEventListener('mouseleave', () => { dot?.classList.remove('hovering'); ring?.classList.remove('hovering'); });
  });
}

/* ────────────────────────────────────────────
   PARTICLES CANVAS (floating red sparks)
──────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function spawnParticles() {
    particles = [];
    const n = Math.floor(W / 20);
    for (let i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.3,
        vx:(Math.random() - 0.5) * 0.25,
        vy:(Math.random() - 0.5) * 0.25,
        a: Math.random() * 0.38 + 0.05,
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(225,6,0,${p.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  resize(); spawnParticles(); draw();
  window.addEventListener('resize', () => { resize(); spawnParticles(); });
})();

/* ────────────────────────────────────────────
   NAVBAR — scroll class + active link
──────────────────────────────────────────── */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// Active page link
const currentFile = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mob-menu a').forEach(a => {
  const href = a.getAttribute('href') || '';
  if (href === currentFile || (currentFile === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// Mobile hamburger
const ham     = document.querySelector('.ham');
const mobMenu = document.querySelector('.mob-menu');
ham?.addEventListener('click', () => {
  ham.classList.toggle('open');
  mobMenu?.classList.toggle('open');
});
mobMenu?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => { ham?.classList.remove('open'); mobMenu.classList.remove('open'); });
});

/* ────────────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
──────────────────────────────────────────── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); } });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.rev, .rev-l, .rev-r').forEach(el => revObs.observe(el));

/* ────────────────────────────────────────────
   COUNTER ANIMATION
──────────────────────────────────────────── */
function animCount(el, target, duration = 2200) {
  const suffix = el.dataset.suffix || '';
  const start  = performance.now();
  (function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const v = Math.round(easeOutCubic(t) * target);
    el.textContent = v + suffix;
    if (t < 1) requestAnimationFrame(tick);
  })(start);
}
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = +e.target.dataset.count;
      animCount(e.target, target);
      countObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

/* ────────────────────────────────────────────
   GALLERY FILTER
──────────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.f-btn');
const galleryItems = document.querySelectorAll('.g-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    const f = btn.dataset.f;
    galleryItems.forEach(item => {
      const show = f === 'all' || item.dataset.cat === f;
      item.style.display = show ? '' : 'none';
      if (show) item.style.animation = 'fadeIn 0.4s ease';
    });
  });
});

/* F1 Car Animation removed */

/* ────────────────────────────────────────────
   SMOOTH EXTERNAL LINK PREVENTION
──────────────────────────────────────────── */
// Page transition fade for internal nav
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href') || '';
  if (href.startsWith('#') || href.startsWith('http') ||
      href.startsWith('mailto') || href.startsWith('tel')) return;

  link.addEventListener('click', e => {
    e.preventDefault();
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s';
    setTimeout(() => { window.location.href = href; }, 300);
  });
});

// Restore opacity on page load
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s';
setTimeout(() => { document.body.style.opacity = '1'; }, 50);
