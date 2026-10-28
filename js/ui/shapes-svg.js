const shapes = {
  circle: (c, s) => `<circle cx="50" cy="50" r="42" fill="${c}" stroke="${s}" stroke-width="5"/>`,
  square: (c, s) => `<rect x="10" y="10" width="80" height="80" rx="12" fill="${c}" stroke="${s}" stroke-width="5"/>`,
  triangle: (c, s) => `<polygon points="50,7 94,91 6,91" fill="${c}" stroke="${s}" stroke-width="5" stroke-linejoin="round"/>`,
  rectangle: (c, s) => `<rect x="7" y="25" width="86" height="50" rx="8" fill="${c}" stroke="${s}" stroke-width="5"/>`,
  rhombus: (c, s) => `<polygon points="50,5 95,50 50,95 5,50" fill="${c}" stroke="${s}" stroke-width="5"/>`,
  star: (c, s) => `<polygon points="50,5 62,36 95,38 69,58 78,92 50,72 22,92 31,58 5,38 38,36" fill="${c}" stroke="${s}" stroke-width="5" stroke-linejoin="round"/>`,
  oval: (c, s) => `<ellipse cx="50" cy="50" rx="46" ry="30" fill="${c}" stroke="${s}" stroke-width="5"/>`,
  hexagon: (c, s) => `<polygon points="27,8 73,8 95,50 73,92 27,92 5,50" fill="${c}" stroke="${s}" stroke-width="5" stroke-linejoin="round"/>`,
  heart: (c, s) => `<path d="M50 90 C22 70 6 54 6 34 C6 20 17 10 30 10 C40 10 47 16 50 24 C53 16 60 10 70 10 C83 10 94 20 94 34 C94 54 78 70 50 90 Z" fill="${c}" stroke="${s}" stroke-width="5" stroke-linejoin="round"/>`,
  semicircle: (c, s) => `<path d="M6 72 A44 44 0 0 1 94 72 Z" fill="${c}" stroke="${s}" stroke-width="5" stroke-linejoin="round"/>`
};
export const shapeNames = { circle: 'círculo', square: 'quadrado', triangle: 'triângulo', rectangle: 'retângulo', rhombus: 'losango', star: 'estrela', oval: 'oval', hexagon: 'hexágono', heart: 'coração', semicircle: 'meia-lua' };
export function shapeSvg(type, color, stroke = '#fff', label = 'forma') {
  return `<svg class="shape-svg" viewBox="0 0 100 100" role="img" aria-label="${label}">${shapes[type]?.(color, stroke) || ''}</svg>`;
}
// Conteúdo interno (sem a tag <svg>), para uso dentro de outro SVG.
export function shapeInner(type, color, stroke = '#fff') {
  return shapes[type]?.(color, stroke) || '';
}
