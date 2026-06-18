import React from 'react';

// Convert a frets array to standard chord-chart notation.
// e.g. [-1, -1, 0, 2, 1, 1] -> "xx0211"
// Two-digit frets (10, 11, 12) are wrapped in parentheses for clarity,
// e.g. [-1, 10, 12, 9, 11, -1] -> "x(10)(12)9(11)x"
function fretsToNotation(frets) {
  return frets
    .map((f) => {
      if (f === -1) return 'x';
      if (f >= 10) return `(${f})`;
      return String(f);
    })
    .join('');
}

export function ChordDiagram({ frets, size = 1 }) {
  const NUM_FRETS = 4;
  const padL = 18, padT = 26, padR = 14, padB = 16;
  const stringGap = 18 * size, fretGap = 24 * size;
  const w = padL + stringGap * 5 + padR;
  const h = padT + fretGap * NUM_FRETS + padB;
  const fretted = frets.filter((f) => f > 0);
  const maxFret = fretted.length ? Math.max(...fretted) : 0;
  const minFret = fretted.length ? Math.min(...fretted) : 0;
  const startFret = maxFret <= NUM_FRETS ? 1 : minFret;
  const atNut = startFret === 1;
  const sx = (i) => padL + i * stringGap;
  const fy = (k) => padT + k * fretGap;
  const my = padT - 9;
  
  const notation = fretsToNotation(frets);

  return (
    <div className="flex flex-col items-center">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="mx-auto block">
        <line x1={sx(0)} y1={fy(0)} x2={sx(5)} y2={fy(0)} stroke="#cbd5e1" strokeWidth={atNut ? 5 : 2} strokeLinecap="round" />
        {Array.from({ length: NUM_FRETS }, (_, k) => k + 1).map((k) => (
          <line key={`f${k}`} x1={sx(0)} y1={fy(k)} x2={sx(5)} y2={fy(k)} stroke="#475569" strokeWidth={2} />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={`s${i}`} x1={sx(i)} y1={fy(0)} x2={sx(i)} y2={fy(NUM_FRETS)} stroke="#64748b" strokeWidth={i === 0 ? 2.4 : 1.6} />
        ))}
        {!atNut && <text x={padL - 7} y={fy(0) + fretGap * 0.7} fontSize={11 * size} fill="#94a3b8" textAnchor="end" fontWeight="600">{startFret}</text>}
        {frets.map((f, i) => {
          if (f > 0) return null;
          const x = sx(i);
          if (f === -1) return <text key={`x${i}`} x={x} y={my + 4} fontSize={12 * size} fill="#94a3b8" textAnchor="middle" fontWeight="700">×</text>;
          return <circle key={`o${i}`} cx={x} cy={my} r={4.5 * size} fill="none" stroke="#facc15" strokeWidth={1.8} />;
        })}
        {frets.map((f, i) => {
          if (f <= 0) return null;
          const rel = f - startFret + 1;
          const cy = fy(rel - 1) + fretGap / 2;
          return <circle key={`d${i}`} cx={sx(i)} cy={cy} r={6 * size} fill="#FF6B35" stroke="#0f172a" strokeWidth={1} />;
        })}
      </svg>
      <div
        className="font-mono tracking-wide text-slate-400 mt-1 select-all"
        style={{ fontSize: `${11 * size}px`, letterSpacing: '0.08em' }}
        title="Strings low E to high e — x = muted, 0 = open"
      >
        {notation}
      </div>
    </div>
  );
}
