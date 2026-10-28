import { registry, gameById } from '../games/registry.js';
import { speech } from '../services/speech.js';
import { audio } from '../services/audio.js';
import { celebrate } from '../services/confetti.js';
import { storage } from './storage.js';
import { progressDots } from '../ui/progress.js';
import { t } from '../data/strings.pt-BR.js';

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function createApp(root) {
  let activeGame = null;
  let activeCleanup = null;
  let level = 1;
  let lastPrompt = '';
  let sound = storage.get('sound', true);
  let voice = storage.get('voice', true);
  let bannerTimer = 0;
  const completed = storage.get('completed', {});

  const $ = selector => root.querySelector(selector);
  const setScreen = id => root.querySelectorAll('[data-screen]').forEach(node => node.classList.toggle('active', node.dataset.screen === id));
  const persist = () => storage.set('completed', completed);
  const stop = () => {
    activeCleanup?.();
    activeGame?.unmount?.();
    activeCleanup = null;
    activeGame = null;
    speech.stop();
    clearTimeout(bannerTimer);
    $('[data-role="banner"]')?.classList.remove('visible');
  };

  function renderHome() {
    stop();
    setScreen('home');
    $('[data-role="home-content"]').innerHTML = `
      <div class="mascot" aria-hidden="true">🤖✨</div>
      <h1>${t('homeTitle')}</h1>
      <p>${t('homeIntro')}</p>
      <div class="school">${t('school')}</div>
      <div class="activities">${registry.map(game => `
        <article class="activity-card ${completed[game.id] ? 'is-done' : ''}">
          ${completed[game.id] ? `<span class="medal" title="${t('done')}">⭐</span>` : ''}
          <div class="emoji" aria-hidden="true">${game.icon}</div>
          <h2>${game.title}</h2>
          <p>${game.description}</p>
          <button class="play" data-game="${game.id}" aria-label="${t('play')}: ${game.title}">▶ ${t('play')}</button>
        </article>`).join('')}
      </div>
      <button class="teacher-link" data-action="teacher">🌱 ${t('teacher')}</button>`;
    root.querySelectorAll('[data-game]').forEach(button => { button.onclick = () => startGame(button.dataset.game); });
    $('[data-action="teacher"]').onclick = renderTeacher;
  }

  function renderTeacher() {
    stop();
    setScreen('teacher');
    $('[data-role="teacher-content"]').innerHTML = `
      <button class="back" data-action="home">← ${t('back')}</button>
      <h2>🌱 Dicas para a professora</h2>
      <article><h3>As seis brincadeiras</h3><ul>
        <li><b>Cores dos robôs</b> (6 fases): primeiro a criança combina a cor do robô com a amostra; depois encontra o robô da cor falada.</li>
        <li><b>Formas mágicas</b> (8 fases): monta dois robôs com círculo, quadrado, triângulo, retângulo, losango, estrela, oval, hexágono, coração e meia-lua. Cada espaço tem a cor da peça, então a criança combina forma e cor.</li>
        <li><b>Caminho do robô</b> (8 fases): leva o robô até a estrela com as setas, desviando de obstáculos. Vale usar as setas do teclado ou deslizar o dedo no tabuleiro.</li>
        <li><b>Robôs iguais</b> (5 fases): jogo da memória de 2 a 6 pares.</li>
        <li><b>Descubra os sons</b> (5 fases): escuta a gravação do animal e escolhe a figura. Pode ouvir quantas vezes quiser.</li>
        <li><b>Crie seu robô</b>: monta um robô em 10 etapas e guarda os últimos robôs criados na galeria.</li>
      </ul></article>
      <article><h3>Dinâmica na lousa digital</h3><p>Faça rodízios entre as crianças para resolver uma rodada de cada vez. A turma pode nomear em voz alta a cor, a forma ou o animal.</p></article>
      <article><h3>Atividades concretas em sala</h3><p>Amplie a experiência com blocos, caixas, formas de papel e caminhos no chão.</p></article>
      <article><h3>Som e narração</h3><p>O botão “Voz” liga ou desliga a narração das instruções (voz do navegador em português). O botão “Sons” liga ou desliga os efeitos e os sons dos animais. Os dois podem ser usados separadamente: dá para manter só os sons dos animais, por exemplo.</p></article>
      <article><h3>Progresso</h3><p>As estrelas das brincadeiras concluídas ficam salvas apenas neste aparelho.</p><button class="back" data-action="clear">Zerar progresso</button></article>`;
    $('[data-role="teacher-content"] [data-action="home"]').onclick = renderHome;
    $('[data-action="clear"]').onclick = () => { Object.keys(completed).forEach(key => delete completed[key]); persist(); renderTeacher(); };
  }

  function startGame(id) { level = 1; mountGame(id); }

  function showBanner(text) {
    const banner = $('[data-role="banner"]');
    banner.textContent = text;
    banner.classList.add('visible');
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => banner.classList.remove('visible'), reducedMotion() ? 600 : 1400);
  }

  function mountGame(id, { banner = true } = {}) {
    stop();
    speech.unlock();
    audio.unlock();
    activeGame = gameById(id);
    const total = activeGame.levels.length;
    level = Math.min(Math.max(1, level), total);
    setScreen('game');
    const content = $('[data-role="game-content"]');
    const next = $('[data-role="next"]');
    const finish = $('[data-role="finish"]');
    next.classList.remove('visible');
    next.textContent = '';
    next.onclick = null;
    finish.classList.remove('visible');
    finish.replaceChildren();
    $('[data-role="feedback"]').textContent = '';
    $('[data-role="feedback"]').dataset.kind = '';
    $('[data-role="progress"]').innerHTML = '';
    $('[data-role="game-title"]').textContent = `${activeGame.icon} ${activeGame.title}`;
    const chip = $('[data-role="level"]');
    chip.hidden = total <= 1;
    $('[data-action="restart"]').hidden = total <= 1;
    chip.textContent = `${t('level')} ${level} ${t('of')} ${total}`;
    chip.setAttribute('aria-label', `${t('level')} ${level} ${t('of')} ${total}`);
    content.scrollIntoView?.({ block: 'nearest' });
    if (banner && total > 1) showBanner(`${t('level')} ${level}`);

    const context = {
      get level() { return level; },
      get totalLevels() { return total; },
      get soundEnabled() { return sound; },
      get voiceEnabled() { return voice; },
      t,
      sfx: audio,
      storage,
      celebrate,
      reducedMotion,
      speak(text) { speech.speak(text); },
      setPrompt(text, { speak = true } = {}) {
        lastPrompt = text;
        $('[data-role="prompt"]').textContent = text;
        if (speak) speech.speak(text);
      },
      setFeedback(text, kind = '') {
        const feedback = $('[data-role="feedback"]');
        feedback.textContent = text;
        feedback.dataset.kind = kind === true ? 'good' : kind || '';
        feedback.classList.remove('pop');
        void feedback.offsetWidth;
        if (text) feedback.classList.add('pop');
      },
      setProgress(done, totalRounds, label) { $('[data-role="progress"]').innerHTML = progressDots(totalRounds, done, label); },
      levelComplete() {
        completed[`${id}-${level}`] = true;
        persist();
        audio.celebrate();
        celebrate(content);
      },
      finishLevel(text = '') {
        next.classList.remove('visible');
        if (level < total) {
          next.textContent = text || `🌟 ${t('nextLevel')}`;
          next.classList.add('visible');
          next.onclick = () => { level += 1; mountGame(id); };
          next.focus({ preventScroll: true });
          return;
        }
        completed[id] = true;
        persist();
        audio.fanfare();
        celebrate(content, { big: true });
        finish.innerHTML = `<p class="finish-message">🎉 ${t('activityComplete')}</p><div class="finish-actions">
          <button class="finish-button" data-action="again">🔄<span>${id === 'create' ? t('createAgain') : t('playAgain')}</span></button>
          <button class="finish-button" data-action="choose">🏠<span>${t('chooseGame')}</span></button></div>`;
        finish.classList.add('visible');
        finish.querySelector('[data-action="again"]').onclick = () => { level = 1; mountGame(id); };
        finish.querySelector('[data-action="choose"]').onclick = renderHome;
        finish.querySelector('[data-action="again"]').focus({ preventScroll: true });
        speech.speak(t('chooseNext'), { delay: 900 });
      },
      restart() { mountGame(id, { banner: false }); }
    };
    activeCleanup = activeGame.mount(content, context) || null;
  }

  root.innerHTML = `
    <header class="topbar">
      <div class="brand">🤖 Pequenos Robôs, Grandes Descobertas <small>EBAS · brincar, explorar e descobrir</small></div>
      <div class="toolbar">
        <button data-action="voice" aria-pressed="${voice}" title="Liga ou desliga a narração">${voice ? '🗣️' : '🤐'} Voz</button>
        <button data-action="sound" aria-pressed="${sound}" title="Liga ou desliga efeitos e sons dos animais">${sound ? '🔊' : '🔇'} Sons</button>
        <button data-action="repeat">🔁 ${t('repeat')}</button>
        <button data-action="home">🏠 ${t('home')}</button>
        <button data-action="fullscreen">⛶ ${t('fullscreen')}</button>
      </div>
    </header>
    <main class="page">
      <section class="screen panel welcome active" data-screen="home"><div data-role="home-content"></div></section>
      <section class="screen panel game-screen" data-screen="game">
        <div class="game-head">
          <button class="back" data-action="home" aria-label="${t('home')}">🏠</button>
          <h2 data-role="game-title"></h2>
          <span class="level-chip" data-role="level"></span>
          <button class="back" data-action="restart">↻ ${t('restart')}</button>
        </div>
        <div class="prompt-row">
          <div class="prompt" data-role="prompt" aria-live="polite">Vamos brincar!</div>
          <button class="prompt-repeat" data-action="repeat" aria-label="${t('repeat')}">🔊</button>
        </div>
        <div class="level-banner" data-role="banner" aria-hidden="true"></div>
        <div class="game-content" data-role="game-content"></div>
        <div class="progress" data-role="progress"></div>
        <div class="feedback" data-role="feedback" aria-live="polite"></div>
        <button class="next" data-role="next"></button>
        <div class="finish" data-role="finish" aria-live="polite"></div>
      </section>
      <section class="screen panel teacher" data-screen="teacher"><div data-role="teacher-content"></div></section>
    </main>`;
  root.querySelectorAll('[data-action="home"]').forEach(button => { button.onclick = renderHome; });
  $('[data-action="restart"]').onclick = () => activeGame && mountGame(activeGame.id, { banner: false });
  root.querySelectorAll('[data-action="repeat"]').forEach(button => { button.onclick = () => { speech.unlock(); speech.speak(lastPrompt || 'Vamos brincar!'); }; });
  $('[data-action="sound"]').onclick = event => {
    sound = !sound;
    storage.set('sound', sound);
    audio.setEnabled(sound);
    event.currentTarget.textContent = sound ? '🔊 Sons' : '🔇 Sons';
    event.currentTarget.setAttribute('aria-pressed', sound);
    root.classList.toggle('sound-off', !sound);
  };
  $('[data-action="voice"]').onclick = event => {
    voice = !voice;
    storage.set('voice', voice);
    speech.setEnabled(voice);
    event.currentTarget.textContent = voice ? '🗣️ Voz' : '🤐 Voz';
    event.currentTarget.setAttribute('aria-pressed', voice);
    root.classList.toggle('voice-off', !voice);
  };
  $('[data-action="fullscreen"]').onclick = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch?.(() => {});
  };
  if (!document.fullscreenEnabled) $('[data-action="fullscreen"]').hidden = true;
  root.classList.toggle('sound-off', !sound);
  root.classList.toggle('voice-off', !voice);
  speech.setEnabled(voice);
  audio.setEnabled(sound);
  renderHome();
}
