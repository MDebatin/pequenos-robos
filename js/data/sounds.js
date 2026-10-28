// Sons da atividade "Descubra os sons".
// `file` aponta para a gravação em assets/audio/animals (créditos em CREDITS.md).
// Se o arquivo falhar, o som é sintetizado por js/services/animal-sounds.js. A onomatopeia é falada depois do som.
export const sounds = [
  { id: 'gato', name: 'gato', article: 'o', icon: '🐱', say: 'Miau, miau!', file: 'assets/audio/animals/gato.mp3' },
  { id: 'cachorro', name: 'cachorro', article: 'o', icon: '🐶', say: 'Au, au, au!', file: 'assets/audio/animals/cachorro.mp3' },
  { id: 'vaca', name: 'vaca', article: 'a', icon: '🐮', say: 'Muuuuu!', file: 'assets/audio/animals/vaca.mp3' },
  { id: 'sapo', name: 'sapo', article: 'o', icon: '🐸', say: 'Croac, croac!', file: 'assets/audio/animals/sapo.mp3' },
  { id: 'pato', name: 'pato', article: 'o', icon: '🦆', say: 'Quá, quá, quá!', file: 'assets/audio/animals/pato.mp3' },
  { id: 'galo', name: 'galo', article: 'o', icon: '🐓', say: 'Cocoricó!', file: 'assets/audio/animals/galo.mp3' },
  { id: 'ovelha', name: 'ovelha', article: 'a', icon: '🐑', say: 'Béééé!', file: 'assets/audio/animals/ovelha.mp3' },
  { id: 'porco', name: 'porco', article: 'o', icon: '🐷', say: 'Oinc, oinc!', file: 'assets/audio/animals/porco.mp3' },
  { id: 'elefante', name: 'elefante', article: 'o', icon: '🐘', say: 'Pruuuum!', file: 'assets/audio/animals/elefante.mp3' },
  { id: 'passarinho', name: 'passarinho', article: 'o', icon: '🐦', say: 'Piu, piu, piu!', file: 'assets/audio/animals/passarinho.mp3' },
  { id: 'abelha', name: 'abelha', article: 'a', icon: '🐝', say: 'Bzzzzzz!', file: 'assets/audio/animals/abelha.mp3' },
  { id: 'cavalo', name: 'cavalo', article: 'o', icon: '🐴', say: 'Hiiin-hin-hin!', file: 'assets/audio/animals/cavalo.mp3' }
];
export const soundById = id => sounds.find(sound => sound.id === id);
