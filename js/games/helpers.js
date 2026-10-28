// Utilidades compartilhadas pelas atividades.
export function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export const pickRandom = list => list[Math.floor(Math.random() * list.length)];

// Sorteia um alvo (evitando repetir o anterior) e um conjunto de `count` opções que o inclui.
export function drawRound(pool, count, last) {
  const candidates = pool.filter(item => item.id !== last);
  const target = pickRandom(candidates.length ? candidates : pool);
  const others = shuffle(pool.filter(item => item.id !== target.id)).slice(0, Math.max(0, count - 1));
  return { target, options: shuffle([target, ...others]) };
}

export const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
