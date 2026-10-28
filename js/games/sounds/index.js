import { activityLevels } from '../../data/levels/activities.js';
import { sounds, soundById } from '../../data/sounds.js';
import { playAnimal } from '../../services/animal-sounds.js';
import { drawRound } from '../helpers.js';

const levels = activityLevels.sounds;

export default {
  id: 'sounds', title: 'Descubra os sons', icon: '🔊', description: 'Escute e escolha a figura.', levels,
  mount(container, ctx) {
    const data = levels[ctx.level - 1];
    const pool = data.pool.map(soundById).filter(Boolean);
    let round = 0;
    let last = '';
    let errors = 0;
    let busy = false;
    let timer = 0;
    let autoTimer = 0;
    let sayTimer = 0;
    let player = null;

    const say = (target, delay) => {
      clearTimeout(sayTimer);
      if (ctx.voiceEnabled) sayTimer = setTimeout(() => ctx.speak(target.say), delay);
    };
    const synth = target => { const length = playAnimal(target.id); say(target, length + 150); };
    const play = target => {
      const bubble = container.querySelector('[data-bubble]');
      if (bubble) { bubble.textContent = target.say; bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop'); }
      const hear = container.querySelector('[data-hear]');
      hear?.classList.remove('is-playing'); void hear?.offsetWidth; hear?.classList.add('is-playing');
      if (!ctx.soundEnabled) { say(target, 0); return; }
      if (target.file) {
        try {
          player?.pause();
          player = new Audio(target.file);
          player.onended = () => say(target, 200);
          player.onerror = () => synth(target);
          player.play().catch(() => synth(target));
          return;
        } catch { /* cai para o som sintetizado */ }
      }
      synth(target);
    };

    const render = () => {
      const { target, options } = drawRound(pool, data.options, last);
      last = target.id;
      errors = 0;
      busy = false;
      ctx.setProgress(round, data.rounds);
      ctx.setPrompt('Escute o som. Qual animal faz esse som?');
      container.innerHTML = `
        <div class="sound-stage">
          <button class="sound-button" data-hear aria-label="Ouvir o som"><span class="sound-icon" aria-hidden="true">🔊</span><span>Ouvir som</span></button>
          <div class="sound-bubble" data-bubble aria-live="polite">${ctx.soundEnabled ? '…' : target.say}</div>
          <p class="audio-note">${ctx.soundEnabled ? 'Pode ouvir quantas vezes quiser.' : 'Os sons estão desligados: leia o balão e escolha o animal.'}</p>
        </div>
        <div class="options sound-options" role="group" aria-label="Animais">
          ${options.map(animal => `<button class="option animal-option" data-animal="${animal.id}" aria-label="${animal.name}"><span class="animal-icon" aria-hidden="true">${animal.icon}</span><span>${animal.name}</span></button>`).join('')}
        </div>`;
      container.querySelector('[data-hear]').onclick = () => play(target);
      container.querySelectorAll('[data-animal]').forEach(button => {
        button.onclick = () => {
          if (busy) return;
          if (button.dataset.animal === target.id) {
            busy = true;
            round++;
            button.classList.add('is-correct');
            ctx.sfx.good();
            ctx.setProgress(round, data.rounds);
            ctx.setFeedback(`Isso! É ${target.article} ${target.name}: ${target.say}`, 'good');
            ctx.speak(`Isso! É ${target.article} ${target.name}.`);
            if (round >= data.rounds) {
              ctx.levelComplete();
              timer = setTimeout(() => ctx.finishLevel(), 700);
            } else timer = setTimeout(render, 1200);
          } else {
            errors++;
            const wrong = soundById(button.dataset.animal);
            button.classList.remove('shake'); void button.offsetWidth; button.classList.add('shake');
            ctx.sfx.wrong();
            ctx.setFeedback(`Esse é ${wrong.article} ${wrong.name}, que faz "${wrong.say}". Ouça de novo!`, 'bad');
            timer = setTimeout(() => play(target), 900);
            if (errors >= 2) container.querySelector(`[data-animal="${target.id}"]`)?.classList.add('is-target');
          }
        };
      });
      // toca o som automaticamente depois da instrução falada
      clearTimeout(autoTimer);
      autoTimer = setTimeout(() => play(target), ctx.voiceEnabled ? 3200 : 300);
    };

    render();
    return () => { clearTimeout(timer); clearTimeout(autoTimer); clearTimeout(sayTimer); player?.pause(); };
  }
};
