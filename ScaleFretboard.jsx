import React from 'react';

export function ScaleFretboard({ rootPc, intervals }) {
  const FRETS = 12;
  const padL = 26, padR = 12, padT = 12, padB = 20;
  const nutGap = 16, fw = 26, rowGap = 22;
  const nutX = padL + nutGap;
  const w = nutX + FRETS * fw + padR;
  const h = padT + 5 * rowGap + padB;
  const NOTE = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
  const STR = ['E', 'A', 'D', 'G', 'B', 'e'];
  const OPENPC = [4, 9, 2, 7, 11, 4];
  const scalePCs = new Set(intervals.map((iv) => (rootPc + iv) % 12));
  const y = (i) => padT + i * rowGap;
  const inlays = [3, 5, 7, 9, 12];

  const dots = [];
  for (let s = 0; s < 6; s++) {
    for (let f = 0; f <= FRETS; f++) {
      const pc = (OPENPC[s] + f) % 12;
      if (!scalePCs.has(pc)) continue;
      const cx = f === 0 ? padL + nutGap / 2 : nutX + (f - 0.5) * fw;
      dots.push({ cx, cy: y(s), isRoot: pc === rootPc, label: NOTE[pc] });
    }
  }

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="mx-auto block">
      <line x1={padL} y1={y(0)} x2={nutX + FRETS * fw} y2={y(0)} stroke="#cbd5e1" strokeWidth={3} strokeLinecap="round" />
      {inlays.map((f) => (
        <circle key={f} cx={nutX + (f - 0.5) * fw} cy={y(2.5)} r={1.8} fill="#94a3b8" opacity="0.5" />
      ))}
      {Array.from({ length: FRETS }, (_, f) => f + 1).map((f) => (
        <line key={`f${f}`} x1={nutX + (f - 0.5) * fw} y1={y(0)} x2={nutX + (f - 0.5) * fw} y2={y(5)} stroke="#475569" strokeWidth={1} />
      ))}
      {STR.map((_, s) => (
        <line key={`s${s}`} x1={padL} y1={y(s)} x2={nutX + FRETS * fw} y2={y(s)} stroke="#64748b" strokeWidth={s === 0 ? 1.8 : 1.4} />
      ))}
      {STR.map((str, s) => (
        <text key={`label${s}`} x={padL - 8} y={y(s) + 4} fontSize={10} fill="#94a3b8" textAnchor="end" fontWeight="600">{str}</text>
      ))}
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.isRoot ? 4.5 : 3} fill={d.isRoot ? '#FF6B35' : '#0e7490'} />
      ))}
    </svg>
  );
}
