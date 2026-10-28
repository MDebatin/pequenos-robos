// Efeitos sonoros gerados com WebAudio (sem arquivos externos).
let context = null;
let enabled = true;

function unlock() {
  try {
    context ??= new (window.AudioContext || window.webkitAudioContext)();
    if (context.state === 'suspended') context.resume();
  } catch { /* sem áudio disponível */ }
}

function tone({ freq = 520, duration = 0.12, type = 'sine', volume = 0.08, delay = 0, slide = null, attack = 0.01 }) {
  if (!enabled) return;
  unlock();
  if (!context) return;
  const osc = context.createOscillator();
  const gain = context.createGain();
  const start = context.currentTime + delay;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (slide) osc.frequency.exponentialRampToValueAtTime(slide, start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.linearRampToValueAtTime(volume, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export const audio = {
  unlock,
  setEnabled(value) { enabled = value; },
  get enabled() { return enabled; },
  tone,
  beep(freq = 520, duration = 0.12) { tone({ freq, duration }); },
  // toque leve ao escolher algo
  tap() { tone({ freq: 640, duration: 0.08, volume: 0.06 }); },
  // acerto simples
  good() { tone({ freq: 660, duration: 0.1 }); tone({ freq: 880, duration: 0.16, delay: 0.09 }); },
  // peça encaixou
  snap() { tone({ freq: 523, duration: 0.1 }); tone({ freq: 659, duration: 0.1, delay: 0.08 }); tone({ freq: 784, duration: 0.16, delay: 0.16 }); },
  // erro acolhedor: tom curto descendo
  wrong() { tone({ freq: 330, duration: 0.18, type: 'triangle', slide: 260, volume: 0.06 }); },
  // passo do robô
  step() { tone({ freq: 420, duration: 0.07, type: 'square', volume: 0.035 }); },
  // bateu na parede
  bump() { tone({ freq: 160, duration: 0.14, type: 'sawtooth', volume: 0.05 }); },
  // virar carta
  flip() { tone({ freq: 500, duration: 0.06, type: 'triangle', slide: 700, volume: 0.05 }); },
  celebrate() { [523, 659, 784, 1047].forEach((freq, i) => tone({ freq, duration: 0.18, delay: i * 0.11 })); },
  fanfare() { [523, 659, 784, 1047, 784, 1047].forEach((freq, i) => tone({ freq, duration: 0.22, delay: i * 0.13, type: 'triangle', volume: 0.09 })); }
};
