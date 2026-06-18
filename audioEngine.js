import { STRING_FREQ } from './musicTheory'

export function useGuitarAudio() {
  let ctxRef = null;

  const getCtx = () => {
    if (!ctxRef) ctxRef = new (window.AudioContext || window.webkitAudioContext)();
    return ctxRef;
  };

  const pluck = (ctx, freq, when, dest) => {
    const sr = ctx.sampleRate;
    const dur = 2.4;
    const N = Math.max(2, Math.round(sr / freq));
    const len = Math.floor(sr * dur);
    const buf = ctx.createBuffer(1, len, sr);
    const d = buf.getChannelData(0);
    const delay = new Float32Array(N);
    for (let i = 0; i < N; i++) delay[i] = Math.random() * 2 - 1;
    let idx = 0;
    const damp = 0.996;
    for (let i = 0; i < len; i++) {
      const cur = delay[idx];
      const nxt = delay[(idx + 1) % N];
      d[i] = cur;
      delay[idx] = 0.5 * (cur + nxt) * damp;
      idx = (idx + 1) % N;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 3600;
    const g = ctx.createGain();
    g.gain.value = 0.9;
    src.connect(lp); lp.connect(g); g.connect(dest);
    src.start(when);
  };

  const scheduleChord = (frets, when) => {
    const ctx = getCtx();
    const master = ctx.createGain();
    master.gain.value = 0.5;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp); comp.connect(ctx.destination);
    let s = 0;
    frets.forEach((f, i) => {
      if (f < 0) return;
      const freq = STRING_FREQ[i] * Math.pow(2, f / 12);
      pluck(ctx, freq, when + s * 0.03, master);
      s++;
    });
  };

  const playChord = (frets) => {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    scheduleChord(frets, ctx.currentTime);
  };

  const scheduleClick = (when, accent) => {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.value = accent ? 2000 : 1300;
    osc.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(accent ? 0.22 : 0.1, when + 0.001);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.05);
    osc.start(when); osc.stop(when + 0.06);
  };

  const playScale = (rootPc, intervals) => {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const master = ctx.createGain();
    master.gain.value = 0.5;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp); comp.connect(ctx.destination);
    const base = 220 * Math.pow(2, (rootPc - 9) / 12);
    const up = [...intervals, 12];
    const seq = [...up, ...up.slice(0, -1).reverse()];
    const now = ctx.currentTime + 0.05;
    seq.forEach((semi, i) => {
      pluck(ctx, base * Math.pow(2, semi / 12), now + i * 0.26, master);
    });
  };

  return { getCtx, playChord, scheduleChord, scheduleClick, playScale };
}
