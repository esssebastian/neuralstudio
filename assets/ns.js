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

  // Mac downloads are newsletter-gated: [data-gate="slug"] opens a signup dialog; /api/download subscribes
  // the email and returns the installer link, which then starts downloading.
  const GATE_APPS = {
    'ghost-notes': ['Ghost Notes', 'ghost-notes.png'],
    'nerd-squirrel': ['Nerd Squirrel', 'nerd-squirrel.png'],
    'mochi-days': ['Mochi Days', 'mochi-days.png'],
    'posture-panda': ['Posture Panda', 'dr-panda.png'],
    'fix-my-face': ['Fix My Face', 'fix-my-face.png']
  };
  const GATE_TXT = {
    en: { title: n => 'Get ' + n + ' for free', sub: 'Join the Neural Studio newsletter and your download starts right away. New apps and behind the scenes, never spam.',
      ph: 'you@email.com', btn: 'Download for Mac', busy: 'One sec…', terms: 'By downloading you join the Neural Studio newsletter. Unsubscribe anytime.',
      bad: 'That email doesn’t look right.', fail: 'Something went wrong. Please try again.',
      done: 'You’re in! 🎉', doneSub: n => 'Your download is starting. Open the .dmg and drag ' + n + ' into Applications.', again: 'Didn’t start? Download it here', close: 'Close' },
    es: { title: n => 'Descarga ' + n + ' gratis', sub: 'Únete al newsletter de Neural Studio y tu descarga empieza de una. Apps nuevas y lo que pasa detrás, nada de spam.',
      ph: 'tu@email.com', btn: 'Descargar para Mac', busy: 'Un segundo…', terms: 'Al descargar te unes al newsletter de Neural Studio. Te puedes salir cuando quieras.',
      bad: 'Ese email no se ve bien.', fail: 'Algo salió mal. Intenta de nuevo.',
      done: '¡Listo! 🎉', doneSub: n => 'Tu descarga está empezando. Abre el .dmg y arrastra ' + n + ' a Aplicaciones.', again: '¿No empezó? Descárgala aquí', close: 'Cerrar' }
  };
  let gateEl = null, gateSlug = null, gateLast = null;
  function gt() { return GATE_TXT[root.lang === 'es' ? 'es' : 'en']; }
  function buildGate() {
    gateEl = document.createElement('div');
    gateEl.className = 'gate';
    gateEl.hidden = true;
    gateEl.innerHTML = '<div class="gate-card" role="dialog" aria-modal="true" aria-labelledby="gate-title">' +
      '<button type="button" class="gate-x">×</button>' +
      '<img class="gate-icon" alt="" width="84" height="84">' +
      '<div class="gate-form"><h2 id="gate-title"></h2><p class="gate-sub"></p>' +
      '<form novalidate><input class="field" type="email" name="email" required autocomplete="email">' +
      '<button type="submit" class="btn btn-violet"></button></form>' +
      '<p class="gate-msg" role="alert"></p><p class="gate-terms"></p></div>' +
      '<div class="gate-done" hidden><h2></h2><p></p><a class="text-link" href="#"></a></div></div>';
    document.body.appendChild(gateEl);
    gateEl.addEventListener('click', e => { if (e.target === gateEl) closeGate(); });
    gateEl.querySelector('.gate-x').addEventListener('click', closeGate);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !gateEl.hidden) closeGate(); });
    gateEl.querySelector('form').addEventListener('submit', submitGate);
  }
  function openGate(slug, opener) {
    if (!gateEl) buildGate();
    gateSlug = slug; gateLast = opener;
    const [name, icon] = GATE_APPS[slug], t = gt();
    gateEl.querySelector('.gate-icon').src = '/images/apps/' + icon;
    gateEl.querySelector('#gate-title').textContent = t.title(name);
    gateEl.querySelector('.gate-sub').textContent = t.sub;
    gateEl.querySelector('.gate-terms').textContent = t.terms;
    gateEl.querySelector('.gate-x').setAttribute('aria-label', t.close);
    const input = gateEl.querySelector('input'), btn = gateEl.querySelector('form .btn');
    input.placeholder = t.ph; input.value = store.get('ns-sub-email') || '';
    btn.textContent = t.btn; btn.disabled = false;
    gateEl.querySelector('.gate-msg').textContent = '';
    gateEl.querySelector('.gate-form').hidden = false;
    gateEl.querySelector('.gate-done').hidden = true;
    gateEl.hidden = false;
    document.documentElement.classList.add('gate-open');
    requestAnimationFrame(() => { gateEl.classList.add('show'); input.focus(); });
  }
  function closeGate() {
    gateEl.classList.remove('show');
    document.documentElement.classList.remove('gate-open');
    setTimeout(() => { gateEl.hidden = true; }, 200);
    if (gateLast) gateLast.focus();
  }
  async function submitGate(e) {
    e.preventDefault();
    const t = gt(), input = gateEl.querySelector('input'), btn = gateEl.querySelector('form .btn'), msg = gateEl.querySelector('.gate-msg');
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.textContent = t.bad; input.focus(); return; }
    btn.disabled = true; btn.textContent = t.busy; msg.textContent = '';
    try {
      const r = await fetch('/api/download', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, app: gateSlug, lang: root.lang === 'es' ? 'es' : 'en' }) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.url) throw new Error(data.error || r.status);
      store.set('ns-sub-email', email);
      const name = GATE_APPS[gateSlug][0], done = gateEl.querySelector('.gate-done');
      done.querySelector('h2').textContent = t.done;
      done.querySelector('p').textContent = t.doneSub(name);
      const again = done.querySelector('a'); again.textContent = t.again; again.href = data.url;
      gateEl.querySelector('.gate-form').hidden = true; done.hidden = false;
      const r2 = gateEl.querySelector('.gate-card').getBoundingClientRect();
      burst(r2.left + r2.width / 2, r2.top + 40, 120);
      if (window.fbq) { fbq('track', 'Lead', { content_name: gateSlug }); fbq('trackCustom', 'AppDownload', { app: gateSlug + '-mac' }); }
      window.location.href = data.url;
    } catch (err) {
      msg.textContent = String(err.message) === 'email' ? t.bad : t.fail;
      btn.disabled = false; btn.textContent = t.btn;
    }
  }
  document.querySelectorAll('[data-gate]').forEach(a => {
    if (!GATE_APPS[a.dataset.gate]) return;
    a.addEventListener('click', e => { e.preventDefault(); openGate(a.dataset.gate, a); });
  });

  window.NS = { burst, store, reduceMotion, labelTheme };
})();
