// Neural Studio shared behaviour: theme toggle, scroll reveal, confetti.
// Pages set data-theme on <html> before paint with the inline snippet in <head>.
(function () {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  document.body.classList.remove('no-js');

  // Confetti burst, like a check-in in the apps
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let bits = [], running = false;
  const colors = ['#7c5cfc', '#ffd65c', '#ffc6e4', '#c6f0d8', '#cfe9f7', '#1c1631'];
  function size() { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; }
  size(); addEventListener('resize', size);
  function tick() {
    const d = devicePixelRatio;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bits = bits.filter(b => b.life-- > 0);
    bits.forEach(b => {
      b.vy += .35; b.vx *= .98; b.x += b.vx; b.y += b.vy; b.r += b.vr;
      ctx.save(); ctx.translate(b.x * d, b.y * d); ctx.rotate(b.r);
      ctx.globalAlpha = Math.min(1, b.life / 30); ctx.fillStyle = b.c;
      ctx.fillRect(-b.w * d / 2, -b.h * d / 2, b.w * d, b.h * d); ctx.restore();
    });
    if (bits.length) requestAnimationFrame(tick); else running = false;
  }
  function burst(x, y, count) {
    if (reduceMotion) return;
    x = x || innerWidth / 2; y = y || innerHeight / 2;
    for (let i = 0; i < (count || 70); i++) {
      const a = Math.random() * Math.PI * 2, s = 4 + Math.random() * 8;
      bits.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6, r: Math.random() * 6.3, vr: (Math.random() - .5) * .4,
        w: 6 + Math.random() * 6, h: 4 + Math.random() * 4, c: colors[i % colors.length], life: 90 });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  // Theme toggle (#theme-toggle); follows the system until the visitor picks
  const themeBtn = document.getElementById('theme-toggle');
  function labelTheme() {
    if (!themeBtn) return;
    const dark = root.dataset.theme === 'dark';
    const es = root.lang === 'es';
    themeBtn.setAttribute('aria-label', dark ? (es ? 'Cambiar a modo claro' : 'Switch to light mode') : (es ? 'Cambiar a modo oscuro' : 'Switch to dark mode'));
  }
  labelTheme();
  if (themeBtn) themeBtn.addEventListener('click', e => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next; store.set('ns-theme', next); labelTheme();
    burst(e.clientX, e.clientY);
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (store.get('ns-theme')) return;
    root.dataset.theme = e.matches ? 'dark' : 'light'; labelTheme();
  });

  // Reveal on scroll
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // Anything with data-confetti bursts on click
  document.querySelectorAll('[data-confetti]').forEach(el => el.addEventListener('click', e => burst(e.clientX, e.clientY)));

  window.NS = { burst, store, reduceMotion, labelTheme };
})();
