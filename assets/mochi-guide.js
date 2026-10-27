// "Follow Mochi": the pixel Mochi from our game walks ahead of the visitor down the page,
// like the white rabbit, with speech bubbles that change as they scroll and a party at the end.
// Sprite: /images/mochi-sprite.png, 16x16 frames, 6 columns (idle0, idle1, walk0..3),
// rows: 0 facing the viewer (walking down), 1 facing away (walking up), 2 side.
(function () {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = window.NS || {};

  const COPY = {
    en: {
      start: 'Psst… follow Mochi till the end 👇',
      a: 'This way! Don\'t stop 🐾',
      b: 'Halfway there. You\'re doing great!',
      c: 'Almost there… it\'s worth it!',
      end: 'You made it! 🎉 Now let\'s build something.',
      up: 'Hey, wrong way! 😅',
      nudge: 'Come on, scroll down! I\'ll show you the way 👇',
      label: 'Mochi, your guide. Scroll down to follow.',
      close: 'Hide Mochi'
    },
    es: {
      start: 'Psst… sigue a Mochi hasta el final 👇',
      a: '¡Por aquí! No pares 🐾',
      b: 'Vamos por la mitad. ¡Vas muy bien!',
      c: 'Ya casi… ¡vale la pena!',
      end: '¡Llegaste! 🎉 Ahora construyamos algo.',
      up: '¡Oye, por ahí no! 😅',
      nudge: '¡Vamos, baja! Yo te muestro el camino 👇',
      label: 'Mochi, tu guía. Baja para seguirlo.',
      close: 'Ocultar a Mochi'
    }
  };
  const t = k => (COPY[root.lang === 'es' ? 'es' : 'en'])[k];

  let hidden = false;
  try { hidden = sessionStorage.getItem('ns-mochi-hidden') === '1'; } catch (e) {}
  if (hidden) return;

  const css = `
  .mg{position:fixed;z-index:45;right:22px;top:0;pointer-events:none;transition:opacity .3s}
  .mg-track{position:fixed;z-index:44;right:53px;top:110px;bottom:90px;width:0;border-right:3px dashed rgba(124,92,252,.35);pointer-events:none}
  [data-theme="dark"] .mg-track{border-color:rgba(157,133,255,.35)}
  .mg-trail{position:fixed;z-index:44;right:53px;top:110px;width:0;border-right:3px dashed var(--violet);pointer-events:none}
  .mg.intro{transition:transform 1.6s linear}
  .mg-sprite{width:64px;height:64px;background:url(/images/mochi-sprite.png) 0 0/384px 192px no-repeat;image-rendering:pixelated;image-rendering:crisp-edges;
    filter:drop-shadow(3px 3px 0 rgba(28,22,49,.25));pointer-events:auto;cursor:pointer;transition:transform .25s cubic-bezier(.2,.9,.3,1.4)}
  .mg-sprite:hover{transform:scale(1.12) rotate(-4deg)}
  .mg.jump .mg-sprite{animation:mg-jump .5s ease-out 3}
  @keyframes mg-jump{0%,100%{transform:translateY(0)}40%{transform:translateY(-22px)}}
  .mg-bubble{position:absolute;right:76px;top:6px;width:max-content;max-width:230px;pointer-events:auto;
    font-family:var(--body);font-weight:800;font-size:15px;line-height:1.3;color:var(--ink);
    background:#fff;border:3px solid var(--ink);border-radius:18px;padding:10px 30px 10px 14px;box-shadow:4px 4px 0 var(--ink);
    transform-origin:right center;transition:opacity .25s, transform .25s cubic-bezier(.2,.9,.3,1.4)}
  .mg-bubble::after{content:"";position:absolute;right:-11px;top:16px;width:14px;height:14px;background:#fff;border-right:3px solid var(--ink);border-top:3px solid var(--ink);transform:rotate(45deg)}
  .mg-bubble.off{opacity:0;transform:scale(.6);pointer-events:none}
  .mg-bubble.end{background:var(--sun)}
  .mg-bubble.end::after{background:var(--sun)}
  .mg-x{position:absolute;right:6px;top:4px;border:0;background:none;font:800 15px/1 var(--body);color:var(--ink);opacity:.5;cursor:pointer;padding:4px}
  .mg-x:hover{opacity:1}
  @media (max-width:1299px){
    .mg-track,.mg-trail{display:none}
    .mg{top:auto!important;bottom:14px;right:12px}
    .mg-sprite{width:52px;height:52px;background-size:312px 156px}
    .mg-bubble{right:62px;top:2px;font-size:14px;max-width:200px}
  }`;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  const track = document.createElement('div'); track.className = 'mg-track'; track.setAttribute('aria-hidden', 'true');
  const trail = document.createElement('div'); trail.className = 'mg-trail'; trail.setAttribute('aria-hidden', 'true');
  const box = document.createElement('div'); box.className = 'mg';
  box.innerHTML = '<div class="mg-bubble off" role="status" aria-live="polite"><span class="mg-text"></span><button type="button" class="mg-x">×</button></div><div class="mg-sprite" role="img"></div>';
  document.body.append(track, trail, box);
  const sprite = box.querySelector('.mg-sprite');
  const bubble = box.querySelector('.mg-bubble');
  const text = box.querySelector('.mg-text');
  const closeBtn = box.querySelector('.mg-x');

  // ── sprite animation ──
  let row = 0, walking = false, frame = 0, stopTimer = null;
  function draw() {
    const size = sprite.offsetWidth;
    const col = walking ? 2 + (frame % 4) : Math.floor(frame / 5) % 2;
    sprite.style.backgroundPosition = `${-col * size}px ${-row * size}px`;
  }
  if (!reduceMotion) setInterval(() => { frame++; draw(); }, 125);

  // ── bubble ──
  let shown = null, hideTimer = null, ended = false;
  function say(key, stay) {
    shown = key;
    text.textContent = t(key);
    bubble.classList.toggle('end', key === 'end');
    bubble.classList.remove('off');
    clearTimeout(hideTimer);
    if (!stay) hideTimer = setTimeout(() => bubble.classList.add('off'), 3800);
  }
  function labels() {
    sprite.setAttribute('aria-label', t('label'));
    closeBtn.setAttribute('aria-label', t('close'));
    if (shown && !bubble.classList.contains('off')) text.textContent = t(shown);
  }
  labels();
  new MutationObserver(labels).observe(root, { attributes: true, attributeFilter: ['lang'] });

  // ── scroll ──
  let lastY = window.scrollY, milestone = -1;
  const keys = ['start', 'a', 'b', 'c'];
  function progress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 1;
  }
  let lead = 0;            // how far Mochi walked ahead on its own (desktop trail)
  const LEAD = 120;
  function place() {
    const p = progress();
    if (innerWidth >= 1300) {
      const top = 110, bottom = innerHeight - 90 - sprite.offsetHeight;
      const y = top + lead + p * Math.max(0, bottom - top - lead);
      box.style.top = y + 'px';
      trail.style.height = Math.max(0, y - top + 8) + 'px';
    }
    return p;
  }
  function onScroll() {
    const y = scrollY, dy = y - lastY; lastY = y;
    const p = place();
    if (Math.abs(dy) > 1 && !reduceMotion) {
      walking = true; row = dy > 0 ? 0 : 1; draw();
      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => { walking = false; row = 0; draw(); }, 180);
    }
    if (p > 0.97) {
      if (!ended) {
        ended = true; say('end', true);
        box.classList.add('jump'); setTimeout(() => box.classList.remove('jump'), 1600);
        const r = sprite.getBoundingClientRect();
        if (NS.burst) NS.burst(r.left + r.width / 2, r.top + r.height / 2, 90);
        if (window.fbq) fbq('trackCustom', 'MochiFinished');
      }
      return;
    }
    if (ended && p < 0.9) { ended = false; bubble.classList.add('off'); }
    if (dy < -40 && shown !== 'up' && p > 0.05) { say('up'); return; }
    const m = Math.min(3, Math.floor(p * 4));
    if (m > milestone) { milestone = m; say(keys[m]); }
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { draw(); place(); });

  // tap Mochi: a little hop and the current hint again
  sprite.addEventListener('click', () => {
    box.classList.add('jump'); setTimeout(() => box.classList.remove('jump'), 1600);
    say(ended ? 'end' : keys[Math.max(0, milestone)], ended);
  });
  closeBtn.addEventListener('click', () => {
    box.style.opacity = '0'; track.remove(); trail.remove();
    try { sessionStorage.setItem('ns-mochi-hidden', '1'); } catch (e) {}
    setTimeout(() => box.remove(), 300);
  });

  // ── intro: Mochi walks down on its own, stops, then invites the visitor to follow ──
  let lastMove = Date.now();
  addEventListener('scroll', () => { lastMove = Date.now(); }, { passive: true });
  function hello() { if (milestone < 0) { milestone = 0; say('start'); } }
  function intro() {
    if (reduceMotion || scrollY > 40) { lead = LEAD; place(); hello(); return; }
    walking = true; row = 0; draw();
    if (innerWidth >= 1300) {
      const t0 = performance.now(), dur = 1600;
      const step = now => {
        const k = Math.min(1, (now - t0) / dur);
        lead = LEAD * k; place();
        if (k < 1) requestAnimationFrame(step);
        else { walking = false; draw(); setTimeout(hello, 250); }
      };
      requestAnimationFrame(step);
    } else {
      box.style.transform = 'translateY(-38vh)';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        box.classList.add('intro'); box.style.transform = 'translateY(0)';
      }));
      setTimeout(() => { box.classList.remove('intro'); box.style.transform = ''; walking = false; draw(); setTimeout(hello, 250); }, 1650);
    }
  }
  // nudge visitors who stay put
  setInterval(() => {
    if (ended || milestone > 0 || Date.now() - lastMove < 7000 || shown === 'nudge' && !bubble.classList.contains('off')) return;
    lastMove = Date.now();
    box.classList.add('jump'); setTimeout(() => box.classList.remove('jump'), 1600);
    say('nudge');
  }, 1000);

  draw(); place();
  setTimeout(intro, 700);
})();
