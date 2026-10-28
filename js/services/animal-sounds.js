// Sons de animais sintetizados com WebAudio. Não substituem gravações reais,
// mas dão uma pista sonora diferente para cada animal mesmo sem arquivos de áudio.
import { audio } from './audio.js';

const t = audio.tone;
// Cada padrão devolve a duração aproximada em ms para a narração entrar depois do som.
const patterns = {
  gato() { t({ freq: 520, slide: 900, duration: 0.35, type: 'sine', volume: 0.154 }); t({ freq: 900, slide: 480, duration: 0.4, delay: 0.33, type: 'sine', volume: 0.154 });  return 800; },
  cachorro() { [0, 0.22, 0.44].forEach(d => t({ freq: 240, slide: 150, duration: 0.14, delay: d, type: 'sawtooth', volume: 0.132, attack: 0.005 }));  return 650; },
  vaca() { t({ freq: 150, slide: 120, duration: 1.1, type: 'triangle', volume: 0.198, attack: 0.08 }); t({ freq: 300, slide: 240, duration: 1.0, delay: 0.05, type: 'sine', volume: 0.066, attack: 0.08 });  return 1200; },
  sapo() { [0, 0.28, 0.56].forEach(d => t({ freq: 180, slide: 110, duration: 0.18, delay: d, type: 'square', volume: 0.099, attack: 0.02 }));  return 800; },
  pato() { [0, 0.18, 0.36, 0.54].forEach(d => t({ freq: 380, slide: 300, duration: 0.12, delay: d, type: 'sawtooth', volume: 0.11, attack: 0.005 }));  return 700; },
  galo() { [[520, 0, 0.18], [680, 0.2, 0.18], [900, 0.4, 0.45], [600, 0.88, 0.4]].forEach(([freq, delay, duration]) => t({ freq, slide: freq * 0.9, duration, delay, type: 'sawtooth', volume: 0.099 }));  return 1350; },
  ovelha() { for (let i = 0; i < 8; i++) t({ freq: i % 2 ? 330 : 300, duration: 0.11, delay: i * 0.1, type: 'triangle', volume: 0.132, attack: 0.02 });  return 900; },
  porco() { [0, 0.3].forEach(d => { t({ freq: 220, slide: 140, duration: 0.2, delay: d, type: 'sawtooth', volume: 0.11 }); t({ freq: 440, slide: 260, duration: 0.2, delay: d, type: 'square', volume: 0.044 }); });  return 600; },
  elefante() { t({ freq: 300, slide: 520, duration: 0.5, type: 'sawtooth', volume: 0.12, attack: 0.05 }); t({ freq: 520, slide: 380, duration: 0.7, delay: 0.45, type: 'sawtooth', volume: 0.12 }); return 1200; },
  passarinho() { [0, 0.16, 0.32, 0.55, 0.7].forEach(d => t({ freq: 1800, slide: 2600, duration: 0.11, delay: d, type: 'sine', volume: 0.11 }));  return 900; },
  abelha() { t({ freq: 220, duration: 1.1, type: 'sawtooth', volume: 0.088, attack: 0.05 }); for (let i = 0; i < 10; i++) t({ freq: 235 + (i % 2) * 8, duration: 0.11, delay: i * 0.1, type: 'square', volume: 0.055 });  return 1200; },
  cavalo() { [0, 0.14, 0.28, 0.42, 0.56].forEach((d, i) => t({ freq: 700 - i * 80, slide: 520 - i * 60, duration: 0.14, delay: d, type: 'sawtooth', volume: 0.088 })); return 750; }
};

// Toca o som duas vezes (com pequena pausa) e devolve a duração total em ms.
export function playAnimal(id) {
  if (!audio.enabled) return 0;
  const length = patterns[id]?.() ?? 0;
  if (length) setTimeout(() => patterns[id](), length + 250);
  return length ? length * 2 + 250 : 0;
}
export const animalPatterns = Object.keys(patterns);
