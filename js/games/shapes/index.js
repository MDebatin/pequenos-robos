import { shapeLevels } from '../../data/levels/shapes.js';
import { partById } from '../../data/robot-parts.js';
import { shapeSvg, shapeInner, shapeNames } from '../../ui/shapes-svg.js';
import { shuffle } from '../helpers.js';

const OUTLINE = '#397a9c';

// Cenário base de cada composição. As peças encaixáveis são desenhadas por cima e o rosto por último.
const scenes = {
  classic: {
    base: `<ellipse cx="180" cy="337" rx="100" ry="13" fill="#b9dce8"/><rect x="92" y="137" width="176" height="125" rx="25" fill="#91d7ed" stroke="${OUTLINE}" stroke-width="4"/><rect x="57" y="150" width="36" height="84" rx="17" fill="#ffbd70" stroke="${OUTLINE}" stroke-width="4"/><rect x="267" y="150" width="36" height="84" rx="17" fill="#ffbd70" stroke="${OUTLINE}" stroke-width="4"/><path d="M180 38V18" stroke="${OUTLINE}" stroke-width="5"/><circle cx="180" cy="13" r="9" fill="#ff91a7"/>`,
    face: `<g aria-hidden="true"><circle cx="156" cy="92" r="11" fill="#fff"/><circle cx="204" cy="92" r="11" fill="#fff"/><circle cx="158" cy="93" r="4.5" fill="#203b55"/><circle cx="206" cy="93" r="4.5" fill="#203b55"/><path d="M160 116 Q180 130 200 116" fill="none" stroke="#203b55" stroke-width="4" stroke-linecap="round"/></g>`
  },
  round: {
    base: `<ellipse cx="180" cy="337" rx="110" ry="13" fill="#b9dce8"/><path d="M180 44V22" stroke="${OUTLINE}" stroke-width="5"/><circle cx="180" cy="16" r="9" fill="#8bdfc3" stroke="${OUTLINE}" stroke-width="3"/>`,
    face: `<g aria-hidden="true"><circle cx="160" cy="80" r="12" fill="#fff"/><circle cx="200" cy="80" r="12" fill="#fff"/><circle cx="162" cy="81" r="5" fill="#203b55"/><circle cx="202" cy="81" r="5" fill="#203b55"/><path d="M162 106 Q180 122 198 106" fill="none" stroke="#203b55" stroke-width="4" stroke-linecap="round"/></g>`
  }
};

const placeholderIcon = { circle: '○', square: '□', triangle: '△', rectangle: '▭', rhombus: '◇', star: '☆', oval: '⬭', hexagon: '⬡', heart: '♡', semicircle: '◠' };

function robotScene(level, placed, highlight) {
  const scene = scenes[level.robot] || scenes.classic;
  const parts = level.parts.map(partById).sort((a, b) => a.z - b.z);
  const slots = parts.map(p => {
    const filled = placed.has(p.id);
    const rx = p.shape === 'circle' ? 46 : p.shape === 'oval' ? 30 : 12;
    const inner = filled
      ? shapeInner(p.shape, p.color, '#38516b')
      : `<rect x="4" y="4" width="92" height="92" rx="${rx}" fill="${p.color}" fill-opacity=".22" stroke="${p.color}" stroke-width="6" stroke-dasharray="9 7"/>${shapeInner(p.shape, 'none', p.color).replace('stroke-width="5"', 'stroke-width="4" stroke-dasharray="6 5" opacity=".9"')}`;
    // O <g> externo só posiciona (atributo transform); o interno recebe as animações CSS.
    return `<g transform="translate(${p.slot.x} ${p.slot.y}) scale(${p.slot.w / 100} ${p.slot.h / 100})"><g class="robot-slot ${filled ? 'is-filled' : ''} ${highlight === p.id ? 'is-target' : ''}" data-slot="${p.id}" role="button" tabindex="${filled ? -1 : 0}" aria-label="${filled ? `${p.spoken} já encaixado` : `Espaço para ${p.spoken}`}">${inner}</g></g>`;
  }).join('');
  return `<svg class="robot-svg" viewBox="0 0 360 350" role="img" aria-label="Robô com espaços para encaixar peças">${scene.base}${slots}${placed.has(level.parts[0]) ? scene.face : ''}</svg>`;
}

export default {
  id: 'shapes', title: 'Formas mágicas', icon: '🔺', description: 'Encaixe as formas no robô.', levels: shapeLevels,
  mount(container, ctx) {
    const level = shapeLevels[ctx.level - 1];
    const placed = new Set();
    const bank = ctx.level >= 3 ? shuffle(level.parts) : [...level.parts];
    let selected = null;
    let errors = 0;
    let timer = 0;
    const controller = new AbortController();
    const { signal } = controller;

    const highlightFor = () => selected && (level.hint === 'always' || errors >= 1) ? selected : null;
    const nextPart = () => level.parts.find(id => !placed.has(id));

    const render = () => {
      container.innerHTML = `
        <div class="shapes-layout">
          <div class="robot-scene">${robotScene(level, placed, highlightFor())}</div>
          <div class="shapes-side">
            <div class="shape-bank" role="group" aria-label="Peças">
              ${bank.map(id => {
                const p = partById(id);
                const used = placed.has(id);
                return `<button class="shape-piece ${selected === id ? 'is-selected' : ''} ${used ? 'is-used' : ''}" data-piece="${id}" ${used ? 'disabled' : ''} draggable="${!used}" aria-pressed="${selected === id}" aria-label="${p.spoken}, ${shapeNames[p.shape]} ${p.colorName}">${shapeSvg(p.shape, p.color, '#fff', '')}<strong>${shapeNames[p.shape]}</strong><span class="piece-mark">${p.colorName}</span></button>`;
              }).join('')}
            </div>
            <p class="small">Toque na peça e depois no lugar dela no robô. Também pode arrastar.</p>
          </div>
        </div>`;
      container.querySelectorAll('[data-piece]').forEach(button => {
        button.addEventListener('click', () => select(button.dataset.piece), { signal });
        button.addEventListener('dragstart', event => {
          // Não re-renderiza aqui: trocar o DOM durante o arraste cancela a operação no navegador.
          selected = button.dataset.piece;
          errors = 0;
          container.querySelectorAll('.shape-piece').forEach(item => item.classList.toggle('is-selected', item === button));
          event.dataTransfer.setData('text/plain', button.dataset.piece);
          event.dataTransfer.effectAllowed = 'move';
        }, { signal });
      });
      container.querySelectorAll('[data-slot]').forEach(slot => {
        slot.addEventListener('click', () => place(slot.dataset.slot), { signal });
        slot.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); place(slot.dataset.slot); } }, { signal });
        slot.addEventListener('dragover', event => { event.preventDefault(); slot.classList.add('is-over'); }, { signal });
        slot.addEventListener('dragleave', () => slot.classList.remove('is-over'), { signal });
        slot.addEventListener('drop', event => { event.preventDefault(); const id = event.dataTransfer.getData('text/plain'); if (id) { selected = id; } place(slot.dataset.slot); }, { signal });
      });
    };

    const select = id => {
      if (placed.has(id)) return;
      selected = id;
      errors = 0;
      render();
      ctx.sfx.tap();
      const p = partById(id);
      ctx.setFeedback(`Peça escolhida: ${p.spoken}. Agora toque no lugar dela.`, '');
      ctx.speak(`${p.spoken}, ${p.colorName}. Toque no lugar ${p.colorName} do robô.`);
    };

    const place = id => {
      if (placed.has(id)) return;
      if (!selected) {
        const p = partById(id);
        ctx.setFeedback(`Primeiro escolha uma peça. Esse espaço é para ${p.spoken}.`, '');
        ctx.speak(`Primeiro escolha uma peça. Esse espaço é para ${p.spoken}.`);
        return;
      }
      if (selected !== id) {
        errors++;
        const want = partById(selected);
        const here = partById(id);
        ctx.sfx.wrong();
        ctx.setFeedback(`Esse espaço é ${placeholderIcon[here.shape]} ${shapeNames[here.shape]}. Procure o espaço ${shapeNames[want.shape]} para ${want.spoken}.`, 'bad');
        ctx.speak(`Esse espaço é para ${here.spoken}. Procure o espaço de ${want.spoken}.`);
        render();
        return;
      }
      const p = partById(id);
      placed.add(id);
      selected = null;
      errors = 0;
      ctx.sfx.snap();
      render();
      if (placed.size === level.parts.length) {
        ctx.setFeedback('Robô completo! 🎉', 'good');
        ctx.setPrompt(level.outro);
        ctx.levelComplete();
        timer = setTimeout(() => ctx.finishLevel(), 900);
      } else {
        const next = partById(nextPart());
        ctx.setFeedback(`Muito bem! ${p.spoken} encaixou. Agora: ${next.spoken}.`, 'good');
        ctx.speak(`Muito bem! Agora procure ${next.spoken}, de cor ${next.colorName}.`);
      }
    };

    render();
    ctx.setPrompt(level.intro);
    return () => { controller.abort(); clearTimeout(timer); };
  }
};
