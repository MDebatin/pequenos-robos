// Narração com a Web Speech API. Nada é falado antes de um gesto da criança.
const supported = 'speechSynthesis' in window;
let voices = [];
let timer = 0;
let enabled = true;
let unlocked = false;

const load = () => { try { voices = speechSynthesis.getVoices() || []; } catch { voices = []; } };
if (supported) { load(); speechSynthesis.addEventListener('voiceschanged', load); }

const pickVoice = () => voices.find(v => v.lang.toLowerCase().replace('_', '-') === 'pt-br') || voices.find(v => v.lang.toLowerCase().startsWith('pt')) || null;

export const speech = {
  get supported() { return supported; },
  unlock() { unlocked = true; },
  setEnabled(value) { enabled = value; if (!value) this.stop(); },
  speak(text, { delay = 90 } = {}) {
    if (!unlocked || !enabled || !supported || !text) return;
    this.stop();
    timer = setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.88;
      utterance.pitch = 1.1;
      utterance.voice = pickVoice();
      try { speechSynthesis.speak(utterance); } catch { /* ignora */ }
    }, delay);
  },
  stop() { if (supported) { try { speechSynthesis.cancel(); } catch { /* ignora */ } } clearTimeout(timer); }
};
