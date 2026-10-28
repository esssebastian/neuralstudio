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
    if (reduceMotion || root.dataset.mode === 'serious') return;
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

  // Serious mode (#mode-toggle, added next to the theme toggle): same studio, corporate costume.
  // Pages listen for the 'ns:mode' event to swap in their serious copy.
  const TIE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 3h5l-1.3 3.2 2.3 9.3L12 21l-3.5-5.5 2.3-9.3L9.5 3Z"/><path d="M10.8 6.2h2.4"/></svg>';
  const SMILE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.5 14a4 4 0 0 0 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/></svg>';
  const MODE_TXT = {
    en: { serious: 'Serious', fun: 'Fun', toSerious: 'Switch to serious mode', toFun: 'Switch back to fun mode',
      on: ['👔', 'Serious mode on.', 'Fun has been rescheduled to Q3.'], off: ['🎉', 'Fun mode restored.', 'Sorry about that.'] },
    es: { serious: 'Serio', fun: 'Chévere', toSerious: 'Cambiar a modo serio', toFun: 'Volver al modo chévere',
      on: ['👔', 'Modo serio activado.', 'La diversión quedó agendada para el Q3.'], off: ['🎉', 'Volvió la diversión.', 'Perdón por eso.'] }
  };
  const mt = k => MODE_TXT[root.lang === 'es' ? 'es' : 'en'][k];
  let modeBtn = null;
  if (themeBtn) {
    modeBtn = document.createElement('button');
    modeBtn.type = 'button'; modeBtn.id = 'mode-toggle'; modeBtn.className = 'icon-btn mode-btn';
    themeBtn.before(modeBtn);
  }
  function labelMode() {
    if (!modeBtn) return;
    const serious = root.dataset.mode === 'serious';
    modeBtn.innerHTML = (serious ? SMILE : TIE) + '<span class="mode-txt">' + mt(serious ? 'fun' : 'serious') + '</span>';
    modeBtn.setAttribute('aria-label', mt(serious ? 'toFun' : 'toSerious'));
    modeBtn.setAttribute('aria-pressed', String(serious));
    modeBtn.title = mt(serious ? 'toFun' : 'toSerious');
  }
  let toast = null, toastTimer = null;
  function say([emoji, title, sub]) {
    if (!toast) {
      toast = document.createElement('div'); toast.className = 'ns-toast'; toast.setAttribute('role', 'status');
      toast.innerHTML = '<span class="ns-toast-emoji" aria-hidden="true"></span><strong></strong><span class="ns-toast-sub"></span>';
      toast.addEventListener('click', () => toast.classList.remove('show'));
      document.body.appendChild(toast);
    }
    toast.children[0].textContent = emoji; toast.children[1].textContent = title; toast.children[2].textContent = sub;
    toast.classList.remove('show'); void toast.offsetWidth; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  labelMode();
  new MutationObserver(labelMode).observe(root, { attributes: true, attributeFilter: ['lang'] });
  if (modeBtn) modeBtn.addEventListener('click', e => {
    const serious = root.dataset.mode !== 'serious';
    if (serious) root.dataset.mode = 'serious'; else delete root.dataset.mode;
    labelMode();
    document.dispatchEvent(new CustomEvent('ns:mode', { detail: { serious } }));
    say(mt(serious ? 'on' : 'off'));
    if (!serious) burst(e.clientX, e.clientY, 110);
    if (window.fbq) fbq('trackCustom', 'SeriousMode', { on: serious });
  });

  // Reveal on scroll
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // Anything with data-confetti bursts on click
  document.querySelectorAll('[data-confetti]').forEach(el => el.addEventListener('click', e => burst(e.clientX, e.clientY)));


  // Promo videos: muted autoplay while on screen, tap the pill for sound
  const SPK_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  const SPK_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="m16 9 5 6M21 9l-5 6"/></svg>';
  const es = () => root.lang === 'es';
  document.querySelectorAll('.promo').forEach(box => {
    const v = box.querySelector('video');
    const sound = box.querySelector('.promo-sound');
    const play = box.querySelector('.promo-play');
    const label = () => { sound.innerHTML = (v.muted ? SPK_OFF : SPK_ON) + '<span>' + (v.muted ? (es() ? 'Activar sonido' : 'Sound on') : (es() ? 'Silenciar' : 'Mute')) + '</span>'; sound.setAttribute('aria-pressed', String(!v.muted)); };
    const sync = () => box.classList.toggle('paused', v.paused);
    v.muted = true; label(); sync();
    v.addEventListener('play', sync); v.addEventListener('pause', sync);
    sound.addEventListener('click', () => {
      v.muted = !v.muted; label();
      if (v.paused) v.play().catch(() => {});
      if (!v.muted && window.fbq) fbq('trackCustom', 'PromoSound', { video: box.dataset.promo });
    });
    play.addEventListener('click', () => { v.play().catch(() => {}); });
    v.addEventListener('click', () => { v.paused ? v.play().catch(() => {}) : v.pause(); });
    if (reduceMotion) return;
    new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) v.play().catch(sync);
      else { v.pause(); if (!v.muted) { v.muted = true; label(); } }
    }), { threshold: 0.45 }).observe(box);
    new MutationObserver(label).observe(root, { attributes: true, attributeFilter: ['lang'] });
  });

  window.NS = { burst, store, reduceMotion, labelTheme };
})();
