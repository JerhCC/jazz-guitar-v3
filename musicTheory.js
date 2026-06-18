export const NOTE_NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
export const OPEN_PC = [4, 9, 2, 7, 11, 4]; // open pitch classes: low E, A, D, G, B, high e
export const STRING_FREQ = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];

// Chord templates: interval sets relative to root. Order = priority.
export const TEMPLATES = [
  { suffix: 'maj7', ints: [0, 4, 7, 11] },
  { suffix: '7',    ints: [0, 4, 7, 10] },
  { suffix: 'm7',   ints: [0, 3, 7, 10] },
  { suffix: 'm7b5', ints: [0, 3, 6, 10] },
  { suffix: 'dim7', ints: [0, 3, 6, 9] },
  { suffix: '6',    ints: [0, 4, 7, 9] },
  { suffix: 'm6',   ints: [0, 3, 7, 9] },
  { suffix: '',     ints: [0, 4, 7] },   // major triad
  { suffix: 'm',    ints: [0, 3, 7] },   // minor triad
  { suffix: 'dim',  ints: [0, 3, 6] },
  { suffix: 'aug',  ints: [0, 4, 8] },
  { suffix: 'sus4', ints: [0, 5, 7] },
  { suffix: 'sus2', ints: [0, 2, 7] },
  { suffix: '5',    ints: [0, 7] },
];

export function pcSetFromFrets(frets) {
  const pcs = [];
  let bass = null;
  frets.forEach((f, i) => {
    if (f < 0) return;
    const pc = (OPEN_PC[i] + f) % 12;
    if (bass === null) bass = pc;
    pcs.push(pc);
  });
  return { pcs: [...new Set(pcs)], bass };
}

export function identifyChord(pcs, bass) {
  if (!pcs || pcs.length < 2) return [];
  const present = new Set(pcs);
  const results = [];
  for (let root = 0; root < 12; root++) {
    if (!present.has(root)) continue;
    const intervals = new Set(pcs.map((p) => (p - root + 12) % 12));
    TEMPLATES.forEach((t, ti) => {
      const tset = new Set(t.ints);
      let extra = 0, matched = 0, missing = 0;
      intervals.forEach((iv) => (tset.has(iv) ? matched++ : extra++));
      tset.forEach((iv) => { if (!intervals.has(iv)) missing++; });
      if (extra > 0) return;
      if (missing > 1) return;
      results.push({ root, suffix: t.suffix, missing, matched, ti, isBass: root === bass });
    });
  }
  results.sort((a, b) =>
    a.missing - b.missing ||
    b.matched - a.matched ||
    (b.isBass - a.isBass) ||
    a.ti - b.ti
  );
  const seen = new Set();
  const out = [];
  results.forEach((r) => {
    const name = NOTE_NAMES[r.root] + r.suffix;
    if (!seen.has(name)) { seen.add(name); out.push({ name, missing: r.missing }); }
  });
  return out.slice(0, 4);
}

export function parseFretInput(raw) {
  const s = (raw || '').trim();
  if (!s) return null;
  let tokens;
  if (/[\s,]/.test(s)) tokens = s.split(/[\s,]+/).filter(Boolean);
  else tokens = s.split('');
  if (tokens.length !== 6) return null;
  const frets = [];
  for (const tk of tokens) {
    if (/^[xX\-mM]$/.test(tk)) frets.push(-1);
    else if (/^\d{1,2}$/.test(tk)) frets.push(parseInt(tk, 10));
    else return null;
  }
  return frets;
}
