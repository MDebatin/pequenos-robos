// Renderizador compartilhado de robôs em SVG.
// Usado por "Crie seu robô", "Robôs iguais" e "Cores dos robôs".
// viewBox padrão: 0 0 220 320 (cabeça no topo, corpo no meio, pernas embaixo).

const OUTLINE = '#2d5c7a';
const INK = '#203b55';
const SW = 4;

export const defaultSpec = {
  body: 'rounded',
  color: '#3b82f6',
  head: 'round',
  headColor: '#ffe29a',
  eyes: 'round',
  mouth: 'smile',
  antenna: 'ball',
  arms: 'straight',
  legs: 'boots',
  hat: 'none',
  chest: 'none'
};

function darken(hex, amount = 0.2) {
  const match = /^#([0-9a-f]{6})$/i.exec(hex || '');
  if (!match) return OUTLINE;
  const n = parseInt(match[1], 16);
  const channel = shift => Math.max(0, Math.round(((n >> shift) & 255) * (1 - amount)));
  return `#${[16, 8, 0].map(channel).map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

const headShapes = {
  round: color => `<circle cx="110" cy="80" r="46" fill="${color}" stroke="${OUTLINE}" stroke-width="${SW}"/>`,
  square: color => `<rect x="64" y="34" width="92" height="92" rx="18" fill="${color}" stroke="${OUTLINE}" stroke-width="${SW}"/>`,
  dome: color => `<path d="M64 122 V80 A46 46 0 0 1 156 80 V122 Q156 126 152 126 H68 Q64 126 64 122 Z" fill="${color}" stroke="${OUTLINE}" stroke-width="${SW}" stroke-linejoin="round"/>`
};

const eyeShapes = {
  round: () => `<circle cx="90" cy="78" r="10" fill="#fff" stroke="${OUTLINE}" stroke-width="3"/><circle cx="130" cy="78" r="10" fill="#fff" stroke="${OUTLINE}" stroke-width="3"/><circle cx="92" cy="79" r="4.5" fill="${INK}"/><circle cx="132" cy="79" r="4.5" fill="${INK}"/>`,
  big: () => `<circle cx="90" cy="78" r="15" fill="#fff" stroke="${OUTLINE}" stroke-width="3"/><circle cx="130" cy="78" r="15" fill="#fff" stroke="${OUTLINE}" stroke-width="3"/><circle cx="92" cy="80" r="7" fill="${INK}"/><circle cx="132" cy="80" r="7" fill="${INK}"/><circle cx="95" cy="76" r="2.5" fill="#fff"/><circle cx="135" cy="76" r="2.5" fill="#fff"/>`,
  happy: () => `<path d="M78 82 Q90 68 102 82" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M118 82 Q130 68 142 82" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`,
  cyclops: () => `<circle cx="110" cy="78" r="17" fill="#fff" stroke="${OUTLINE}" stroke-width="3"/><circle cx="112" cy="79" r="8" fill="${INK}"/><circle cx="115" cy="75" r="3" fill="#fff"/>`,
  visor: () => `<rect x="68" y="66" width="84" height="24" rx="12" fill="${INK}" stroke="${OUTLINE}" stroke-width="3"/><rect x="80" y="73" width="40" height="6" rx="3" fill="#74c9ef"/>`,
  sleepy: () => `<path d="M80 80 Q90 86 100 80" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M120 80 Q130 86 140 80" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
};

const mouthShapes = {
  smile: () => `<path d="M90 102 Q110 120 130 102" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`,
  open: () => `<path d="M88 100 Q110 126 132 100 Z" fill="${INK}"/><path d="M98 108 Q110 118 122 108 Z" fill="#ff8f9c"/>`,
  surprise: () => `<circle cx="110" cy="106" r="8" fill="${INK}"/>`,
  grille: () => `<rect x="86" y="98" width="48" height="16" rx="5" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M98 98v16M110 98v16M122 98v16" stroke="${INK}" stroke-width="3"/>`,
  tongue: () => `<path d="M92 100 Q110 116 128 100" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><ellipse cx="116" cy="110" rx="6" ry="8" fill="#ff8f9c" stroke="${INK}" stroke-width="2"/>`
};

const antennaShapes = {
  none: () => '',
  ball: () => `<path d="M110 36V16" stroke="${OUTLINE}" stroke-width="5" stroke-linecap="round"/><circle cx="110" cy="12" r="8" fill="#ff91a7" stroke="${OUTLINE}" stroke-width="3"/>`,
  double: () => `<path d="M88 40V18M132 40V18" stroke="${OUTLINE}" stroke-width="5" stroke-linecap="round"/><circle cx="88" cy="14" r="7" fill="#ffd21f" stroke="${OUTLINE}" stroke-width="3"/><circle cx="132" cy="14" r="7" fill="#ffd21f" stroke="${OUTLINE}" stroke-width="3"/>`,
  ray: () => `<path d="M110 36V20" stroke="${OUTLINE}" stroke-width="5" stroke-linecap="round"/><polygon points="112,0 100,16 109,16 104,30 120,12 111,12" fill="#ffd21f" stroke="${OUTLINE}" stroke-width="2.5" stroke-linejoin="round"/>`,
  spring: () => `<path d="M110 36 L100 30 L120 24 L100 18 L120 12 L110 6" fill="none" stroke="${OUTLINE}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="110" cy="5" r="5" fill="#8bdfc3" stroke="${OUTLINE}" stroke-width="2.5"/>`
};

const hatShapes = {
  none: () => '',
  hat: () => `<path d="M66 36 L110 -2 L154 36 Z" fill="#ff8f9c" stroke="${OUTLINE}" stroke-width="${SW}" stroke-linejoin="round"/><circle cx="110" cy="0" r="6" fill="#ffd21f" stroke="${OUTLINE}" stroke-width="2.5"/>`,
  crown: () => `<path d="M72 38 L72 8 L92 24 L110 2 L128 24 L148 8 L148 38 Z" fill="#ffd21f" stroke="${OUTLINE}" stroke-width="${SW}" stroke-linejoin="round"/><circle cx="110" cy="26" r="4" fill="#ef5350"/>`,
  bow: () => `<path d="M134 30 L116 22 L134 14 Z M138 22 L156 14 L156 30 Z" fill="#ff6f91" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round"/><circle cx="136" cy="22" r="4" fill="#ffd21f" stroke="${OUTLINE}" stroke-width="2"/>`,
  headphones: () => `<path d="M62 84 A48 48 0 0 1 158 84" fill="none" stroke="${INK}" stroke-width="6"/><rect x="52" y="72" width="16" height="28" rx="7" fill="#8d6ee8" stroke="${OUTLINE}" stroke-width="3"/><rect x="152" y="72" width="16" height="28" rx="7" fill="#8d6ee8" stroke="${OUTLINE}" stroke-width="3"/>`,
  helmet: () => `<path d="M60 70 A50 50 0 0 1 160 70 L160 60 L60 60 Z" fill="#34b982" stroke="${OUTLINE}" stroke-width="${SW}"/><rect x="56" y="56" width="108" height="12" rx="6" fill="#2b9b74" stroke="${OUTLINE}" stroke-width="3"/>`,
  glasses: () => `<circle cx="90" cy="78" r="17" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="130" cy="78" r="17" fill="none" stroke="${INK}" stroke-width="4"/><path d="M107 78h6M73 76l-10-4M147 76l10-4" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
  flower: () => `<g transform="translate(150 20)"><circle cx="-9" cy="0" r="6" fill="#ff9f43"/><circle cx="9" cy="0" r="6" fill="#ff9f43"/><circle cx="0" cy="-9" r="6" fill="#ff9f43"/><circle cx="0" cy="9" r="6" fill="#ff9f43"/><circle r="5" fill="#ffd21f" stroke="${OUTLINE}" stroke-width="2"/></g>`
};

const bodyShapes = {
  rounded: { draw: color => `<rect x="50" y="136" width="120" height="110" rx="26" fill="${color}" stroke="${OUTLINE}" stroke-width="${SW}"/>`, left: 50, right: 170 },
  oval: { draw: color => `<ellipse cx="110" cy="191" rx="68" ry="56" fill="${color}" stroke="${OUTLINE}" stroke-width="${SW}"/>`, left: 46, right: 174 },
  tall: { draw: color => `<rect x="62" y="130" width="96" height="120" rx="18" fill="${color}" stroke="${OUTLINE}" stroke-width="${SW}"/>`, left: 62, right: 158 },
  hex: { draw: color => `<path d="M62 136 H158 L178 191 L158 246 H62 L42 191 Z" fill="${color}" stroke="${OUTLINE}" stroke-width="${SW}" stroke-linejoin="round"/>`, left: 46, right: 174 },
  heart: { draw: color => `<path d="M110 250 C70 220 42 196 42 166 C42 146 58 134 76 134 C92 134 104 144 110 154 C116 144 128 134 144 134 C162 134 178 146 178 166 C178 196 150 220 110 250 Z" fill="${color}" stroke="${OUTLINE}" stroke-width="${SW}" stroke-linejoin="round"/>`, left: 46, right: 174 }
};

const chestShapes = {
  none: () => '',
  heart: () => `<path d="M110 206 C96 196 86 188 86 178 C86 170 92 166 98 166 C104 166 108 170 110 174 C112 170 116 166 122 166 C128 166 134 170 134 178 C134 188 124 196 110 206 Z" fill="#ff6f91" stroke="${OUTLINE}" stroke-width="3"/>`,
  star: () => `<polygon points="110,164 116,178 132,179 120,189 124,204 110,196 96,204 100,189 88,179 104,178" fill="#ffd21f" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round"/>`,
  ray: () => `<polygon points="114,162 96,188 108,188 102,210 126,180 114,180" fill="#ffd21f" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round"/>`,
  gear: () => `<circle cx="110" cy="186" r="17" fill="#c9d6e2" stroke="${OUTLINE}" stroke-width="3" stroke-dasharray="6 4"/><circle cx="110" cy="186" r="7" fill="#fff" stroke="${OUTLINE}" stroke-width="3"/>`,
  screen: () => `<rect x="84" y="166" width="52" height="38" rx="8" fill="#203b55" stroke="${OUTLINE}" stroke-width="3"/><path d="M92 190 L102 178 L112 188 L120 176 L128 184" fill="none" stroke="#8bdfc3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
  buttons: () => `<circle cx="92" cy="186" r="8" fill="#ffd21f" stroke="${OUTLINE}" stroke-width="3"/><circle cx="110" cy="186" r="8" fill="#ef5350" stroke="${OUTLINE}" stroke-width="3"/><circle cx="128" cy="186" r="8" fill="#34b982" stroke="${OUTLINE}" stroke-width="3"/>`
};

const armShapes = {
  none: () => '',
  straight: (l, r, color) => `<path d="M${l} 168 L${l - 30} 206 M${r} 168 L${r + 30} 206" stroke="${color}" stroke-width="14" stroke-linecap="round"/><path d="M${l} 168 L${l - 30} 206 M${r} 168 L${r + 30} 206" stroke="${OUTLINE}" stroke-width="20" stroke-linecap="round" opacity="0" /><circle cx="${l - 32}" cy="210" r="11" fill="#fff" stroke="${OUTLINE}" stroke-width="3"/><circle cx="${r + 32}" cy="210" r="11" fill="#fff" stroke="${OUTLINE}" stroke-width="3"/>`,
  claw: (l, r, color) => `<path d="M${l} 168 L${l - 28} 200 M${r} 168 L${r + 28} 200" stroke="${color}" stroke-width="14" stroke-linecap="round"/><path d="M${l - 24} 204 l-12 10 M${l - 36} 196 l-4 16 M${r + 24} 204 l12 10 M${r + 36} 196 l4 16" stroke="${OUTLINE}" stroke-width="6" stroke-linecap="round"/>`,
  wave: (l, r, color) => `<path d="M${l} 168 L${l - 30} 206 M${r} 168 L${r + 26} 130" stroke="${color}" stroke-width="14" stroke-linecap="round"/><circle cx="${l - 32}" cy="210" r="11" fill="#fff" stroke="${OUTLINE}" stroke-width="3"/><circle cx="${r + 28}" cy="124" r="11" fill="#fff" stroke="${OUTLINE}" stroke-width="3"/>`,
  strong: (l, r, color) => `<path d="M${l} 168 L${l - 26} 150 L${l - 36} 190 M${r} 168 L${r + 26} 150 L${r + 36} 190" fill="none" stroke="${color}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${l - 36}" cy="192" r="12" fill="#fff" stroke="${OUTLINE}" stroke-width="3"/><circle cx="${r + 36}" cy="192" r="12" fill="#fff" stroke="${OUTLINE}" stroke-width="3"/>`
};

const legShapes = {
  boots: color => `<rect x="74" y="244" width="24" height="36" rx="8" fill="${color}" stroke="${OUTLINE}" stroke-width="3"/><rect x="122" y="244" width="24" height="36" rx="8" fill="${color}" stroke="${OUTLINE}" stroke-width="3"/><rect x="64" y="276" width="40" height="16" rx="8" fill="#285a83" stroke="${OUTLINE}" stroke-width="3"/><rect x="116" y="276" width="40" height="16" rx="8" fill="#285a83" stroke="${OUTLINE}" stroke-width="3"/>`,
  wheels: color => `<rect x="80" y="244" width="60" height="18" rx="6" fill="${color}" stroke="${OUTLINE}" stroke-width="3"/><circle cx="84" cy="274" r="16" fill="#203b55" stroke="${OUTLINE}" stroke-width="3"/><circle cx="136" cy="274" r="16" fill="#203b55" stroke="${OUTLINE}" stroke-width="3"/><circle cx="84" cy="274" r="6" fill="#c9d6e2"/><circle cx="136" cy="274" r="6" fill="#c9d6e2"/>`,
  springs: () => `<path d="M86 244 L76 252 L96 260 L76 268 L96 276 L86 284 M134 244 L124 252 L144 260 L124 268 L144 276 L134 284" fill="none" stroke="${OUTLINE}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><rect x="66" y="282" width="40" height="12" rx="6" fill="#285a83" stroke="${OUTLINE}" stroke-width="3"/><rect x="114" y="282" width="40" height="12" rx="6" fill="#285a83" stroke="${OUTLINE}" stroke-width="3"/>`,
  tank: color => `<rect x="62" y="246" width="96" height="30" rx="15" fill="${color}" stroke="${OUTLINE}" stroke-width="3"/><circle cx="80" cy="261" r="7" fill="#fff" stroke="${OUTLINE}" stroke-width="2.5"/><circle cx="110" cy="261" r="7" fill="#fff" stroke="${OUTLINE}" stroke-width="2.5"/><circle cx="140" cy="261" r="7" fill="#fff" stroke="${OUTLINE}" stroke-width="2.5"/>`,
  long: color => `<rect x="78" y="244" width="18" height="48" rx="8" fill="${color}" stroke="${OUTLINE}" stroke-width="3"/><rect x="124" y="244" width="18" height="48" rx="8" fill="${color}" stroke="${OUTLINE}" stroke-width="3"/><ellipse cx="86" cy="294" rx="18" ry="7" fill="#285a83" stroke="${OUTLINE}" stroke-width="3"/><ellipse cx="134" cy="294" rx="18" ry="7" fill="#285a83" stroke="${OUTLINE}" stroke-width="3"/>`
};

export const robotPartOptions = {
  head: Object.keys(headShapes),
  eyes: Object.keys(eyeShapes),
  mouth: Object.keys(mouthShapes),
  antenna: Object.keys(antennaShapes),
  hat: Object.keys(hatShapes),
  body: Object.keys(bodyShapes),
  chest: Object.keys(chestShapes),
  arms: Object.keys(armShapes),
  legs: Object.keys(legShapes)
};

// Regiões de recorte usadas nas miniaturas de opções.
export const robotRegions = {
  full: '-10 -10 240 320',
  head: '40 -12 140 150',
  face: '58 50 104 76',
  top: '50 -14 120 70',
  body: '20 120 180 140',
  arms: '-10 120 240 110',
  legs: '40 236 140 68'
};

const pick = (table, key, fallbackKey) => table[key] || table[fallbackKey];

export function robotSvg(input = {}, options = {}) {
  const spec = { ...defaultSpec, ...input };
  const { size, viewBox = robotRegions.full, className = 'robot-figure', label = 'Robô', decorative = false, animated = false } = options;
  const armColor = darken(spec.color, 0.12);
  const body = pick(bodyShapes, spec.body, 'rounded');
  const attrs = size ? `width="${size}" height="${Math.round(size * 1.33)}"` : '';
  const aria = decorative ? 'aria-hidden="true"' : `role="img" aria-label="${label}"`;
  const headColor = spec.headColor || '#ffe29a';
  return `<svg class="${className}${animated ? ' is-animated' : ''}" viewBox="${viewBox}" ${attrs} ${aria}>
<ellipse cx="110" cy="302" rx="78" ry="10" fill="#b9dce8"/>
<g class="robot-legs">${pick(legShapes, spec.legs, 'boots')(armColor)}</g>
<g class="robot-arms">${pick(armShapes, spec.arms, 'straight')(body.left, body.right, armColor)}</g>
<g class="robot-body">${body.draw(spec.color)}${pick(chestShapes, spec.chest, 'none')()}</g>
<rect x="100" y="120" width="20" height="18" rx="5" fill="${armColor}" stroke="${OUTLINE}" stroke-width="3"/>
<g class="robot-head">
<g class="robot-antenna">${pick(antennaShapes, spec.antenna, 'none')()}</g>
${pick(headShapes, spec.head, 'round')(headColor)}
<g class="robot-eyes">${pick(eyeShapes, spec.eyes, 'round')()}</g>
${pick(mouthShapes, spec.mouth, 'smile')()}
${pick(hatShapes, spec.hat, 'none')()}
</g>
</svg>`;
}
