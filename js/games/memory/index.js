import { activityLevels } from '../../data/levels/activities.js';
import { robotSvg } from '../../ui/robot-svg.js';
import { shuffle } from '../helpers.js';

// Robôs visualmente distintos: cor, corpo, cabeça, olhos, antena e enfeite diferentes.
export const memoryRobots = [
  { id: 'azul', name: 'robô azul', spec: { color: '#3b82f6', headColor: '#ffe29a', body: 'rounded', head: 'round', eyes: 'round', antenna: 'ball' } },
  { id: 'rosa', name: 'robô rosa de laço', spec: { color: '#ff6f91', headColor: '#ffd1dc', body: 'oval', head: 'dome', eyes: 'happy', antenna: 'double', hat: 'bow' } },
  { id: 'verde', name: 'robô verde de um olho', spec: { color: '#34b982', headColor: '#c8f5e3', body: 'tall', head: 'square', eyes: 'cyclops', antenna: 'ray', legs: 'wheels' } },
  { id: 'roxo', name: 'robô roxo de coroa', spec: { color: '#8d6ee8', headColor: '#e6dcff', body: 'hex', head: 'round', eyes: 'big', antenna: 'none', hat: 'crown', chest: 'star' } },
  { id: 'amarelo', name: 'robô amarelo de fones', spec: { color: '#ffd21f', headColor: '#fff4c9', body: 'rounded', head: 'square', eyes: 'visor', antenna: 'spring', hat: 'headphones', legs: 'springs' } },
  { id: 'laranja', name: 'robô laranja de chapéu', spec: { color: '#ff9f43', headColor: '#ffe3c2', body: 'oval', head: 'dome', eyes: 'round', mouth: 'open', antenna: 'none', hat: 'hat', arms: 'wave' } },
  { id: 'vermelho', name: 'robô vermelho de capacete', spec: { color: '#ef5350', headColor: '#ffd9d9', body: 'tall', head: 'round', eyes: 'big', mouth: 'grille', antenna: 'ball', hat: 'helmet', legs: 'tank' } },
  { id: 'azul-claro', name: 'robô azul-claro de coração', spec: { color: '#22b8cf', headColor: '#d6f6ff', body: 'heart', head: 'square', eyes: 'happy', mouth: 'tongue', antenna: 'double', chest: 'heart', arms: 'strong' } }
];

const levels = activityLevels.memory;

export default {
  id: 'memory', title: 'Robôs iguais', icon: '👀', description: 'Encontre os robôs iguais.', levels,
  mount(container, ctx) {
    const pairs = levels[ctx.level - 1].pairs;
    const chosen = shuffle(memoryRobots).slice(0, pairs);
    const cards = shuffle([...chosen, ...chosen]);
    let first = null;
    let found = 0;
    let lock = false;
    let timer = 0;
    const narrow = window.innerWidth < 480;
    const columns = cards.length <= 4 ? 2 : cards.length <= 6 || (narrow && cards.length >= 10) ? 3 : 4;

    ctx.setPrompt('Vire duas cartas e encontre os robôs iguais!');
    ctx.setProgress(0, pairs, 'pares');
    container.innerHTML = `<div class="memory-grid" style="--cols:${columns}" role="group" aria-label="Cartas do jogo da memória">
      ${cards.map((robot, i) => `<button class="memory-card" data-index="${i}" data-value="${robot.id}" aria-label="Carta ${i + 1}, virada para baixo">
        <span class="memory-face memory-back" aria-hidden="true">🤖</span>
        <span class="memory-face memory-front" aria-hidden="true">${robotSvg(robot.spec, { decorative: true })}</span>
      </button>`).join('')}
    </div>`;

    const flipDown = card => { card.classList.remove('open'); card.setAttribute('aria-label', `Carta ${Number(card.dataset.index) + 1}, virada para baixo`); };

    container.querySelectorAll('.memory-card').forEach(card => {
      card.onclick = () => {
        if (lock || card.classList.contains('open') || card.classList.contains('matched')) return;
        const robot = cards[card.dataset.index];
        card.classList.add('open');
        card.setAttribute('aria-label', `Carta ${Number(card.dataset.index) + 1}: ${robot.name}`);
        ctx.sfx.flip();
        if (!first) { first = card; return; }
        lock = true;
        if (first.dataset.value === card.dataset.value) {
          found++;
          first.classList.add('matched');
          card.classList.add('matched');
          first.disabled = card.disabled = true;
          first = null;
          lock = false;
          ctx.sfx.good();
          ctx.setProgress(found, pairs, 'pares');
          ctx.setFeedback(`Par encontrado: ${robot.name}!`, 'good');
          if (found === pairs) {
            ctx.levelComplete();
            ctx.setPrompt('Você encontrou todos os pares!');
            timer = setTimeout(() => ctx.finishLevel(), 600);
          } else ctx.speak('Par encontrado!');
        } else {
          ctx.sfx.wrong();
          ctx.setFeedback('Esses robôs são diferentes. Tente outra vez!', 'bad');
          const previous = first;
          first = null;
          timer = setTimeout(() => { flipDown(previous); flipDown(card); lock = false; }, 900);
        }
      };
    });
    return () => clearTimeout(timer);
  }
};
