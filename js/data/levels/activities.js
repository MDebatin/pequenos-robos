// Fases das atividades com progressão.
// colors:  mode 'swatch' = o robô mostra a cor e a criança escolhe a amostra;
//          mode 'robot'  = a cor é falada/escrita e a criança escolhe o robô daquela cor;
//          mode 'mixed'  = alterna entre os dois a cada rodada.
export const activityLevels = {
  colors: [
    { options: 2, rounds: 3, mode: 'swatch' },
    { options: 3, rounds: 3, mode: 'swatch' },
    { options: 3, rounds: 4, mode: 'robot' },
    { options: 4, rounds: 4, mode: 'robot' },
    { options: 6, rounds: 5, mode: 'mixed' },
    { options: 8, rounds: 5, mode: 'mixed' }
  ],
  // Grade: c = coluna (0 à esquerda), r = linha (0 no topo). Todas as fases são verificadas por busca em largura nos testes.
  path: [
    { grid: { cols: 3, rows: 3 }, start: { c: 0, r: 1 }, goal: { c: 2, r: 1 }, obstacles: [], theme: '🌳' },
    { grid: { cols: 3, rows: 3 }, start: { c: 0, r: 2 }, goal: { c: 2, r: 0 }, obstacles: [], theme: '🌳' },
    { grid: { cols: 4, rows: 3 }, start: { c: 0, r: 2 }, goal: { c: 3, r: 2 }, obstacles: [{ c: 1, r: 2 }, { c: 2, r: 2 }], theme: '🪨' },
    { grid: { cols: 4, rows: 4 }, start: { c: 0, r: 0 }, goal: { c: 3, r: 3 }, obstacles: [{ c: 1, r: 0 }, { c: 1, r: 1 }, { c: 3, r: 1 }, { c: 2, r: 3 }], theme: '🪨' },
    { grid: { cols: 5, rows: 4 }, start: { c: 0, r: 3 }, goal: { c: 4, r: 0 }, obstacles: [{ c: 1, r: 3 }, { c: 1, r: 2 }, { c: 2, r: 1 }, { c: 3, r: 1 }, { c: 3, r: 2 }], theme: '🌵' },
    { grid: { cols: 5, rows: 5 }, start: { c: 2, r: 4 }, goal: { c: 2, r: 0 }, obstacles: [{ c: 2, r: 3 }, { c: 2, r: 2 }, { c: 1, r: 1 }, { c: 2, r: 1 }, { c: 3, r: 1 }, { c: 0, r: 3 }], theme: '🌵' },
    { grid: { cols: 5, rows: 5 }, start: { c: 0, r: 0 }, goal: { c: 4, r: 4 }, obstacles: [{ c: 1, r: 0 }, { c: 1, r: 1 }, { c: 1, r: 2 }, { c: 3, r: 2 }, { c: 3, r: 3 }, { c: 3, r: 4 }, { c: 2, r: 4 }], theme: '🧱' },
    { grid: { cols: 6, rows: 5 }, start: { c: 0, r: 2 }, goal: { c: 5, r: 2 }, obstacles: [{ c: 1, r: 1 }, { c: 1, r: 2 }, { c: 1, r: 3 }, { c: 3, r: 0 }, { c: 3, r: 1 }, { c: 3, r: 2 }, { c: 4, r: 2 }, { c: 4, r: 4 }], theme: '🧱' }
  ],
  memory: [
    { pairs: 2 }, { pairs: 3 }, { pairs: 4 }, { pairs: 5 }, { pairs: 6 }
  ],
  sounds: [
    { options: 2, rounds: 3, pool: ['gato', 'cachorro'] },
    { options: 3, rounds: 3, pool: ['gato', 'cachorro', 'vaca', 'pato'] },
    { options: 4, rounds: 4, pool: ['gato', 'cachorro', 'vaca', 'pato', 'sapo', 'galo'] },
    { options: 4, rounds: 4, pool: ['vaca', 'pato', 'sapo', 'galo', 'ovelha', 'porco', 'elefante'] },
    { options: 6, rounds: 5, pool: ['gato', 'cachorro', 'vaca', 'sapo', 'pato', 'galo', 'ovelha', 'porco', 'elefante', 'passarinho', 'abelha', 'cavalo'] }
  ]
};
