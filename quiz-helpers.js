/* helpers for quizzes */
window.DQ = window.DQ || {};
(function () {
  'use strict';
  const DQ = window.DQ;
  DQ.rand = function (a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; };
  DQ.gcd = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; };
  DQ.simp = function (n, d) { const g = DQ.gcd(n, d); return { n: n / g, d: d / g }; };
  DQ.lcm = function (a, b) { return Math.abs(a * b) / DQ.gcd(a, b); };
  DQ.shuffle = function (arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  DQ.parseNum = function (v) {
    if (v == null) return null;
    const s = String(v).trim();
    let m = s.match(/^(-?)(\d+)\s+(\d+)\/(\d+)$/);
    if (m) {
      const sign = m[1] === '-' ? -1 : 1;
      const w = +m[2], n = +m[3], d = +m[4];
      if (!d) return null;
      return sign * (w + n / d);
    }
    m = s.match(/^(-?)(\d+)\/(\d+)$/);
    if (m) {
      const sign = m[1] === '-' ? -1 : 1;
      const n = +m[2], d = +m[3];
      if (!d) return null;
      return sign * n / d;
    }
    m = s.match(/^(-?\d+)$/);
    if (m) return +m[0];
    return null;
  };
  DQ.answerKey = function (v) {
    const n = DQ.parseNum(v);
    if (n != null && isFinite(n)) return 'N:' + n.toFixed(10);
    return 'S:' + String(v).trim();
  };
  DQ.buildOpts = function (correct, distractorFn) {
    const correctKey = DQ.answerKey(correct);
    const set = new Set([correctKey]);
    const arr = [String(correct)];
    let guard = 0;
    while (arr.length < 4 && guard < 500) {
      guard++;
      const d = distractorFn();
      if (d == null) continue;
      const key = DQ.answerKey(d);
      if (!set.has(key)) { set.add(key); arr.push(String(d)); }
    }
    let pad = 1;
    while (arr.length < 4) { arr.push(String(correct) + ' #' + pad++); }
    const sh = DQ.shuffle(arr);
    return sh.map(t => ({ text: t, correct: DQ.answerKey(t) === correctKey }));
  };
  DQ.toMixedStr = function (num, den) {
    if (den === 0) return '0';
    const neg = num < 0;
    num = Math.abs(num);
    const w = Math.floor(num / den);
    const r = num % den;
    let s;
    if (w > 0 && r > 0) {
      const g = DQ.gcd(r, den);
      s = w + ' ' + (r / g) + '/' + (den / g);
    } else if (w > 0) {
      s = String(w);
    } else if (r > 0) {
      const g = DQ.gcd(r, den);
      s = (r / g) + '/' + (den / g);
    } else {
      s = '0';
    }
    return neg ? '-' + s : s;
  };
  DQ.formatMixed = function (text) {
    if (text == null) return text;
    return String(text).replace(/(-?\d+)\s+(-?\d+)\/(\d+)|(-?\d+)\/(\d+)|(-?\d+)/g, function (m, w, n, d, n2, d2, n3) {
      if (w != null) {
        const W = parseInt(w, 10);
        const N = parseInt(n, 10);
        const Dn = parseInt(d, 10);
        if (W === 0) {
          if (typeof fracHTML === 'function') return fracHTML(N, Dn, '1.2rem');
          return N + '/' + Dn;
        }
        if (typeof mixedHTML === 'function') return mixedHTML(W, N, Dn, '1.2rem');
        return m;
      }
      if (n2 != null) {
        const N = parseInt(n2, 10);
        const Dn = parseInt(d2, 10);
        if (typeof fracHTML === 'function') return fracHTML(N, Dn, '1.2rem');
        return m;
      }
      const num = parseInt(n3, 10);
      return '<span class="qnum">' + num + '</span>';
    });
  };
  DQ.gens = DQ.gens || {};
})();