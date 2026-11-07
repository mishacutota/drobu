/* generators 2: diffden, multiply, divide, percent */
(function () {
  'use strict';
  const DQ = window.DQ;
  const rand = DQ.rand, gcd = DQ.gcd, simp = DQ.simp, lcm = DQ.lcm, shuffle = DQ.shuffle, buildOpts = DQ.buildOpts, toMixedStr = DQ.toMixedStr;
  const G = DQ.gens;

  G.diffden = function () {
    const type = rand(0, 4);
    if (type === 0) {
      const a = rand(2, 9), b = rand(2, 9);
      const correct = String(lcm(a, b));
      const options = buildOpts(correct, () => {
        const r = rand(0, 3);
        if (r === 0) return String(a * b);
        if (r === 1) return String(Math.max(a, b));
        return String(rand(2, 30));
      });
      return { prompt: 'Знайди найменше спільне кратне (НСК) для ' + a + ' і ' + b + '.', visual: '', options, explain: 'НСК(' + a + ',' + b + ') = ' + lcm(a, b) + '.' };
    }
    if (type === 1) {
      const d1 = rand(2, 6), d2 = rand(2, 6);
      const n1 = rand(1, d1 - 1), n2 = rand(1, d2 - 1);
      const L = lcm(d1, d2);
      const num = n1 * (L / d1) + n2 * (L / d2);
      const s = simp(num, L);
      const correct = (s.n >= s.d) ? toMixedStr(s.n, s.d) : (s.n + '/' + s.d);
      const wrong1 = (n1 + n2) + '/' + (d1 + d2);
      const options = buildOpts(correct, () => {
        const r = rand(0, 3);
        if (r === 0) return wrong1;
        if (r === 1) return n1 + '/' + d1 + '+' + n2 + '/' + d2;
        const n = rand(1, L - 1), d = L;
        const ss = simp(n, d);
        return (ss.n >= ss.d) ? toMixedStr(ss.n, ss.d) : (ss.n + '/' + ss.d);
      });
      return { prompt: n1 + '/' + d1 + ' + ' + n2 + '/' + d2 + ' = ?', visual: '', options, explain: 'Спільний знаменник ' + L + ': ' + n1 + '/' + d1 + '=' + (n1 * (L / d1)) + '/' + L + ', ' + n2 + '/' + d2 + '=' + (n2 * (L / d2)) + '/' + L + '. Сума = ' + num + '/' + L + ' = ' + correct + '.' };
    }
    if (type === 2) {
      let d1 = rand(3, 7), d2 = rand(2, 6);
      let n1 = rand(2, d1 - 1), n2 = rand(1, d2 - 1);
      const L = lcm(d1, d2);
      let num = n1 * (L / d1) - n2 * (L / d2);
      if (num < 0) {
        const t = n1; n1 = n2; n2 = t; const td = d1; d1 = d2; d2 = td;
        num = n1 * (L / d1) - n2 * (L / d2);
        if (num < 0) num = Math.abs(num);
      }
      const s = simp(Math.abs(num), L);
      const correct = (num < 0 ? '-' : '') + ((s.n >= s.d) ? toMixedStr(s.n, s.d) : (s.n + '/' + s.d));
      const options = buildOpts(correct, () => {
        const n = rand(1, L - 1), d = L;
        const ss = simp(n, d);
        return ss.n + '/' + ss.d;
      });
      return { prompt: n1 + '/' + d1 + ' − ' + n2 + '/' + d2 + ' = ?', visual: '', options, explain: 'Спільний знаменник ' + L + '. Результат ' + correct + '.' };
    }
    if (type === 3) {
      const d = rand(2, 6), other = rand(2, 6);
      const L = lcm(d, other);
      const n = rand(1, d - 1);
      const correct = String(n * (L / d));
      const options = buildOpts(correct, () => String(rand(1, L)));
      return { prompt: n + '/' + d + ' = ?/' + L + '. Знайди чисельник.', visual: '', options, explain: n + '/' + d + ' = ' + (n * (L / d)) + '/' + L + '.' };
    }
    const w1 = rand(1, 3), n1 = rand(1, 3), d1 = rand(2, 6);
    const w2 = rand(1, 3), n2 = rand(1, 3), d2 = rand(2, 6);
    const L = lcm(d1, d2);
    const num = (w1 * d1 + n1) * (L / d1) + (w2 * d2 + n2) * (L / d2);
    const resW = Math.floor(num / L);
    const resR = num % L;
    const s = simp(resR, L);
    const correct = (resR === 0) ? String(resW) : (resW > 0 ? (resW + ' ' + s.n + '/' + s.d) : (s.n + '/' + s.d));
    const options = buildOpts(correct, () => {
      const w = rand(0, 8), r = rand(0, 6);
      return r === 0 ? String(w) : (w + ' ' + r + '/' + rand(2, 6));
    });
    return { prompt: w1 + ' ' + n1 + '/' + d1 + ' + ' + w2 + ' ' + n2 + '/' + d2 + ' = ?', visual: '', options, explain: 'Приводимо до спільного знаменника ' + L + ' і додаємо: результат ' + correct + '.' };
  };

  G.multiply = function () {
    const type = rand(0, 4);
    if (type === 0) {
      const a = rand(1, 6), b = rand(2, 8), c = rand(1, 6), d = rand(2, 8);
      const num = a * c, den = b * d;
      const s = simp(num, den);
      const correct = (s.n >= s.d) ? toMixedStr(s.n, s.d) : (s.n + '/' + s.d);
      const options = buildOpts(correct, () => {
        const n = rand(1, 12), dd = rand(2, 12);
        const ss = simp(n, dd);
        return (ss.n >= ss.d) ? toMixedStr(ss.n, ss.d) : (ss.n + '/' + ss.d);
      });
      return { prompt: a + '/' + b + ' · ' + c + '/' + d + ' = ?', visual: '', options, explain: 'Множимо: ' + a + '·' + c + '=' + num + ', ' + b + '·' + d + '=' + den + '. Скорочуємо → ' + correct + '.' };
    }
    if (type === 1) {
      const a = rand(2, 9), b = rand(a + 1, 12);
      const c = rand(2, 9), d = rand(c + 1, 12);
      const g1 = gcd(a, d), g2 = gcd(c, b);
      const num = (a / g1) * (c / g2);
      const den = (b / g2) * (d / g1);
      const s = simp(num, den);
      const correct = (s.n >= s.d) ? toMixedStr(s.n, s.d) : (s.n + '/' + s.d);
      const options = buildOpts(correct, () => {
        const n = rand(1, 12), dd = rand(2, 12);
        const ss = simp(n, dd);
        return (ss.n >= ss.d) ? toMixedStr(ss.n, ss.d) : (ss.n + '/' + ss.d);
      });
      return { prompt: a + '/' + b + ' · ' + c + '/' + d + ' = ? (скороти навхрест)', visual: '', options, explain: 'Скорочуємо по діагоналях: результат ' + correct + '.' };
    }
    if (type === 2) {
      const a = rand(1, 6), b = rand(2, 9), n = rand(2, 6);
      const num = a * n, den = b;
      const s = simp(num, den);
      const correct = (s.n >= s.d) ? toMixedStr(s.n, s.d) : (s.n + '/' + s.d);
      const options = buildOpts(correct, () => {
        const nn = rand(1, 12), dd = rand(2, 12);
        const ss = simp(nn, dd);
        return (ss.n >= ss.d) ? toMixedStr(ss.n, ss.d) : (ss.n + '/' + ss.d);
      });
      return { prompt: a + '/' + b + ' · ' + n + ' = ?', visual: '', options, explain: a + '/' + b + ' · ' + n + ' = ' + (a * n) + '/' + b + ' = ' + correct + '.' };
    }
    if (type === 3) {
      const w = rand(1, 3), n = rand(1, 4), d = rand(n + 1, 8);
      const c = rand(1, 6), dd = rand(2, 8);
      const N = w * d + n;
      const num = N * c, den = d * dd;
      const s = simp(num, den);
      const correct = (s.n >= s.d) ? toMixedStr(s.n, s.d) : (s.n + '/' + s.d);
      const options = buildOpts(correct, () => {
        const nn = rand(1, 15), ddd = rand(2, 12);
        const ss = simp(nn, ddd);
        return (ss.n >= ss.d) ? toMixedStr(ss.n, ss.d) : (ss.n + '/' + ss.d);
      });
      return { prompt: w + ' ' + n + '/' + d + ' · ' + c + '/' + dd + ' = ?', visual: '', options, explain: w + ' ' + n + '/' + d + ' = ' + N + '/' + d + '. Далі ' + N + '/' + d + ' · ' + c + '/' + dd + ' = ' + correct + '.' };
    }
    const x = rand(1, 9);
    const correct = '0';
    const options = buildOpts(correct, () => String(rand(1, 9)));
    return { prompt: x + '/5 · 0 = ?', visual: '', options, explain: 'Будь-яке число помножити на 0 = 0.' };
  };

  G.divide = function () {
    const type = rand(0, 4);
    if (type === 0) {
      const a = rand(1, 6), b = rand(2, 8), c = rand(1, 6), d = rand(2, 8);
      const num = a * d, den = b * c;
      const s = simp(num, den);
      const correct = (s.n >= s.d) ? toMixedStr(s.n, s.d) : (s.n + '/' + s.d);
      const options = buildOpts(correct, () => {
        const n = rand(1, 12), dd = rand(2, 12);
        const ss = simp(n, dd);
        return (ss.n >= ss.d) ? toMixedStr(ss.n, ss.d) : (ss.n + '/' + ss.d);
      });
      return { prompt: a + '/' + b + ' : ' + c + '/' + d + ' = ?', visual: '', options, explain: a + '/' + b + ' : ' + c + '/' + d + ' = ' + a + '/' + b + ' · ' + d + '/' + c + ' = ' + correct + '.' };
    }
    if (type === 1) {
      const a = rand(1, 6), b = rand(2, 9), n = rand(2, 6);
      const num = a, den = b * n;
      const s = simp(num, den);
      const correct = (s.n >= s.d) ? toMixedStr(s.n, s.d) : (s.n + '/' + s.d);
      const options = buildOpts(correct, () => {
        const nn = rand(1, 12), dd = rand(2, 12);
        const ss = simp(nn, dd);
        return (ss.n >= ss.d) ? toMixedStr(ss.n, ss.d) : (ss.n + '/' + ss.d);
      });
      return { prompt: a + '/' + b + ' : ' + n + ' = ?', visual: '', options, explain: a + '/' + b + ' : ' + n + ' = ' + a + '/' + b + ' · 1/' + n + ' = ' + correct + '.' };
    }
    if (type === 2) {
      const w = rand(1, 3), n = rand(1, 4), d = rand(n + 1, 8);
      const c = rand(1, 4), dd = rand(2, 8);
      const N = w * d + n;
      const num = N * dd, den = d * c;
      const s = simp(num, den);
      const correct = (s.n >= s.d) ? toMixedStr(s.n, s.d) : (s.n + '/' + s.d);
      const options = buildOpts(correct, () => {
        const nn = rand(1, 15), ddd = rand(2, 12);
        const ss = simp(nn, ddd);
        return (ss.n >= ss.d) ? toMixedStr(ss.n, ss.d) : (ss.n + '/' + ss.d);
      });
      return { prompt: w + ' ' + n + '/' + d + ' : ' + c + '/' + dd + ' = ?', visual: '', options, explain: w + ' ' + n + '/' + d + ' = ' + N + '/' + d + '. Далі ' + N + '/' + d + ' : ' + c + '/' + dd + ' = ' + correct + '.' };
    }
    if (type === 3) {
      const a = rand(1, 8), b = rand(2, 9);
      const correct = '1';
      const options = buildOpts(correct, () => String(rand(0, 5)));
      return { prompt: a + '/' + b + ' : ' + a + '/' + b + ' = ?', visual: '', options, explain: 'Будь-яке ненульове число ділене на себе = 1.' };
    }
    const a = rand(1, 6), b = rand(2, 9);
    const correct = b + '/' + a;
    const options = buildOpts(correct, () => rand(1, 9) + '/' + rand(2, 9));
    return { prompt: 'Знайди обернений дріб до ' + a + '/' + b + '.', visual: '', options, explain: 'Обернений дріб: ' + b + '/' + a + '.' };
  };

  G.percent = function () {
    const type = rand(0, 4);
    if (type === 0) {
      const p = [50, 25, 20, 10, 100, 75, 5, 1][rand(0, 7)];
      const s = simp(p, 100);
      const correct = s.n + '/' + s.d;
      const options = buildOpts(correct, () => rand(1, 9) + '/' + rand(2, 12));
      return { prompt: p + '% = яка дріб?', visual: '', options, explain: p + '% = ' + p + '/100 = ' + correct + '.' };
    }
    if (type === 1) {
      const pairs = [[1, 2, 50], [1, 4, 25], [1, 5, 20], [1, 10, 10], [3, 4, 75], [1, 20, 5]];
      const pr = pairs[rand(0, pairs.length - 1)];
      const correct = pr[2] + '%';
      const options = buildOpts(correct, () => rand(1, 99) + '%');
      return { prompt: pr[0] + '/' + pr[1] + ' = ?%', visual: '', options, explain: pr[0] + '/' + pr[1] + ' = ' + pr[2] + '%.' };
    }
    if (type === 2) {
      const p = [10, 20, 25, 50][rand(0, 3)];
      const N = rand(2, 10) * 100;
      const correct = String(N * p / 100);
      const options = buildOpts(correct, () => String(rand(1, N)));
      return { prompt: 'Скільки це ' + p + '% від ' + N + '?', visual: '', options, explain: N + ' · ' + p + '/100 = ' + correct + '.' };
    }
    if (type === 3) {
      const N = rand(2, 10) * 100;
      const correct = String(N / 100);
      const options = buildOpts(correct, () => String(rand(1, N / 10)));
      return { prompt: '1% від ' + N + ' = ?', visual: '', options, explain: N + '/100 = ' + correct + '.' };
    }
    const a = rand(1, 9), b = rand(a + 1, 10);
    const pct = Math.round(a / b * 100);
    const correct = pct + '%';
    const options = buildOpts(correct, () => rand(1, 99) + '%');
    return { prompt: 'Який відсоток становить ' + a + ' з ' + b + '?', visual: '', options, explain: a + '/' + b + ' · 100% ≈ ' + pct + '%.' };
  };
})();