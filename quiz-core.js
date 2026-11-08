/* quiz engine + init */
(function () {
  'use strict';
  const DQ = window.DQ;
  function initQuiz(id, genName) {
    const root = document.getElementById(id);
    if (!root) return;
    const promptEl = root.querySelector('[data-quiz-prompt]');
    const visualEl = root.querySelector('[data-quiz-visual]');
    const optsEl = root.querySelector('[data-quiz-opts]');
    const fbEl = root.querySelector('[data-quiz-feedback]');
    const scoreEl = root.querySelector('[data-quiz-score]');
    const nextBtn = root.querySelector('[data-quiz-next]');
    let correctCount = 0, totalCount = 0, answered = false;
    let currentGen = genName;
    function renderQuestion() {
      answered = false;
      fbEl.textContent = '';
      fbEl.className = 'feedback';
      optsEl.innerHTML = '';
      const q = DQ.gens[currentGen]();
      if (visualEl) visualEl.innerHTML = q.visual || '';
      promptEl.innerHTML = DQ.formatMixed(q.prompt);
      const opts = DQ.shuffle(q.options.map(o => ({ text: DQ.formatMixed(o.text), correct: !!o.correct })));
      opts.forEach(o => {
        const btn = document.createElement('button');
        btn.className = 'opt';
        btn.innerHTML = o.text;
        btn.addEventListener('click', function () {
          if (answered) return;
          answered = true;
          totalCount++;
          if (o.correct) {
            correctCount++;
            btn.classList.add('correct');
            fbEl.innerHTML = '✅ Правильно! ' + DQ.formatMixed(q.explain);
            fbEl.className = 'feedback ok';
          } else {
            btn.classList.add('wrong');
            optsEl.querySelectorAll('.opt').forEach(b => { if (b.dataset.correct === '1') b.classList.add('correct'); });
            fbEl.innerHTML = '❌ Неправильно. ' + DQ.formatMixed(q.explain);
            fbEl.className = 'feedback no';
          }
          optsEl.querySelectorAll('.opt').forEach(b => { b.disabled = true; });
          scoreEl.textContent = 'Правильно: ' + correctCount + ' з ' + totalCount;
          scoreEl.style.display = 'block';
        });
        if (o.correct) btn.dataset.correct = '1';
        optsEl.appendChild(btn);
      });
    }
    if (nextBtn) nextBtn.addEventListener('click', renderQuestion);
    const levelBtns = root.querySelectorAll('[data-level]');
    levelBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const lvl = btn.dataset.level;
        const newGen = (lvl === 'easy') ? 'mixedEasy' : 'mixed';
        if (newGen === currentGen) return;
        currentGen = newGen;
        levelBtns.forEach(b => b.classList.toggle('ghost', b !== btn));
        correctCount = 0; totalCount = 0; answered = false;
        fbEl.textContent = '';
        fbEl.className = 'feedback';
        scoreEl.textContent = 'Правильно: 0 з 0';
        scoreEl.style.display = 'block';
        renderQuestion();
      });
    });
    levelBtns.forEach(b => {
      const isEasy = b.dataset.level === 'easy';
      const active = (isEasy && currentGen === 'mixedEasy') || (!isEasy && currentGen === 'mixed');
      b.classList.toggle('ghost', !active);
    });
    renderQuestion();
  }
  const topics = [
    ['quiz-story', 'story'],
    ['quiz-parts', 'parts'],
    ['quiz-mixed', 'mixedEasy'],
    ['quiz-adding', 'adding'],
    ['quiz-diffden', 'diffden'],
    ['quiz-multiply', 'multiply'],
    ['quiz-divide', 'divide'],
    ['quiz-percent', 'percent']
  ];
  function initAll() { topics.forEach(t => initQuiz(t[0], t[1])); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();