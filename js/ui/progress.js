export function progressDots(total, done, label = 'rodadas') {
  if (!total) return '';
  return `<div class="dots" role="img" aria-label="${done} de ${total} ${label}">${Array.from({ length: total }, (_, i) => `<span class="dot ${i < done ? 'done' : ''} ${i === done ? 'current' : ''}"></span>`).join('')}</div>`;
}
