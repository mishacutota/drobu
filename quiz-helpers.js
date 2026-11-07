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
  DQ.buildOpts = function (correct, distractorFn) {
    const set = new Set([correct]);
    const arr = [correct];
    let guard = 0;
    while (arr.length < 4 && guard < 200) {
      guard++;
      const d = distractorFn();
      if (d == null) continue;
      const s = String(d);
      if (!set.has(s)) { set.add(s); arr.push(s); }
    }
    let pad = 1;
    while (arr.length < 4) { arr.push(correct + ' ' + pad++); }
    const sh = DQ.shuffle(arr);
    return sh.map(t => ({ text: t, correct: t === correct }));
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