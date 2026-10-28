import { activityLevels } from '../../data/levels/activities.js';
import { solve, isBlocked, stepFrom } from './solver.js';

const levels = activityLevels.path;
const label = { up: 'para cima', down: 'para baixo', left: 'para a esquerda', right: 'para a direita' };
const icon = { up: '⬆️', down: '⬇️', left: '⬅️', right: '➡️' };
const keyMap = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };

export default {
  id: 'path', title: 'Caminho do robô', icon: '🧭', description: 'Leve o robô até a estrela.', levels,
  mount(container, ctx) {
    const level = levels[ctx.level - 1];
    const shortest = solve(level)?.length ?? 0;
    let position = { ...level.start };
    let moves = 0;
    let bumps = 0;
    let locked = false;
    let done = false;
    let hinting = false;
    let timer = 0;
    const controller = new AbortController();
    const { signal } = controller;
    const cellId = cell => `${cell.c},${cell.r}`;
    const isGoal = cell => cell.c === level.goal.c && cell.r === level.goal.r;

    ctx.setPrompt('Use as setas e leve o robô até a estrela!');
    container.innerHTML = `
      <div class="path-layout">
        <div class="path-board" role="grid" aria-label="Tabuleiro" style="--cols:${level.grid.cols};--rows:${level.grid.rows}">
          ${Array.from({ length: level.grid.cols * level.grid.rows }, (_, i) => {
            const cell = { c: i % level.grid.cols, r: Math.floor(i / level.grid.cols) };
            const obstacle = isBlocked(level, cell);
            return `<div class="path-cell ${obstacle ? 'obstacle' : ''} ${isGoal(cell) ? 'goal' : ''}" role="gridcell" data-cell="${cellId(cell)}" style="grid-column:${cell.c + 1};grid-row:${cell.r + 1}" aria-label="Linha ${cell.r + 1}, coluna ${cell.c + 1}${obstacle ? ', obstáculo' : isGoal(cell) ? ', estrela' : ''}">${obstacle ? level.theme : isGoal(cell) ? '<span class="path-star">⭐</span>' : ''}</div>`;
          }).join('')}
          <div class="path-robot" data-robot aria-label="Robô" role="img"><span class="path-robot-face" aria-hidden="true">🤖</span></div>
        </div>
        <div class="dpad" role="group" aria-label="Direções">
          <button class="dpad-button up" data-dir="up" aria-label="${label.up}">${icon.up}</button>
          <button class="dpad-button left" data-dir="left" aria-label="${label.left}">${icon.left}</button>
          <button class="dpad-button center" data-dir="center" aria-hidden="true" tabindex="-1" disabled>🧭</button>
          <button class="dpad-button right" data-dir="right" aria-label="${label.right}">${icon.right}</button>
          <button class="dpad-button down" data-dir="down" aria-label="${label.down}">${icon.down}</button>
        </div>
      </div>
      <p class="small path-help">Toque nas setas, use o teclado ou deslize o dedo no tabuleiro.</p>`;

    const board = container.querySelector('.path-board');
    const robot = container.querySelector('[data-robot]');
    const cellAt = cell => board.querySelector(`[data-cell="${cellId(cell)}"]`);

    const placeRobot = (cell, animateFrom = null) => {
      const before = animateFrom ? robot.getBoundingClientRect() : null;
      robot.style.gridColumn = String(cell.c + 1);
      robot.style.gridRow = String(cell.r + 1);
      if (!before || ctx.reducedMotion()) return;
      const after = robot.getBoundingClientRect();
      robot.style.transition = 'none';
      robot.style.transform = `translate(${before.left - after.left}px, ${before.top - after.top}px)`;
      requestAnimationFrame(() => { robot.style.transition = ''; robot.style.transform = ''; });
    };

    const updateHint = () => {
      container.querySelectorAll('.dpad-button.is-target').forEach(button => button.classList.remove('is-target'));
      if (!hinting || done) return;
      const next = solve(level, position)?.[0];
      if (next) container.querySelector(`[data-dir="${next}"]`)?.classList.add('is-target');
    };

    const move = dir => {
      if (locked || done || !label[dir]) return;
      const next = stepFrom(position, dir);
      robot.classList.toggle('facing-left', dir === 'left');
      if (isBlocked(level, next)) {
        bumps++;
        ctx.sfx.bump();
        robot.classList.remove('bump'); void robot.offsetWidth; robot.classList.add('bump');
        const outside = next.c < 0 || next.r < 0 || next.c >= level.grid.cols || next.r >= level.grid.rows;
        ctx.setFeedback(outside ? 'Opa! Ali é o fim do tabuleiro. Tente outra direção.' : 'Opa! Tem um obstáculo aí. Vamos desviar!', 'bad');
        if (bumps >= 3 && !hinting) { hinting = true; ctx.speak('Olhe a seta que está piscando.'); }
        updateHint();
        return;
      }
      locked = true;
      cellAt(position)?.classList.add('visited');
      position = next;
      moves++;
      ctx.sfx.step();
      ctx.setFeedback('', '');
      placeRobot(position, true);
      if (!hinting && moves > shortest + 6) { hinting = true; ctx.speak('Olhe a seta que está piscando.'); }
      updateHint();
      timer = setTimeout(() => {
        locked = false;
        if (isGoal(position)) {
          done = true;
          robot.classList.add('arrived');
          cellAt(position)?.classList.add('reached');
          ctx.setFeedback(moves === shortest ? 'O robô chegou pelo caminho mais curto! ⭐' : 'O robô chegou à estrela! ⭐', 'good');
          ctx.setPrompt('Uhuu! O robô chegou à estrela!');
          ctx.levelComplete();
          timer = setTimeout(() => ctx.finishLevel(), 900);
        }
      }, ctx.reducedMotion() ? 20 : 320);
    };

    container.querySelectorAll('[data-dir]').forEach(button => button.addEventListener('click', () => move(button.dataset.dir), { signal }));
    document.addEventListener('keydown', event => {
      const dir = keyMap[event.key];
      if (!dir || event.target?.closest?.('input,textarea,select')) return;
      event.preventDefault();
      move(dir);
    }, { signal });

    // Deslizar o dedo no tabuleiro
    let swipe = null;
    board.addEventListener('pointerdown', event => { swipe = { x: event.clientX, y: event.clientY, id: event.pointerId }; }, { signal });
    board.addEventListener('pointerup', event => {
      if (!swipe || swipe.id !== event.pointerId) return;
      const dx = event.clientX - swipe.x;
      const dy = event.clientY - swipe.y;
      swipe = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 28) return;
      move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
    }, { signal });
    board.addEventListener('pointercancel', () => { swipe = null; }, { signal });

    placeRobot(position);
    return () => { controller.abort(); clearTimeout(timer); };
  }
};
