/* ============================================================
   PIZZA SVG
   ============================================================ */
function makePizza(slices, eaten = [], size = 300) {
  const cx = 100, cy = 100;
  const crustR = 95, cheeseR = 85;
  const sliceAngle = 360 / slices;
  const eatenSet = new Set(eaten);
  let s = '';

  s += `<ellipse cx="${cx}" cy="${cy + crustR + 4}" rx="${crustR * 0.85}" ry="7" fill="rgba(120,70,20,0.13)"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${crustR}" fill="#d99a3a"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${crustR - 4}" fill="#e8b86a"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${cheeseR}" fill="#fcd34d"/>`;

  for (let i = 0; i < slices; i++) {
    if (!eatenSet.has(i)) continue;
    const a1 = (i * sliceAngle - 90) * Math.PI / 180;
    const a2 = ((i + 1) * sliceAngle - 90) * Math.PI / 180;
    const x1 = cx + cheeseR * Math.cos(a1);
    const y1 = cy + cheeseR * Math.sin(a1);
    const x2 = cx + cheeseR * Math.cos(a2);
    const y2 = cy + cheeseR * Math.sin(a2);
    const largeArc = sliceAngle > 180 ? 1 : 0;
    s += `<path d="M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${cheeseR} ${cheeseR} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z" fill="#faf6ee" stroke="#ddd0b8" stroke-width="1" stroke-dasharray="4,3"/>`;
  }

  if (slices > 1) {
    for (let i = 0; i < slices; i++) {
      const a = (i * sliceAngle - 90) * Math.PI / 180;
      const x = cx + crustR * Math.cos(a);
      const y = cy + crustR * Math.sin(a);
      s += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}" stroke="#d99a3a" stroke-width="1.6" stroke-linecap="round"/>`;
    }
  }

  const peps = [];
  if (slices === 1) {
    const scatter = [[100,52],[66,78],[134,78],[76,126],[124,126],[100,152],[54,102],[146,102]];
    scatter.forEach(([x, y]) => {
      if (Math.hypot(x - cx, y - cy) < cheeseR - 9) peps.push([x, y]);
    });
  } else {
    for (let i = 0; i < slices; i++) {
      if (eatenSet.has(i)) continue;
      const mid = ((i + 0.5) * sliceAngle - 90) * Math.PI / 180;
      if (slices <= 4) {
        peps.push([cx + 34 * Math.cos(mid), cy + 34 * Math.sin(mid)]);
        peps.push([cx + 64 * Math.cos(mid), cy + 64 * Math.sin(mid)]);
      } else {
        peps.push([cx + 48 * Math.cos(mid), cy + 48 * Math.sin(mid)]);
      }
    }
  }
  peps.forEach(([x, y]) => {
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.5" fill="#dc4a4a"/>`;
    s += `<circle cx="${(x - 1.6).toFixed(1)}" cy="${(y - 1.6).toFixed(1)}" r="2.2" fill="#b83434" opacity="0.55"/>`;
  });

  s += `<circle cx="${cx}" cy="${cy}" r="2.6" fill="#d99a3a" opacity="0.55"/>`;
  return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" style="display:block;max-width:100%;height:auto">${s}</svg>`;
}

/* ============================================================
   HELPERS
   ============================================================ */
function mixedHTML(whole, num, den, size = '2.2rem') {
  return `<span class="mixed-display" style="font-size:${size}"><span class="whole-num">${whole}</span><span class="mf-frac"><span class="mf-num">${num}</span><span class="mf-bar"></span><span class="mf-den">${den}</span></span></span>`;
}

function fracHTML(num, den, size = '1.3rem', color = 'var(--primary)') {
  return `<span class="big-frac" style="font-size:${size};color:${color}"><span class="num">${num}</span><span class="bar"></span><span class="den">${den}</span></span>`;
}

function segBar(total, segs) {
  let html = '<div class="seg-bar">';
  for (let i = 0; i < total; i++) {
    const s = segs[i] || '';
    html += `<div class="seg${s ? ' ' + s : ''}"></div>`;
  }
  html += '</div>';
  return html;
}

function makeMixedVisual(whole, num, den, size = 60) {
  let html = '<div class="mixed-visual">';
  for (let i = 0; i < whole; i++) {
    html += `<div class="mv-pizza">${makePizza(1, [], size)}</div>`;
  }
  if (num > 0) {
    const eaten = [];
    for (let i = num; i < den; i++) eaten.push(i);
    html += `<div class="mv-pizza">${makePizza(den, eaten, size)}</div>`;
  }
  html += '</div>';
  return html;
}

function makeSlice(den, size = 45) {
  const eaten = [];
  for (let i = 0; i < den - 1; i++) eaten.push(i);
  return makePizza(den, eaten, size);
}

function makeWhole(size = 55) {
  return makePizza(1, [], size);
}

/* ============================================================
   HERO PIZZA
   ============================================================ */
document.getElementById('heroPizza').insertAdjacentHTML('beforeend', makePizza(8, [], 340));

/* ============================================================
   STORY
   ============================================================ */
const storySteps = [
  { slices: 1, eaten: [], frac: '1', title: 'Ціла піца', text: 'Ось вона — одна ціла піца. Це число 1. Поки ми її не різали, вона одна.' },
  { slices: 2, eaten: [], frac: '2/2', title: 'Ріжемо навпіл', text: 'Розрізали піцу на 2 рівні шматки. Тепер у нас 2 шматки з 2. Кажемо: 2/2. Але це все ще ціла піца! 2/2 = 1.' },
  { slices: 2, eaten: [1], frac: '1/2', title: "З'їли один шматок", text: "Один шматок з'їли. Залишився 1 шматок з 2. Кажемо: 1/2 — це половина піци." },
  { slices: 4, eaten: [2, 3], frac: '2/4', title: 'Ріжемо ще раз', text: "Порізали піцу на 4 частини. З'їдено 2 з 4. Залишилось 2 шматки. Кажемо: 2/4. Але це ж знову половина! 1/2 = 2/4." },
  { slices: 8, eaten: [4, 5, 6, 7], frac: '4/8', title: 'І ще раз!', text: "Порізали на 8 частин. З'їдено 4, залишилось 4. Кажемо: 4/8. І це знову половина! 1/2 = 2/4 = 4/8." },
  { slices: 8, eaten: [4, 5, 6, 7], frac: '50%', title: 'А тепер відсотки!', text: 'Половину піци можна записати ще й так: 50%. Відсоток — це просто дріб зі знаменником 100. 1/2 = 50/100 = 50%.' }
];

let storyIdx = 0;

function renderFracHTML(fracStr) {
  if (fracStr.includes('/')) {
    const [num, den] = fracStr.split('/');
    return `<span class="big-frac"><span class="num">${num}</span><span class="bar"></span><span class="den">${den}</span></span>`;
  }
  return `<span class="big-frac"><span class="whole">${fracStr}</span></span>`;
}

function renderStory() {
  const step = storySteps[storyIdx];
  document.getElementById('pizzaStage').innerHTML = makePizza(step.slices, step.eaten, 320);
  document.getElementById('storyFrac').innerHTML = renderFracHTML(step.frac);
  document.getElementById('storyStepNum').textContent = `Крок ${storyIdx + 1} з ${storySteps.length}`;
  document.getElementById('storyTitle').textContent = step.title;
  document.getElementById('storyText').textContent = step.text;

  const prev = document.getElementById('storyPrev');
  const next = document.getElementById('storyNext');
  prev.disabled = storyIdx === 0;
  if (storyIdx === storySteps.length - 1) {
    next.disabled = true;
    next.textContent = 'Готово! ✓';
  } else {
    next.disabled = false;
    next.textContent = 'Далі →';
  }

  document.getElementById('storyDots').innerHTML = storySteps.map((_, i) =>
    `<i class="${i === storyIdx ? 'on' : ''}"></i>`
  ).join('');
}

document.getElementById('storyNext').addEventListener('click', () => {
  if (storyIdx < storySteps.length - 1) { storyIdx++; renderStory(); }
});
document.getElementById('storyPrev').addEventListener('click', () => {
  if (storyIdx > 0) { storyIdx--; renderStory(); }
});
renderStory();

/* ============================================================
   PARTS
   ============================================================ */
document.getElementById('partsPizza').innerHTML = makePizza(4, [3], 280);

/* ============================================================
   EQUIVALENT FRACTIONS
   ============================================================ */
document.getElementById('eqRow').innerHTML = `
  <div class="eq-item">${makePizza(2, [1], 130)}<div class="eq-cap">1/2</div></div>
  <div class="eq-equals">=</div>
  <div class="eq-item">${makePizza(4, [2, 3], 130)}<div class="eq-cap">2/4</div></div>
  <div class="eq-equals">=</div>
  <div class="eq-item">${makePizza(8, [4, 5, 6, 7], 130)}<div class="eq-cap">4/8</div></div>
`;

/* ============================================================
   DIFFERENT DENOMINATORS — VISUALS
   ============================================================ */
document.getElementById('diffWhy').innerHTML = `
  <div style="text-align:center">
    ${makePizza(2, [1], 90)}
    <div style="font-weight:900;margin-top:6px;font-size:.9rem;color:var(--orange)">1/2</div>
  </div>
  <div style="font-size:1.4rem;font-weight:900;color:var(--muted)">+</div>
  <div style="text-align:center">
    ${makePizza(3, [1, 2], 90)}
    <div style="font-weight:900;margin-top:6px;font-size:.9rem;color:var(--primary)">1/3</div>
  </div>
  <div style="font-size:1rem;font-weight:900;color:var(--muted);max-width:220px;text-align:center">
    Різні шматки — не можна просто додати верхні числа!
  </div>
`;

document.getElementById('diffAddVis').innerHTML = `
  <div class="seg-stack">
    <div>
      <div class="seg-cap" style="color:var(--orange)">1/2 = 3/6</div>
      ${segBar(6, ['filled a','filled a','filled a','','',''])}
    </div>
    <div class="seg-op">+</div>
    <div>
      <div class="seg-cap" style="color:var(--primary)">1/3 = 2/6</div>
      ${segBar(6, ['filled b','filled b','','','',''])}
    </div>
    <div class="seg-op">=</div>
    <div>
      <div class="seg-cap" style="color:var(--mint)">5/6</div>
      ${segBar(6, ['filled a','filled a','filled a','filled b','filled b',''])}
    </div>
  </div>
`;

/* Віднімання — БЕЗ перекреслювання: показуємо лише те, що залишилось */
document.getElementById('diffSubVis').innerHTML = `
  <div class="seg-stack">
    <div>
      <div class="seg-cap" style="color:var(--orange)">3/4 = 9/12</div>
      ${segBar(12, ['filled r','filled r','filled r','filled r','filled r','filled r','filled r','filled r','filled r','','',''])}
    </div>
    <div class="seg-op">−</div>
    <div>
      <div class="seg-cap" style="color:var(--primary)">1/3 = 4/12</div>
      ${segBar(12, ['filled a','filled a','filled a','filled a','','','','','','','',''])}
    </div>
    <div class="seg-op">=</div>
    <div>
      <div class="seg-cap" style="color:var(--mint)">5/12</div>
      ${segBar(12, ['filled r','filled r','filled r','filled r','filled r','','','','','','',''])}
    </div>
  </div>
`;

document.getElementById('diffMixedOp').innerHTML = `
  ${mixedHTML(1, 1, 2, '1.9rem')}
  <span class="op-sign">+</span>
  ${mixedHTML(2, 1, 3, '1.9rem')}
  <span class="op-sign">=</span>
  <span class="mixed-display" style="font-size:2.1rem;color:var(--mint)"><span class="whole-num" style="color:var(--mint)">3</span><span class="mf-frac"><span class="mf-num">5</span><span class="mf-bar"></span><span class="mf-den">6</span></span></span>
`;

/* ============================================================
   CUTTING VISUALS (1/2 → 3/6, 1/3 → 2/6)
   ============================================================ */
document.getElementById('cutHalfBefore').innerHTML = makePizza(2, [1], 150);
document.getElementById('cutHalfAfter').innerHTML = makePizza(6, [0, 1, 2], 150);
document.getElementById('cutThirdBefore').innerHTML = makePizza(3, [1, 2], 150);
document.getElementById('cutThirdAfter').innerHTML = makePizza(6, [0, 1], 150);

/* ============================================================
    MULTIPLICATION ON PIZZA: 1/2 · 2/3 = 1/3
    ============================================================ */
(function () {
  const before = document.getElementById('mpBefore');
  const after = document.getElementById('mpAfter');
  if (!before || !after) return;
  // до: піца на 6, їмо половину (3/6)
  before.innerHTML = makePizza(6, [3, 4, 5], 150);
  // після: з цієї половини залишаємо 2/3 → 2/6 = 1/3
  after.innerHTML = makePizza(6, [0, 1, 3, 4, 5], 150);
})();

/* ============================================================
   MIXED NUMBERS
   ============================================================ */
document.getElementById('mixedVis1').innerHTML = makeMixedVisual(3, 3, 7, 60);

/* ============================================================
   MIXED NUMBERS — GALLERY
   ============================================================ */
const visualExamples = [
  { n: 3, d: 2 },
  { n: 7, d: 3 },
  { n: 10, d: 4 },
  { n: 5, d: 2 },
  { n: 9, d: 4 },
  { n: 8, d: 3 }
];

document.getElementById('mixedGallery').innerHTML = visualExamples.map(ex => {
  const whole = Math.floor(ex.n / ex.d);
  const rem = ex.n % ex.d;

  let leftSide = '<div class="ex-side">';
  for (let i = 0; i < ex.n; i++) leftSide += `<div class="ex-pizza">${makeSlice(ex.d, 40)}</div>`;
  leftSide += '</div>';

  let rightSide = '<div class="ex-side">';
  for (let i = 0; i < whole; i++) rightSide += `<div class="ex-pizza">${makeWhole(45)}</div>`;
  for (let i = 0; i < rem; i++) rightSide += `<div class="ex-pizza">${makeSlice(ex.d, 40)}</div>`;
  rightSide += '</div>';

  return `
    <div class="example-card">
      <div class="ex-header">
        ${fracHTML(ex.n, ex.d, '1.6rem')}
        <span class="op-sign">=</span>
        <span class="mixed-display" style="font-size:1.8rem">
          <span class="whole-num">${whole}</span>
          ${rem > 0 ? `<span class="mf-frac"><span class="mf-num">${rem}</span><span class="mf-bar"></span><span class="mf-den">${ex.d}</span></span>` : ''}
        </span>
      </div>
      <div class="ex-visual">
        ${leftSide}
        <div class="eq-equals">=</div>
        ${rightSide}
      </div>
    </div>
  `;
}).join('');

/* ============================================================
   PERCENT CARDS
   ============================================================ */
const percentItems = [
  { pct: '50%', frac: '1/2', text: 'Половина піци', segs: ['filled a','filled a','',''] },
  { pct: '25%', frac: '1/4', text: 'Чверть піци', segs: ['filled b','','',''] },
  { pct: '75%', frac: '3/4', text: 'Три чверті', segs: ['filled a','filled a','filled a',''] },
  { pct: '20%', frac: '1/5', text: 'Одна п\'ята', segs: ['filled b','','','',''] },
  { pct: '10%', frac: '1/10', text: 'Одна десята', segs: ['filled a','','','','','','','','',''] },
  { pct: '100%', frac: '1', text: 'Ціла піца', segs: ['filled a','filled a','filled a','filled a'] }
];

document.getElementById('percentCards').innerHTML = percentItems.map(it => `
  <div class="card" style="text-align:center">
    <div class="pct-big">${it.pct}</div>
    <div class="pct-frac">${it.frac}</div>
    ${segBar(it.segs.length, it.segs)}
    <p class="pct-text">${it.text}</p>
  </div>
`).join('');


/* ============================================================
   SCROLL PROGRESS + REVEAL + RAIL + THEME
   ============================================================ */
const prog = document.getElementById('progress');
const railDots = Array.from(document.querySelectorAll('.rail-dot'));
const railSections = railDots
  .map(d => document.getElementById(d.getAttribute('href').slice(1)))
  .filter(Boolean);

function onScroll() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  prog.style.width = (max > 0 ? h.scrollTop / max * 100 : 0) + '%';

  // какая тема сейчас на экране
  const line = window.innerHeight * 0.35;
  let active = 0;
  railSections.forEach((sec, i) => {
    if (sec.getBoundingClientRect().top <= line) active = i;
  });
  railDots.forEach((d, i) => d.classList.toggle('on', i === active));
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- THEME SWITCH ---------- */
const themeBtn = document.getElementById('themeToggle');
const root = document.documentElement;

function applyTheme(mode) {
  root.setAttribute('data-theme', mode);
  try { localStorage.setItem('drobu-theme', mode); } catch (e) {}
  if (themeBtn) themeBtn.setAttribute('aria-pressed', mode === 'dark');
}

let saved = null;
try { saved = localStorage.getItem('drobu-theme'); } catch (e) {}
if (saved !== 'dark' && saved !== 'light') saved = 'light';
applyTheme(saved);

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
}

/* ---------- CURSOR GLOW ON CARDS (desktop only) ---------- */
if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
  const glowTargets = document.querySelectorAll(
    '.card, .story-card, .gallery-card, .example-card, .topic-link, .flip-card, .percent-card'
  );
  glowTargets.forEach(el => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });
}

/* ---------- MULTIPLY: CROSS-CANCELLING MINI-PRESENTATION ---------- */
(function () {
  const numA = document.getElementById('mxNumA');
  const denA = document.getElementById('mxDenA');
  const numB = document.getElementById('mxNumB');
  const denB = document.getElementById('mxDenB');
  const result = document.getElementById('mxResult');
  const cap = document.getElementById('mulXCap');
  const stepNum = document.getElementById('mulXStepNum');
  const dots = document.getElementById('mulXDots');
  const prev = document.getElementById('mulXPrev');
  const next = document.getElementById('mulXNext');
  if (!numA || !cap) return;

  const strike = el => el.classList.add('strike');
  const unstrike = (el, val) => {
    el.classList.remove('strike');
    el.textContent = val;
    el.classList.add('new');
  };

  const steps = [
    {
      cap: 'Перед множенням шукаємо пари по діагоналі: чисельник одного дробу і знаменник іншого.',
      apply() {}
    },
    {
      cap: 'Перша пара по діагоналі: 4 і 8. Обидва діляться на 4 — закреслюємо.',
      apply() { strike(numA); strike(denB); }
    },
    {
      cap: '4 ÷ 4 = 1, 8 ÷ 4 = 2. Числа стали менші.',
      apply() { unstrike(numA, '1'); unstrike(denB, '2'); }
    },
    {
      cap: 'Друга пара по діагоналі: 3 і 9. Обидва діляться на 3 — закреслюємо.',
      apply() { strike(numB); strike(denA); }
    },
    {
      cap: '3 ÷ 3 = 1, 9 ÷ 3 = 3. Все скорочено!',
      apply() { unstrike(numB, '1'); unstrike(denA, '3'); }
    },
    {
      cap: 'Множимо: 1×1=1, 3×2=6 → 1/6.',
      apply() { result.style.opacity = '1'; }
    }
  ];

  function resetAll() {
    numA.textContent = '4'; denA.textContent = '9';
    numB.textContent = '3'; denB.textContent = '8';
    [numA, denA, numB, denB].forEach(el => el.classList.remove('strike', 'new'));
    result.style.opacity = '0';
  }

  let idx = 0;
  function render() {
    resetAll();
    for (let i = 0; i <= idx; i++) steps[i].apply();
    cap.textContent = steps[idx].cap;
    stepNum.textContent = `Крок ${idx + 1} з ${steps.length}`;
    prev.disabled = idx === 0;
    if (idx === steps.length - 1) {
      next.disabled = true;
      next.textContent = 'Готово! ✓';
    } else {
      next.disabled = false;
      next.textContent = 'Далі →';
    }
    dots.innerHTML = steps.map((_, i) => `<i class="${i === idx ? 'on' : ''}"></i>`).join('');
  }

  next.addEventListener('click', () => { if (idx < steps.length - 1) { idx++; render(); } });
  prev.addEventListener('click', () => { if (idx > 0) { idx--; render(); } });
  render();
})();
