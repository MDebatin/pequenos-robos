export function celebrate(container, { big = false } = {}) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.createElement('div');
  layer.className = 'confetti';
  layer.setAttribute('aria-hidden', 'true');
  const count = big ? 70 : 34;
  for (let i = 0; i < count; i++) {
    const bit = document.createElement('i');
    bit.style.setProperty('--x', `${Math.random() * 100}%`);
    bit.style.setProperty('--delay', `${Math.random() * (big ? 0.9 : 0.35)}s`);
    bit.textContent = ['★', '●', '◆', '♥'][i % 4];
    layer.append(bit);
  }
  container.append(layer);
  setTimeout(() => layer.remove(), big ? 2400 : 1500);
}
