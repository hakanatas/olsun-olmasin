/* SAHNE 1 — TORBA (0–10 s)  3 sarı, 7 siyah top.
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  /* ---- boxes and equal objects: cabinet projection, x right, y back, z up ---- */
  const Pj = (O, c, x, y, z) => [O[0] + x * c + y * c * 0.5, O[1] - z * c - y * c * 0.5];
  function poly(ctx, P, a, fill, seed, w = 3) {
    ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    fill.forEach((f) => { if (f) { ctx.fillStyle = f; ctx.fill(); } });
    Ink.path(ctx, P.concat([P[0]]), { w, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** a solid block x..x+dx, y..y+dy, z..z+dz */
  function block(ctx, O, c, x, y, z, dx, dy, dz, a, h, seed) {
    if (a <= 0) return;
    const P = (i, j, k) => Pj(O, c, x + i * dx, y + j * dy, z + k * dz), H = h > 0 ? amber(a * 0.6 * h) : null;
    poly(ctx, [P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)], a, [amber(a * 0.2), H], seed, 2.5);
    poly(ctx, [P(1, 0, 0), P(1, 1, 0), P(1, 1, 1), P(1, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.14})`, H], seed + 1, 2.5);
    poly(ctx, [P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.04})`, H], seed + 2, 2.5);
  }
  function ball(ctx, O, c, x, y, z, a, seed) {
    if (a <= 0) return; const C = Pj(O, c, x + 0.5, y + 0.5, z + 0.5), r = c * 0.47;
    ctx.beginPath(); ctx.arc(C[0], C[1], r, 0, 7);
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    const g = ctx.createRadialGradient(C[0] - r * 0.35, C[1] - r * 0.35, r * 0.1, C[0], C[1], r);
    g.addColorStop(0, amber(a * 0.12)); g.addColorStop(1, amber(a * 0.45)); ctx.fillStyle = g; ctx.fill();
    const P = []; for (let i = 0; i <= 28; i++) P.push([C[0] + r * Math.cos(i / 28 * 6.2832), C[1] + r * Math.sin(i / 28 * 6.2832)]);
    Ink.path(ctx, P, { w: 2.5, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** items [{x,y,z,dx,dy,dz}] in painter's order, each with a fill index i */
  function fillList(L, W, H, dx = 1) {
    const out = [];
    for (let z = 0; z < H; z++) for (let y = W - 1; y >= 0; y--) for (let x = 0; x < L; x += dx) out.push({ x, y, z, dx, dy: 1, dz: 1 });
    out.forEach((q, i) => (q.i = i));
    return out.slice().sort((p, q) => q.y - p.y || p.x - q.x || p.z - q.z);
  }
  const shown = (t, t0, dt, n) => Math.max(0, Math.min(n, Math.floor((t - t0) / dt + 0.4)));
  /** an open glass box: back walls first, then the contents, then the front edges */
  function container(ctx, O, c, L, W, H, a, seed, draw) {
    if (a <= 0) return;
    const P = (x, y, z) => Pj(O, c, x, y, z), ink = `rgba(${LI.INK_RGB},${a * 0.05})`;
    poly(ctx, [P(0, W, 0), P(L, W, 0), P(L, W, H), P(0, W, H)], a * 0.8, [ink], seed, 2);
    poly(ctx, [P(0, 0, 0), P(0, W, 0), P(0, W, H), P(0, 0, H)], a * 0.8, [ink], seed + 1, 2);
    poly(ctx, [P(0, 0, 0), P(L, 0, 0), P(L, W, 0), P(0, W, 0)], a * 0.8, [ink], seed + 2, 2);
    if (draw) draw();
    [[[0, 0, 0], [L, 0, 0]], [[L, 0, 0], [L, 0, H]], [[L, 0, H], [0, 0, H]], [[0, 0, H], [0, 0, 0]], [[L, 0, 0], [L, W, 0]], [[L, W, 0], [L, W, H]], [[L, W, H], [L, 0, H]], [[0, W, H], [L, W, H]], [[0, 0, H], [0, W, H]]]
      .forEach(([p, q], i) => Ink.path(ctx, [P(...p), P(...q)], { w: 3, alpha: a * 0.85, seed: seed + 10 + i, taper: [0, 0] }));
  }
  function fillBox(ctx, O, c, L, W, H, t, t0, dt, a, seed, kind = 'cube', hot = 0) {
    const dx = kind === 'brick' ? 2 : 1, items = fillList(L, W, H, dx);
    container(ctx, O, c, L, W, H, a, seed, () => items.forEach((q) => {
      const k = seg(t, t0 + q.i * dt, t0 + q.i * dt + 0.35); if (k <= 0) return;
      const dz = (1 - inOut(k)) * (H + 1 - q.z);
      if (kind === 'ball') ball(ctx, O, c, q.x, q.y, q.z + dz, a * k, seed + 100 + q.i * 3);
      else block(ctx, O, c, q.x, q.y, q.z + dz, q.dx, 1, 1, a * k, hot, seed + 100 + q.i * 3);
    }));
    return items.length;
  }
  function tag(ctx, env, O, c, L, text, a, hot) {
    if (a <= 0) return; const s = KD.L(env).G.s;
    F().T(ctx, text, O[0] + L * c / 2, O[1] + s * 0.95, { size: s * 0.66, alpha: a, halo: true, color: hot ? A.amber : undefined });
  }
  /** cubes of an L × W × H prism; when(q) gives each cube's arrival time (Infinity = never) */
  function cubes(L, W, H) {
    const out = [];
    for (let z = 0; z < H; z++) for (let y = W - 1; y >= 0; y--) for (let x = 0; x < L; x++) out.push({ x, y, z });
    return out.sort((p, q) => q.y - p.y || p.x - q.x || p.z - q.z);
  }
  function fillT(ctx, O, c, B, t, a, when, hot, seed) {
    let n = 0;
    container(ctx, O, c, B[0], B[1], B[2], a, seed, () => cubes(...B).forEach((q, i) => {
      const t0 = when(q); if (!(t >= t0)) return; n++;
      const k = seg(t, t0, t0 + 0.3);
      block(ctx, O, c, q.x, q.y, q.z + (1 - inOut(k)) * 1.2, 1, 1, 1, a * k, hot ? hot(q) : 0, seed + 100 + i * 3);
    }));
    return n;
  }
  function edges(ctx, env, O, c, B, a, labels) {
    if (a <= 0) return; const s = KD.L(env).G.s, o = { size: s * 0.7, alpha: a, halo: true, color: A.amber };
    const m = (p, q) => { const P = Pj(O, c, ...p), Q = Pj(O, c, ...q); return [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2]; };
    const [L, W, H] = B;
    let q = m([0, 0, 0], [L, 0, 0]); F().T(ctx, labels[0], q[0], q[1] + 36, o);
    q = m([L, 0, 0], [L, W, 0]); F().T(ctx, labels[1], q[0] + 50, q[1] + 12, o);
    q = m([L, W, 0], [L, W, H]); F().T(ctx, labels[2], q[0] + 48, q[1], o);
  }
  function tally(ctx, env, t, rows) {
    const T = KD.L(env).TL;
    rows.forEach(([t0, t1, txt, hot], i) => { const al = win(t, t0, t1) * END(t); if (al > 0) F().T(ctx, txt, T.x, T.y[i], { size: T.s, alpha: al, halo: true, color: hot ? A.amber : undefined }); });
  }

  /** a row of outcomes; inA(i) decides the event; ring = emphasis 0..1 for A, ringB for A′ */
  function tokens(ctx, env, n, labels, inA, t, t0, a, ringA, ringB, seed) {
    if (a <= 0) return; const T = KD.L(env).TK, s = KD.L(env).G.s, gap = Math.min(T.gap, T.W / n), r = Math.min(T.r, gap * 0.42);
    for (let i = 0; i < n; i++) {
      const k = seg(t, t0 + i * 0.06, t0 + i * 0.06 + 0.3); if (k <= 0) continue;
      const x = T.x + (i - (n - 1) / 2) * gap, y = T.y - (1 - k) * 30, A_ = inA(i), al = a * k;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = `rgba(${LI.PAPER_RGB},${al})`; ctx.fill();
      ctx.fillStyle = A_ ? amber(al * 0.75) : `rgba(${LI.INK_RGB},${al * 0.14})`; ctx.fill();
      const P = []; for (let j = 0; j <= 24; j++) P.push([x + r * Math.cos(j / 24 * 6.2832), y + r * Math.sin(j / 24 * 6.2832)]);
      Ink.path(ctx, P, { w: 2.5, alpha: al * 0.9, seed: seed + i, taper: [0, 0] });
      if (labels) F().T(ctx, labels(i), x, y + 1, { size: r * 0.95, alpha: al });
      const g = A_ ? ringA : ringB;
      if (g > 0) { const Q = []; for (let j = 0; j <= 24; j++) Q.push([x + (r + 9) * Math.cos(j / 24 * 6.2832), y + (r + 9) * Math.sin(j / 24 * 6.2832)]); Ink.path(ctx, Q, { w: 3, alpha: al * g, seed: seed + 50 + i, taper: [0, 0], color: A_ ? LI.AMBER_RGB : LI.INK_RGB }); }
    }
  }
  function under(ctx, env, text, a, hot, dy = 0) { if (a <= 0) return; const T = KD.L(env).TK, s = KD.L(env).G.s; F().T(ctx, text, T.x, T.y + T.r + s * 1.2 + dy, { size: s * 0.8, alpha: a, halo: true, color: hot ? A.amber : undefined }); }
  const PR = [2, 3, 5, 7, 11, 13, 17, 19];

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Torbadan bir top çekiyoruz'],
      [10.6, 27.8, 'Olası tüm çıktılar: A ve A′'],
      [28.4, 45.8, 'Başka deneylerde de olur mu?'],
      [46.4, 63.8, 'Genelleyelim'],
      [64.4, 79.8, 'Tümleyenle hızlı hesap'],
    ]);
  }

  function figure(ctx, env, t) {
    const L = KD.L(env), a = END(t), s = L.G.s;
    // S1–S2: the bag of 10 balls
    const aB = a * win(t, 4.6, 27.8);
    tokens(ctx, env, 10, null, (i) => i < 3, t, 5.0, aB, win(t, 11.4, 15.8) + win(t, 20.6, 27.8), win(t, 16.0, 19.8) + win(t, 20.6, 27.8), 98000);
    under(ctx, env, t < 16.0 ? 'P(A) = 3/10' : t < 20.4 ? 'P(A′) = 7/10' : '3/10 + 7/10 = 10/10 = 1', aB * seg(t, 12.6, 13.0), t > 20.4);
    // S3: a die, a spinner, number cards
    const ex = [[6, (i) => String(i + 1), (i) => i === 5, 29.2, 34.2, '6 gelmesi: 1/6 · gelmemesi: 5/6'], [8, (i) => String(i + 1), (i) => (i + 1) % 2 === 0, 34.4, 39.4, 'çift sayı: 4/8 · çift olmayan: 4/8'], [20, (i) => String(i + 1), (i) => PR.includes(i + 1), 39.6, 45.8, 'asal: 8/20 · asal olmayan: 12/20']];
    ex.forEach(([n, lab, inA, t0, t1, txt], j) => {
      const q = a * win(t, t0, t1); if (q <= 0) return;
      tokens(ctx, env, n, lab, inA, t, t0 + 0.2, q, seg(t, t0 + 1.4, t0 + 1.8), 0, 98100 + j * 100);
      under(ctx, env, txt, q * seg(t, t0 + 2.2, t0 + 2.6), false);
    });
    tally(ctx, env, t, [[33.0, 45.8, 'Zar: 1/6 + 5/6 = 1'], [38.2, 45.8, 'Çark: 4/8 + 4/8 = 1'], [43.4, 45.8, 'Kartlar: 8/20 + 12/20 = 1', true]]);
    // S4: a bar of all outcomes, split between A and A′
    const aR = a * win(t, 46.8, 63.8);
    if (aR > 0) {
      const B = L.BAR, keys = [[47.0, 0.3], [52.0, 0.3], [53.4, 0.7], [56.0, 0.7], [57.4, 0.15], [63.8, 0.15]];
      let p = 0.3; for (let i = 0; i < keys.length - 1; i++) if (t >= keys[i][0] && t <= keys[i + 1][0]) p = lerp(keys[i][1], keys[i + 1][1], inOut(seg(t, keys[i][0], keys[i + 1][0])));
      const k = seg(t, 47.2, 47.8), xm = lerp(B.x0, B.x1, p);
      const R = (x0, x1, fill, sd) => { const P = [[x0, B.y], [x1, B.y], [x1, B.y + B.h], [x0, B.y + B.h]]; ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); Ink.path(ctx, P.concat([P[0]]), { w: 3, alpha: aR * k, seed: sd, taper: [0, 0] }); };
      R(B.x0, xm, amber(aR * k * 0.6), 98500); R(xm, B.x1, `rgba(${LI.INK_RGB},${aR * k * 0.12})`, 98510);
      const f = (v) => v.toFixed(2).replace(/0$/, '').replace('.', ',');
      F().T(ctx, 'tüm çıktılar: 1', (B.x0 + B.x1) / 2, B.y - s * 0.7, { size: s * 0.7, alpha: aR * k, halo: true });
      F().T(ctx, `A: ${f(p)}`, (B.x0 + xm) / 2, B.y + B.h + s * 0.7, { size: s * 0.7, alpha: aR * k, halo: true, color: A.amber });
      F().T(ctx, `A′: ${f(1 - p)}`, (xm + B.x1) / 2, B.y + B.h + s * 0.7, { size: s * 0.7, alpha: aR * k, halo: true });
    }
    // S5: using the complement
    tally(ctx, env, t, [[65.6, 79.8, 'Yağmur yağma olasılığı 0,35 → yağmama: 1 − 0,35 = 0,65'], [68.8, 79.8, 'Zarda 1 gelmeme: 1 − 1/6 = 5/6'], [72.0, 79.8, 'Hedefi vurma 0,8 → ıskalama: 1 − 0,8 = 0,2', true]]);
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[5.6, 10.2, 'Torbada 3 sarı, 7 siyah top var'],
      [11.4, 15.8, 'Olası tüm çıktılar 10 top; A: sarı top çekmek'], [16.0, 20.4, 'A′: sarı top çekmemek, A’nın tümleyeni'], [20.6, 27.8, 'Her çıktı ya A’da ya A′nde'],
      [29.4, 45.8, 'Her deneyde A ile A′nün olasılıklarını toplayalım'],
      [47.4, 63.8, 'A ve A′ tüm çıktıları paylaşır'],
      [65.4, 79.8, 'Bazen tümleyeni hesaplamak daha kolay']]);
    exprs(ctx, t, at(W, 1), [[7.4, 10.2, 'Bir top çekelim: sarı gelme olasılığı ne?'],
      [23.0, 27.8, 'İkisi birlikte bütün torbayı kaplar'],
      [50.0, 63.8, 'Biri büyüyünce öteki küçülür; toplam hep 1'],
      [75.0, 79.8, 'Olmama olasılığı = 1 − olma olasılığı']]);
    exprs(ctx, t, at(W, 2), [[8.8, 10.2, 'A olayı: sarı top çekmek', true], [24.6, 27.8, 'P(A) + P(A′) = 1', true],
      [43.8, 45.8, 'Her seferinde toplam 1!', true],
      [56.0, 63.8, 'P(A′) = 1 − P(A)', true],
      [77.0, 79.8, 'Tümleyen hesabı kısaltır', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Olası tüm çıktıları belirle', 80.6], ['A′: A olayının olmaması', 81.6], ['P(A) + P(A′) = 1', 82.6], ['P(A′) = 1 − P(A)', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'A bag', nameTr: 'Torba', concept: '3 amber, 7 black', conceptTr: '3 sarı, 7 siyah', render });
})(window.LI = window.LI || {});
