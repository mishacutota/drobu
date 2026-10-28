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
  s += `<circle cx="${cx}" cy="${cy}" r="${cheeseR}" fill="url(#cheeseGrad)" opacity="0.5"/>`;

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
      } else if (slices <= 6) {
        peps.push([cx + 48 * Math.cos(mid), cy + 48 * Math.sin(mid)]);
      } else {
        peps.push([cx + 46 * Math.cos(mid), cy + 46 * Math.sin(mid)]);
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

  const next = document.getElementById('storyNext');
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
document.getElementById('storyReset').addEventListener('click', () => {
  storyIdx = 0; renderStory();
});
renderStory();

/* ============================================================
   PARTS
   ============================================================ */
document.getElementById('partsPizza').innerHTML = makePizza(4, [3], 280);

/* ============================================================
   GALLERY
   ============================================================ */
function makeChocolateSVG(size = 120) {
  const cols = 4, rows = 3;
  const cw = size / cols, ch = size / rows;
  const eaten = [2, 5, 7, 8];
  let s = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="max-width:100%;height:auto">`;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const x = c * cw, y = r * ch;
      if (eaten.includes(i)) {
        s += `<rect x="${x + 3}" y="${y + 3}" width="${cw - 6}" height="${ch - 6}" rx="5" fill="#f7f0e4" stroke="#ddd0b8" stroke-width="1" stroke-dasharray="3,2"/>`;
      } else {
        s += `<rect x="${x + 3}" y="${y + 3}" width="${cw - 6}" height="${ch - 6}" rx="5" fill="#6b4423" stroke="#4a2e17" stroke-width="1.2"/>`;
        s += `<rect x="${x + 10}" y="${y + 10}" width="${cw - 20}" height="${ch - 20}" rx="3" fill="#8b5a2b" opacity="0.55"/>`;
      }
    }
  }
  return s + '</svg>';
}

function makeBottleSVG(size = 110) {
  const w = 46, h = 100;
  const x = (size - w) / 2;
  const y = 6;
  const bodyTop = y + 22;
  const bodyH = h - 22;
  const waterY = bodyTop + bodyH * 0.5;
  let s = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="max-width:100%;height:auto">`;
  s += `<rect x="${x}" y="${bodyTop}" width="${w}" height="${bodyH}" rx="12" fill="#e0f2fe" stroke="#7dd3fc" stroke-width="2"/>`;
  s += `<rect x="${x + 15}" y="${y}" width="${w - 30}" height="24" fill="#e0f2fe" stroke="#7dd3fc" stroke-width="2"/>`;
  s += `<rect x="${x + 2}" y="${waterY}" width="${w - 4}" height="${bodyTop + bodyH - waterY - 2}" rx="10" fill="#38bdf8" opacity="0.72"/>`;
  s += `<line x1="${x + 2}" y1="${waterY}" x2="${x + w - 2}" y2="${waterY}" stroke="#0ea5e9" stroke-width="2"/>`;
  return s + '</svg>';
}

function makeBatterySVG(size = 110) {
  const w = 80, h = 40;
  const x = (size - w) / 2 - 4;
  const y = (size - h) / 2;
  let s = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="max-width:100%;height:auto">`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#fff" stroke="#334155" stroke-width="2.5"/>`;
  s += `<rect x="${x + w + 2}" y="${y + h / 2 - 7}" width="6" height="14" rx="2" fill="#334155"/>`;
  s += `<rect x="${x + 5}" y="${y + 5}" width="${(w - 10) * 0.5}" height="${h - 10}" rx="3" fill="#10b981"/>`;
  return s + '</svg>';
}

function makeClockSVG(size = 110) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 6;
  let s = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="max-width:100%;height:auto">`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#334155" stroke-width="3"/>`;
  for (let i = 0; i < 12; i++) {
    const a = i * 30 * Math.PI / 180 - Math.PI / 2;
    const x1 = cx + (r - 10) * Math.cos(a);
    const y1 = cy + (r - 10) * Math.sin(a);
    const x2 = cx + (r - 4) * Math.cos(a);
    const y2 = cy + (r - 4) * Math.sin(a);
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#94a3b8" stroke-width="1.5"/>`;
  }
  s += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + r * 0.4}" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>`;
  s += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r * 0.65}" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="4" fill="#dc4a4a"/>`;
  return s + '</svg>';
}

function makeCoinsSVG(size = 110) {
  let s = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="max-width:100%;height:auto">`;
  s += `<circle cx="${size/2}" cy="${size/2 + 8}" r="32" fill="#d4a017" stroke="#a17a0f" stroke-width="2"/>`;
  s += `<circle cx="${size/2}" cy="${size/2 + 4}" r="32" fill="#fbbf24" stroke="#d4a017" stroke-width="2"/>`;
  s += `<text x="${size/2}" y="${size/2 + 12}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="20" fill="#7c4a03">50</text>`;
  s += `<circle cx="${size/2 + 30}" cy="${size/2 + 22}" r="20" fill="#fbbf24" stroke="#d4a017" stroke-width="2"/>`;
  s += `<text x="${size/2 + 30}" y="${size/2 + 29}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="14" fill="#7c4a03">25</text>`;
  return s + '</svg>';
}

const galleryItems = [
  { title: 'Піца', svg: makePizza(4, [3], 110), frac: '1 з 4 = 1/4' },
  { title: 'Шоколадка', svg: makeChocolateSVG(110), frac: '8 з 12 = 2/3' },
  { title: 'Склянка води', svg: makeBottleSVG(110), frac: 'половина = 1/2' },
  { title: 'Батарейка', svg: makeBatterySVG(110), frac: 'половина = 50%' },
  { title: 'Годинник', svg: makeClockSVG(110), frac: 'пів на = 30/60 = 1/2' },
  { title: 'Гроші', svg: makeCoinsSVG(110), frac: '50 коп = 1/2 грн' }
];

document.getElementById('gallery').innerHTML = galleryItems.map(item => `
  <div class="gallery-card">
    <div class="viz">${item.svg}</div>
    <h4>${item.title}</h4>
    <div class="frac-mini">${item.frac}</div>
  </div>
`).join('');

/* ============================================================
   ADDING & SUBTRACTING — VISUALS
   ============================================================ */
document.getElementById('addVis').innerHTML = `
  <div style="display:grid;gap:12px;max-width:400px;margin:0 auto">
    <div>
      <div style="font-weight:900;margin-bottom:6px;color:var(--orange);font-size:.9rem">2/7</div>
      ${segBar(7, ['filled a','filled a','','','','',''])}
    </div>
    <div style="text-align:center;font-weight:900;color:var(--muted);font-size:1.3rem">+</div>
    <div>
      <div style="font-weight:900;margin-bottom:6px;color:var(--primary);font-size:.9rem">3/7</div>
      ${segBar(7, ['filled b','filled b','filled b','','','',''])}
    </div>
    <div style="text-align:center;font-weight:900;color:var(--muted);font-size:1.3rem">=</div>
    <div>
      <div style="font-weight:900;margin-bottom:6px;color:var(--mint);font-size:.9rem">5/7</div>
      ${segBar(7, ['filled a','filled a','filled b','filled b','filled b','',''])}
    </div>
  </div>
`;

document.getElementById('subVis').innerHTML = `
  <div style="display:grid;gap:12px;max-width:400px;margin:0 auto">
    <div>
      <div style="font-weight:900;margin-bottom:6px;color:var(--mint);font-size:.9rem">5/8</div>
      ${segBar(8, ['filled r','filled r','filled r','removed','removed','','',''])}
    </div>
    <div style="text-align:center;font-weight:900;color:var(--muted);font-size:1.3rem">−</div>
    <div>
      <div style="font-weight:900;margin-bottom:6px;color:var(--orange);font-size:.9rem">2/8</div>
      ${segBar(8, ['filled a','filled a','','','','','',''])}
    </div>
    <div style="text-align:center;font-weight:900;color:var(--muted);font-size:1.3rem">=</div>
    <div>
      <div style="font-weight:900;margin-bottom:6px;color:var(--primary);font-size:.9rem">3/8</div>
      ${segBar(8, ['filled r','filled r','filled r','','','','',''])}
    </div>
  </div>
`;

document.getElementById('mistakePizzas').innerHTML = `
  <div style="text-align:center">
    ${makePizza(2, [1], 80)}
    <div style="font-weight:900;margin-top:6px;font-size:.9rem">1/2</div>
  </div>
  <div style="font-size:1.4rem;font-weight:900;color:var(--muted)">+</div>
  <div style="text-align:center">
    ${makePizza(2, [1], 80)}
    <div style="font-weight:900;margin-top:6px;font-size:.9rem">1/2</div>
  </div>
  <div style="font-size:1.4rem;font-weight:900;color:var(--muted)">=</div>
  <div style="text-align:center">
    ${makePizza(1, [], 80)}
    <div style="font-weight:900;margin-top:6px;font-size:.9rem;color:var(--mint)">1 ціла</div>
  </div>
`;

/* ============================================================
   MIXED NUMBERS — VISUALS
   ============================================================ */
document.getElementById('mixedVis1').innerHTML = makeMixedVisual(3, 3, 7, 60);
document.getElementById('mixedNum1').innerHTML = mixedHTML(3, 3, 7, '2.4rem');

document.getElementById('addM1').innerHTML = mixedHTML(2, 3, 7, '1.9rem');
document.getElementById('addM2').innerHTML = mixedHTML(1, 2, 7, '1.9rem');
document.getElementById('addM3').innerHTML = mixedHTML(3, 5, 7, '2.1rem').replace('color:var(--primary)', 'color:var(--mint)');

document.getElementById('subM1').innerHTML = mixedHTML(3, 5, 8, '1.9rem');
document.getElementById('subM2').innerHTML = mixedHTML(1, 2, 8, '1.9rem');
document.getElementById('subM3').innerHTML = mixedHTML(2, 3, 8, '2.1rem').replace('color:var(--primary)', 'color:var(--mint)');

document.getElementById('borrowM1').innerHTML = mixedHTML(3, 1, 7, '2rem');
document.getElementById('borrowM2').innerHTML = mixedHTML(2, 8, 7, '2rem').replace('color:var(--primary)', 'color:var(--orange)');
document.getElementById('borrowM3').innerHTML = mixedHTML(2, 8, 7, '1.9rem');
document.getElementById('borrowM4').innerHTML = mixedHTML(1, 4, 7, '1.9rem');
document.getElementById('borrowM5').innerHTML = mixedHTML(1, 4, 7, '2.1rem').replace('color:var(--primary)', 'color:var(--mint)');

/* ============================================================
   NEW: VISUAL MIXED EXAMPLES GENERATOR (6 EXAMPLES)
   ============================================================ */
const visualExamples = [
  { n: 3, d: 2 },
  { n: 7, d: 3 },
  { n: 10, d: 4 },
  { n: 5, d: 2 },
  { n: 9, d: 4 },
  { n: 8, d: 3 }
];

const examplesHTML = visualExamples.map(ex => {
  const whole = Math.floor(ex.n / ex.d);
  const rem = ex.n % ex.d;

  // Ліва частина - всі шматки
  let leftSide = '<div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;max-width:200px;margin:0 auto;">';
  for(let i=0; i<ex.n; i++) leftSide += `<div style="filter:drop-shadow(0 4px 6px rgba(180,90,20,.15))">${makeSlice(ex.d, 40)}</div>`;
  leftSide += '</div>';

  // Права частина - цілі піци + залишок
  let rightSide = '<div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;max-width:200px;margin:0 auto;align-items:center;">';
  for(let i=0; i<whole; i++) rightSide += `<div style="filter:drop-shadow(0 4px 6px rgba(180,90,20,.15))">${makeWhole(45)}</div>`;
  for(let i=0; i<rem; i++) rightSide += `<div style="filter:drop-shadow(0 4px 6px rgba(180,90,20,.15))">${makeSlice(ex.d, 40)}</div>`;
  rightSide += '</div>';

  return `
    <div class="example-card">
      <div class="ex-header">
        <span class="big-frac"><span class="num">${ex.n}</span><span class="bar"></span><span class="den">${ex.d}</span></span>
        <span class="op-sign">=</span>
        <span class="mixed-display" style="font-size:2rem;">
          <span class="whole-num">${whole}</span>
          ${rem > 0 ? `<span class="mf-frac"><span class="mf-num">${rem}</span><span class="mf-bar"></span><span class="mf-den">${ex.d}</span></span>` : ''}
        </span>
      </div>
      <div class="ex-visual">
        ${leftSide}
        <div class="eq-equals" style="font-size:1.5rem;margin:0 10px;color:var(--primary);">=</div>
        ${rightSide}
      </div>
    </div>
  `;
}).join('');

document.getElementById('examplesGrid').innerHTML = examplesHTML;

/* ============================================================
   EQUIVALENT
   ============================================================ */
document.getElementById('eq1').innerHTML = makePizza(2, [1], 130);
document.getElementById('eq2').innerHTML = makePizza(4, [2, 3], 130);
document.getElementById('eq3').innerHTML = makePizza(8, [4, 5, 6, 7], 130);

/* ============================================================
   QUIZ
   ============================================================ */
const quizData = [
  {
    q: 'Яка піца показує половину (1/2)?',
    opts: [makePizza(4, [3], 75), makePizza(2, [1], 75), makePizza(4, [1, 2, 3], 75), makePizza(1, [], 75)],
    correct: 1,
    explain: "Половина — це коли з'їдено 1 шматок з 2. Або 2 з 4 — це теж половина!"
  },
  {
    q: 'Що показує нижнє число в дробі (знаменник)?',
    opts: ["Скільки шматків з'їли", 'Скільки всього шматків', 'Скільки разів різали', 'Нічого не показує'],
    correct: 1,
    explain: 'Знаменник — на скільки рівних частин поділили ціле. Це всього шматків.'
  },
  {
    q: 'Скільки відсотків у половини?',
    opts: ['10%', '25%', '50%', '100%'],
    correct: 2,
    explain: 'Половина = 1/2 = 50/100 = 50%.'
  },
  {
    q: '25% — це який дріб?',
    opts: ['1/2', '1/4', '3/4', '1/5'],
    correct: 1,
    explain: '25% = 25/100 = 1/4. Це чверть піци.'
  },
  {
    q: '1/2 + 1/4 = ?',
    opts: ['2/6', '2/4', '3/4', '1/6'],
    correct: 2,
    explain: 'Зводимо до спільного знаменника 4: 1/2 = 2/4, тоді 2/4 + 1/4 = 3/4.'
  },
  {
    q: '2/7 + 3/7 = ?',
    opts: ['5/14', '5/7', '6/7', '1/7'],
    correct: 1,
    explain: 'Знаменники однакові — додаємо тільки чисельники: 2+3=5. Знаменник 7 залишаємо. Буде 5/7.'
  },
  {
    q: '5/8 − 2/8 = ?',
    opts: ['3/0', '3/8', '7/8', '3/16'],
    correct: 1,
    explain: 'Віднімаємо чисельники: 5−2=3. Знаменник 8 залишаємо. Буде 3/8.'
  },
  {
    q: '3 1/7 − 1 4/7 = ?',
    opts: ['2 3/7', '1 4/7', '2 4/7', '1 3/7'],
    correct: 1,
    explain: '1/7 < 4/7, тому позичаємо 1 цілу: 3 1/7 = 2 8/7. Тоді 2 8/7 − 1 4/7 = 1 4/7.'
  }
];

const questionsBox = document.getElementById('questions');
let answeredCount = 0;
let correctCount = 0;

quizData.forEach((item, i) => {
  const div = document.createElement('div');
  div.className = 'q';
  div.innerHTML = `
    <h4><span class="num">${i + 1}</span><span>${item.q}</span></h4>
    <div class="opts"></div>
    <div class="feedback"></div>
  `;
  const optsWrap = div.querySelector('.opts');
  const fb = div.querySelector('.feedback');

  item.opts.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'opt';
    btn.type = 'button';
    btn.innerHTML = opt;
    btn.addEventListener('click', () => {
      if (div.dataset.done) return;
      div.dataset.done = '1';
      answeredCount++;

      const buttons = optsWrap.querySelectorAll('.opt');
      buttons.forEach(b => b.disabled = true);
      buttons[item.correct].classList.add('correct');

      if (idx === item.correct) {
        correctCount++;
        fb.textContent = '✅ Правильно! ' + item.explain;
        fb.className = 'feedback ok';
      } else {
        btn.classList.add('wrong');
        fb.textContent = '❌ Майже! ' + item.explain;
        fb.className = 'feedback no';
      }

      if (answeredCount === quizData.length) {
        const sc = document.getElementById('score');
        sc.style.display = 'block';
        let msg;
        if (correctCount === quizData.length) msg = '🏆 Ідеально! Ти справжній майстер дробів!';
        else if (correctCount >= 6) msg = '👏 Дуже добре! Ще трохи — і буде ідеально.';
        else if (correctCount >= 3) msg = '💪 Непогано! Перечитай тему про піцу і спробуй ще.';
        else msg = '📚 Нічого страшного! Повернись до історії з піцою — і все вийде.';
        sc.innerHTML = `<div class="big">${correctCount} / ${quizData.length}</div>${msg}`;
        sc.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    optsWrap.appendChild(btn);
  });

  questionsBox.appendChild(div);
});

/* ============================================================
   SCROLL PROGRESS + REVEAL + BARS
   ============================================================ */
const prog = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
  prog.style.width = scrolled + '%';
});

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const barIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bar > i').forEach(b => {
        const w = b.style.width;
        b.style.width = '0%';
        setTimeout(() => b.style.width = w, 150);
      });
      barIO.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.card').forEach(el => barIO.observe(el));