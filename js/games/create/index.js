import { createSteps, defaultRobot, robotSpec, randomRobot } from '../../data/create-options.js';
import { robotSvg, robotRegions } from '../../ui/robot-svg.js';

const GALLERY_KEY = 'gallery';
const GALLERY_MAX = 6;
const clone = value => JSON.parse(JSON.stringify(value));

function optionPreview(step, state, option) {
  if (step.isColor) return `<span class="color-swatch big ${option.id === 'cream' ? 'is-light' : ''}" style="background:${option.value}" aria-hidden="true"></span>`;
  const preview = robotSpec({ ...state, [step.key]: option.id });
  return robotSvg(preview, { viewBox: robotRegions[step.region] || robotRegions.full, className: 'mini-robot', decorative: true });
}

export default {
  id: 'create', title: 'Crie seu robô', icon: '🛠️', description: 'Monte o seu próprio robô.', levels: [{ phase: 1 }],
  mount(container, ctx) {
    let state = clone(defaultRobot);
    let history = [];
    let stepIndex = 0;
    let finished = false;
    const gallery = ctx.storage.get(GALLERY_KEY, []);
    const total = createSteps.length;

    const label = option => option.label;
    const stepFor = key => createSteps.find(step => step.key === key);

    const render = ({ speak = true } = {}) => {
      const step = createSteps[stepIndex];
      ctx.setPrompt(step.prompt, { speak });
      ctx.setProgress(stepIndex, total, 'etapas');
      container.innerHTML = `
        <div class="create-layout">
          <div class="create-stage">
            <div class="create-robot">${robotSvg(robotSpec(state), { className: 'create-robot-svg', label: 'Seu robô', animated: true })}</div>
            <div class="create-stage-label">Etapa ${stepIndex + 1} de ${total}: ${step.icon} ${step.label}</div>
          </div>
          <div class="create-panel">
            <div class="create-tabs" role="tablist" aria-label="Partes do robô">
              ${createSteps.map((item, i) => `<button class="create-tab ${i < stepIndex ? 'is-done' : ''}" role="tab" data-step="${i}" aria-selected="${i === stepIndex}" aria-label="${item.label}"><span aria-hidden="true">${item.icon}</span><span class="tab-label">${item.label}</span></button>`).join('')}
            </div>
            <div class="create-choices ${step.isColor ? 'is-colors' : ''}" role="group" aria-label="${step.label}">
              ${step.options.map(option => `<button class="create-option" data-value="${option.id}" aria-pressed="${state[step.key] === option.id}" aria-label="${label(option)}">${optionPreview(step, state, option)}<span>${label(option)}</span></button>`).join('')}
            </div>
            <div class="create-actions">
              <button data-action="previous" ${stepIndex === 0 ? 'disabled' : ''}>← Voltar</button>
              <button data-action="undo" ${history.length ? '' : 'disabled'}>↩️ Desfazer</button>
              <button data-action="random">🎲 Surpresa</button>
              <button data-action="reset">🗑️ Recomeçar</button>
              <button class="primary" data-action="next">${stepIndex < total - 1 ? 'Próximo →' : '🎉 Pronto!'}</button>
            </div>
          </div>
        </div>`;

      container.querySelectorAll('[data-step]').forEach(button => { button.onclick = () => { stepIndex = Number(button.dataset.step); ctx.sfx.tap(); render(); }; });
      container.querySelectorAll('[data-value]').forEach(button => {
        button.onclick = () => {
          if (state[step.key] === button.dataset.value) { ctx.sfx.tap(); return; }
          history.push(clone(state));
          state[step.key] = button.dataset.value;
          const option = step.options.find(item => item.id === button.dataset.value);
          ctx.sfx.tap();
          ctx.setFeedback(`${step.label}: ${label(option)} ✓`, 'good');
          render({ speak: false });
        };
      });
      container.querySelector('[data-action="undo"]').onclick = () => {
        const previous = history.pop();
        if (!previous) return;
        state = previous;
        ctx.sfx.tap();
        ctx.setFeedback('Desfeito!', '');
        render({ speak: false });
      };
      container.querySelector('[data-action="reset"]').onclick = () => {
        history = [];
        state = clone(defaultRobot);
        stepIndex = 0;
        ctx.sfx.tap();
        ctx.setFeedback('Vamos começar um robô novo!', '');
        render();
      };
      container.querySelector('[data-action="random"]').onclick = () => {
        history.push(clone(state));
        state = randomRobot();
        ctx.sfx.good();
        ctx.setFeedback('Surpresa! Olha o robô que apareceu. Pode mudar o que quiser.', 'good');
        render({ speak: false });
      };
      container.querySelector('[data-action="previous"]').onclick = () => { if (stepIndex > 0) { stepIndex--; ctx.sfx.tap(); render(); } };
      container.querySelector('[data-action="next"]').onclick = () => {
        if (stepIndex < total - 1) { stepIndex++; ctx.sfx.tap(); render(); } else finish();
      };
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      const spec = robotSpec(state);
      gallery.unshift({ state: clone(state), at: Date.now() });
      ctx.storage.set(GALLERY_KEY, gallery.slice(0, GALLERY_MAX));
      ctx.setProgress(total, total, 'etapas');
      ctx.setPrompt(ctx.t('created'));
      ctx.setFeedback('', '');
      container.innerHTML = `
        <div class="create-final">
          <div class="create-stage is-celebrating">
            <div class="create-robot">${robotSvg(spec, { className: 'create-robot-svg', label: 'Seu robô pronto', animated: true })}</div>
            <div class="create-sparkles" aria-hidden="true"><i>✨</i><i>⭐</i><i>✨</i><i>🌟</i><i>✨</i></div>
          </div>
          ${gallery.length > 1 ? `<div class="create-gallery"><h3>Meus robôs</h3><div class="create-gallery-list">${gallery.slice(1, GALLERY_MAX).map(item => `<div class="create-gallery-item">${robotSvg(robotSpec(item.state), { decorative: true })}</div>`).join('')}</div></div>` : ''}
        </div>`;
      ctx.finishLevel();
    };

    render();
    return () => {};
  }
};
