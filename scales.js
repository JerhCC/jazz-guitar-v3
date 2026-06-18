export const SCALE_DEFS = {
  'Ionian (Major)':        [0, 2, 4, 5, 7, 9, 11],
  'Lydian':                [0, 2, 4, 6, 7, 9, 11],
  'Mixolydian':            [0, 2, 4, 5, 7, 9, 10],
  'Lydian Dominant':       [0, 2, 4, 6, 7, 9, 10],
  'Altered':               [0, 1, 3, 4, 6, 8, 10],
  'Dorian':                [0, 2, 3, 5, 7, 9, 10],
  'Aeolian (Nat. Minor)':  [0, 2, 3, 5, 7, 8, 10],
  'Locrian':               [0, 1, 3, 5, 6, 8, 10],
  'Locrian #2':            [0, 2, 3, 5, 6, 8, 10],
  'Major Pentatonic':      [0, 2, 4, 7, 9],
  'Melodic Minor':         [0, 2, 3, 5, 7, 9, 11],
};

export const CHORD_SCALES = {
  'maj7': [
    { s: 'Ionian (Major)', why: 'The home major scale — safe and consonant over maj7.' },
    { s: 'Lydian', why: 'Raised 4th adds a bright, floating, modern color.' },
  ],
  '7': [
    { s: 'Mixolydian', why: 'The default dominant scale: major with a flat 7.' },
    { s: 'Lydian Dominant', why: 'Raised 4th — great over bluesy or unresolved dominants.' },
    { s: 'Altered', why: 'Every tension at once. Use over a V7alt resolving to a minor i.' },
  ],
  'm7': [
    { s: 'Dorian', why: 'The default minor-7 scale; the natural 6th sounds hip.' },
    { s: 'Aeolian (Nat. Minor)', why: 'Darker, with a flat 6th.' },
  ],
  'm7b5': [
    { s: 'Locrian', why: 'The standard half-diminished scale.' },
    { s: 'Locrian #2', why: 'Raised 2nd softens the tension; borrowed from melodic minor.' },
  ],
  '6': [
    { s: 'Ionian (Major)', why: 'Matches the bright major-6 sound.' },
    { s: 'Major Pentatonic', why: 'Five notes, no avoid notes — easy and melodic.' },
  ],
  'm6': [
    { s: 'Dorian', why: 'The natural 6th lines up with the chord\'s 6th.' },
    { s: 'Melodic Minor', why: 'Jazz-minor color with a major 7th on top.' },
  ],
};
