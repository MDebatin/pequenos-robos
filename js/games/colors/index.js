import { colors } from '../../data/colors.js';
import { activityLevels } from '../../data/levels/activities.js';
import { robotSvg } from '../../ui/robot-svg.js';
import { drawRound } from '../helpers.js';

const levels = activityLevels.colors;

export default {
  id: 'colors', title: 'Cores dos robôs', icon: '🎨', description: 'Encontre a cor pedida.', levels,
  mount(container, ctx) {
    const data = levels[ctx.level - 1];
    let round = 0;
    let last = '';
    let errors = 0;
    let busy = false;
    let timer = 0;

    const modeFor = () => data.mode === 'mixed' ? (round % 2 ? 'robot' : 'swatch') : data.mode;
    const robotFor = (color, size) => robotSvg({ color: color.value, headColor: color.value, eyes: 'big', antenna: 'ball' }, { size, label: `Robô ${color.name}`, decorative: true });

    const render = () => {
      const mode = modeFor();
      const { target, options } = drawRound(colors, data.options, last);
      last = target.id;
      errors = 0;
      busy = false;
      ctx.setProgress(round, data.rounds);
      if (mode === 'swatch') {
        ctx.setPrompt(`Qual é a cor deste robô? Toque na cor igual!`);
        container.innerHTML = `
          <div class="colors-stage" style="--target:${target.value}">
            <div class="colors-robot">${robotFor(target, 180)}</div>
          </div>
          <div class="color-options" role="group" aria-label="Opções de cor">
            ${options.map(color => `<button class="color-option" data-color="${color.id}" aria-label="Cor ${color.name}"><span class="color-swatch ${color.id === 'white' ? 'is-white' : ''}" style="background:${color.value}"></span><span class="color-name">${color.label}</span></button>`).join('')}
          </div>`;
      } else {
        ctx.setPrompt(`Encontre o robô ${target.name}!`);
        container.innerHTML = `
          <div class="color-options is-robots" role="group" aria-label="Robôs coloridos">
            ${options.map(color => `<button class="color-option robot-option" data-color="${color.id}" aria-label="Robô ${color.name}">${robotFor(color, 96)}</button>`).join('')}
          </div>`;
      }
      container.querySelectorAll('[data-color]').forEach(button => {
        button.onclick = () => {
          if (busy) return;
          if (button.dataset.color === target.id) {
            busy = true;
            round++;
            button.classList.add('is-correct');
            ctx.sfx.good();
            ctx.setProgress(round, data.rounds);
            ctx.setFeedback(mode === 'swatch' ? `Isso! O robô é ${target.name}.` : `Muito bem! Você encontrou o robô ${target.name}.`, 'good');
            ctx.speak(mode === 'swatch' ? `Isso! O robô é ${target.name}.` : `Muito bem! Robô ${target.name}.`);
            if (round >= data.rounds) {
              ctx.levelComplete();
              timer = setTimeout(() => ctx.finishLevel(), 700);
            } else {
              timer = setTimeout(render, 1100);
            }
          } else {
            errors++;
            const wrong = colors.find(color => color.id === button.dataset.color);
            button.classList.remove('shake');
            void button.offsetWidth;
            button.classList.add('shake');
            ctx.sfx.wrong();
            ctx.setFeedback(`Essa é a cor ${wrong.name}. Vamos procurar ${target.name}!`, 'bad');
            ctx.speak(mode === 'swatch' ? `Essa é ${wrong.name}. Olhe a cor do robô e tente de novo.` : `Essa é ${wrong.name}. Procure o robô ${target.name}.`);
            if (errors >= 2) container.querySelector(`[data-color="${target.id}"]`)?.classList.add('is-target');
          }
        };
      });
    };

    render();
    return () => clearTimeout(timer);
  }
};
