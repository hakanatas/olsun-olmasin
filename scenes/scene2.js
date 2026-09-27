/* SAHNE 2 — A VE A′ (10–28 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 2, start: 10, end: 28, name: "A and A′", nameTr: "A ve A′", concept: "3/10 + 7/10 = 1", conceptTr: "3/10 + 7/10 = 1", render });
})(window.LI = window.LI || {});
