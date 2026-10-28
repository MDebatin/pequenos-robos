// Busca em largura no tabuleiro do Caminho do robô. Usada pelo jogo (dicas) e pelos testes (solucionabilidade).
export const directions = { up: { c: 0, r: -1 }, down: { c: 0, r: 1 }, left: { c: -1, r: 0 }, right: { c: 1, r: 0 } };

export const isBlocked = (level, cell) =>
  cell.c < 0 || cell.r < 0 || cell.c >= level.grid.cols || cell.r >= level.grid.rows ||
  level.obstacles.some(item => item.c === cell.c && item.r === cell.r);

export const stepFrom = (cell, dir) => ({ c: cell.c + directions[dir].c, r: cell.r + directions[dir].r });

// Devolve a lista de direções do caminho mais curto de `from` até a meta, ou null se não houver caminho.
export function solve(level, from = level.start) {
  const key = cell => `${cell.c},${cell.r}`;
  const queue = [from];
  const previous = new Map([[key(from), null]]);
  while (queue.length) {
    const cell = queue.shift();
    if (cell.c === level.goal.c && cell.r === level.goal.r) {
      const path = [];
      let k = key(cell);
      while (previous.get(k)) { const { dir, fromKey } = previous.get(k); path.unshift(dir); k = fromKey; }
      return path;
    }
    for (const dir of Object.keys(directions)) {
      const next = stepFrom(cell, dir);
      if (isBlocked(level, next) || previous.has(key(next))) continue;
      previous.set(key(next), { dir, fromKey: key(cell) });
      queue.push(next);
    }
  }
  return null;
}
