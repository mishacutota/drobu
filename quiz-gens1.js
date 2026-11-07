/* generators 1: story, parts, mixed, adding */
(function () {
  'use strict';
  const DQ = window.DQ;
  const rand = DQ.rand, gcd = DQ.gcd, simp = DQ.simp, lcm = DQ.lcm, shuffle = DQ.shuffle, buildOpts = DQ.buildOpts, toMixedStr = DQ.toMixedStr;
  const G = DQ.gens;

  G.story = function () {
    const D = [2, 3, 4, 5, 6, 8][rand(0, 5)];
    const N = rand(1, D);
    const eaten = [];
    for (let i = N; i < D; i++) eaten.push(i);
    const visual = (N < D) ? makePizza(D, eaten, 140) : makePizza(D, [], 140);
    const type = rand(0, 2);
    if (type === 0) {
      const correct = String(N);
      const options = buildOpts(correct, () => String(rand(1, D)));
      return { prompt: 'Піцу розрізали на ' + D + ' шматків, узяли ' + N + '. Скільки шматків узяли? (чисельник)', visual, options, explain: 'Узяли ' + N + ' шматків з ' + D + ', тому чисельник = ' + N + '.' };
    }
    if (type === 1) {
      const correct = N + '/' + D;
      const options = buildOpts(correct, () => (Math.random() < 0.5) ? (rand(1, D) + '/' + D) : (rand(1, 6) + '/' + rand(2, 8)));
      return { prompt: 'Піцу розрізали на ' + D + ' шматків, узяли ' + N + '. Яка дріб?', visual, options, explain: N + ' шматків з ' + D + ' = ' + N + '/' + D + '.' };
    }
    const correct = String(D);
    const options = buildOpts(correct, () => String(rand(2, 10)));
    return { prompt: 'На малюнку ' + N + ' зафарбованих шматків з ' + D + '. Скільки усього шматків? (знаменник)', visual, options, explain: 'Усього ' + D + ' шматків, тому знаменник = ' + D + '.' };
  };

  G.parts = function () {
    const type = rand(0, 3);
    if (type === 0) {
      const a = rand(2, 9), b = rand(a + 1, 12);
      const correct = '1/' + a;
      const options = buildOpts(correct, () => {
        const r = rand(0, 2);
        if (r === 0) return '1/' + b;
        if (r === 1) return 'однакові';
        return 'не можна порівняти';
      });
      return { prompt: 'Який шматок більший: 1/' + a + ' чи 1/' + b + '?', visual: makePizza(Math.max(a, b), [], 120), options, explain: 'Чим менший знаменник, тим більший шматок: 1/' + a + ' > 1/' + b + '.' };
    }
    if (type === 1) {
      const n = rand(1, 6), d = rand(n + 1, 9);
      const correct = n + '/' + d;
      const options = buildOpts(correct, () => rand(1, d) + '/' + d);
      const eaten = [];
      for (let i = n; i < d; i++) eaten.push(i);
      return { prompt: 'Скільки це ' + n + ' шматків з ' + d + '? Запиши дріб.', visual: makePizza(d, eaten, 140), options, explain: n + ' шматків з ' + d + ' = ' + n + '/' + d + '.' };
    }
    if (type === 2) {
      const n = rand(1, 5), d = rand(n + 1, 9);
      const optsTexts = ['чисельник — скільки шматків узяли', 'знаменник — на скільки розрізали', 'ціле число', 'відсоток'];
      const eaten = [];
      for (let i = n; i < d; i++) eaten.push(i);
      if (Math.random() < 0.5) {
        const options = shuffle(optsTexts.map(t => ({ text: t, correct: t === optsTexts[0] })));
        return { prompt: 'У дробі ' + n + '/' + d + ' що таке число ' + n + ' (зверху)?', visual: makePizza(d, eaten, 140), options, explain: n + ' — це чисельник: скільки шматків узяли.' };
      } else {
        const options = shuffle(optsTexts.map(t => ({ text: t, correct: t === optsTexts[1] })));
        return { prompt: 'У дробі ' + n + '/' + d + ' що таке число ' + d + ' (знизу)?', visual: makePizza(d, eaten, 140), options, explain: d + ' — це знаменник: на скільки рівних шматків розрізали.' };
      }
    }
    const n = rand(1, 4), d = rand(2, 5);
    const k = rand(2, 4);
    const correct = (n * k) + '/' + (d * k);
    const options = buildOpts(correct, () => rand(1, 9) + '/' + rand(2, 9));
    const eaten = [];
    for (let i = n; i < d; i++) eaten.push(i);
    return { prompt: 'Який дріб рівний ' + n + '/' + d + '?', visual: makePizza(d, eaten, 120), options, explain: n + '/' + d + ' = ' + (n * k) + '/' + (d * k) + ' (помножили верх і низ на ' + k + ').' };
  };

  G.mixed = function () {
    const type = rand(0, 3);
    if (type === 0) {
      const w = rand(1, 4), n = rand(1, 6), d = rand(n + 1, 9);
      const correct = (w * d + n) + '/' + d;
      const options = buildOpts(correct, () => rand(1, 20) + '/' + d);
      return { prompt: 'Перетвори мішане число ' + w + ' ' + n + '/' + d + ' у неправильний дріб.', visual: '', options, explain: w + ' ' + n + '/' + d + ' = (' + w + '·' + d + '+' + n + ')/' + d + ' = ' + (w * d + n) + '/' + d + '.' };
    }
    if (type === 1) {
      const d = rand(2, 9);
      const w = rand(1, 4);
      const r = rand(1, d - 1);
      const N = w * d + r;
      const correct = w + ' ' + r + '/' + d;
      const options = buildOpts(correct, () => {
        const w2 = rand(0, 5), r2 = rand(0, d - 1);
        return r2 === 0 ? String(w2) : (w2 + ' ' + r2 + '/' + d);
      });
      return { prompt: 'Перетвори неправильний дріб ' + N + '/' + d + ' у мішане число.', visual: '', options, explain: N + ':' + d + ' = ' + w + ' (ост. ' + r + '), тому ' + N + '/' + d + ' = ' + w + ' ' + r + '/' + d + '.' };
    }
    if (type === 2) {
      const d = rand(3, 9);
      const n1 = rand(1, 3), n2 = rand(1, 3);
      const w1 = rand(1, 4), w2 = rand(1, 4);
      const sumN = n1 + n2;
      const carry = Math.floor(sumN / d);
      const rem = sumN % d;
      const totalW = w1 + w2 + carry;
      const g = gcd(rem || 1, d);
      const sr = rem > 0 ? rem / g : 0;
      const sd = rem > 0 ? d / g : 1;
      const correctStr = rem > 0 ? (totalW + ' ' + sr + '/' + sd) : String(totalW);
      const options = buildOpts(correctStr, () => {
        const w = rand(0, 8), r = rand(0, d - 1);
        return r === 0 ? String(w) : (w + ' ' + r + '/' + d);
      });
      return { prompt: w1 + ' ' + n1 + '/' + d + ' + ' + w2 + ' ' + n2 + '/' + d + ' = ?', visual: '', options, explain: 'Цілі: ' + w1 + '+' + w2 + '=' + (w1 + w2) + ', дроби: ' + n1 + '/' + d + '+' + n2 + '/' + d + '=' + sumN + '/' + d + '. Разом ' + correctStr + '.' };
    }
    const d = rand(3, 9);
    const w1 = rand(2, 5), w2 = rand(1, w1 - 1);
    const n1 = rand(1, 2), n2 = rand(n1 + 1, d - 1);
    const resW = w1 - 1 - w2;
    const resN = n1 + d - n2;
    const g = gcd(resN, d);
    const simpN = resN / g, simpD = d / g;
    const correctFinal = (resW > 0 && simpN > 0) ? (resW + ' ' + simpN + '/' + simpD) : (simpN > 0 ? (simpN + '/' + simpD) : String(resW));
    const options = buildOpts(correctFinal, () => {
      const w = rand(0, 6), r = rand(0, d - 1);
      const g2 = gcd(r || 1, d);
      return r === 0 ? String(w) : (w + ' ' + (r / g2) + '/' + (d / g2));
    });
    return { prompt: w1 + ' ' + n1 + '/' + d + ' − ' + w2 + ' ' + n2 + '/' + d + ' = ?', visual: '', options, explain: 'Позичаємо 1 цілу. Результат ' + correctFinal + '.' };
  };

  G.adding = function () {
    const type = rand(0, 4);
    if (type === 0) {
      const b = rand(3, 12);
      const a = rand(1, b - 2), c = rand(1, b - a - 1);
      const sum = a + c;
      const s = simp(sum, b);
      const correct = (s.n >= s.d) ? toMixedStr(s.n, s.d) : (s.n + '/' + s.d);
      const options = buildOpts(correct, () => {
        const n = rand(1, b - 1), d = b;
        const ss = simp(n, d);
        return (ss.n >= ss.d) ? toMixedStr(ss.n, ss.d) : (ss.n + '/' + ss.d);
      });
      return { prompt: a + '/' + b + ' + ' + c + '/' + b + ' = ?', visual: '', options, explain: 'Додаємо чисельники: ' + a + '+' + c + '=' + sum + ', знаменник ' + b + '. Результат ' + correct + '.' };
    }
    if (type === 1) {
      const b = rand(3, 12);
      const a = rand(2, b - 1), c = rand(1, a - 1);
      const diff = a - c;
      const s = simp(diff, b);
      const correct = (s.n >= s.d) ? toMixedStr(s.n, s.d) : (s.n + '/' + s.d);
      const options = buildOpts(correct, () => {
        const n = rand(1, b - 1), d = b;
        const ss = simp(n, d);
        return (ss.n >= ss.d) ? toMixedStr(ss.n, ss.d) : (ss.n + '/' + ss.d);
      });
      return { prompt: a + '/' + b + ' − ' + c + '/' + b + ' = ?', visual: '', options, explain: 'Віднімаємо чисельники: ' + a + '−' + c + '=' + diff + ', знаменник ' + b + '. Результат ' + correct + '.' };
    }
    if (type === 2) {
      const g = rand(2, 6);
      const n = rand(1, 6), d = rand(n + 1, 9);
      const N = n * g, D = d * g;
      const s = simp(N, D);
      const correct = s.n + '/' + s.d;
      const options = buildOpts(correct, () => rand(1, 9) + '/' + rand(2, 9));
      return { prompt: 'Скороти дріб ' + N + '/' + D + '.', visual: '', options, explain: N + '/' + D + ' = ' + s.n + '/' + s.d + ' (поділили на ' + g + ').' };
    }
    if (type === 3) {
      const b = rand(2, 6), a = rand(1, b - 1);
      const k = rand(2, 5);
      const D = b * k;
      const correct = String(a * k);
      const options = buildOpts(correct, () => String(rand(1, D)));
      return { prompt: a + '/' + b + ' = ?/' + D + '. Знайди чисельник.', visual: '', options, explain: a + '/' + b + ' = ' + (a * k) + '/' + (b * k) + ' = ' + (a * k) + '/' + D + '.' };
    }
    const b = rand(3, 12);
    const a = rand(1, b - 2), c = rand(a + 1, b - 1);
    const correct = c + '/' + b;
    const options = buildOpts(correct, () => rand(1, b - 1) + '/' + b);
    return { prompt: 'Яка дріб більша: ' + a + '/' + b + ' чи ' + c + '/' + b + '?', visual: '', options, explain: 'Знаменники однакові, більший чисельник → більша дріб: ' + c + '/' + b + '.' };
  };
})();