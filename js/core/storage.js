const key = 'ebas-pequenos-robos';
function read() { try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; } }
export const storage = {
  get(name, fallback) { return read()[name] ?? fallback; },
  set(name, value) { try { const data = read(); data[name] = value; localStorage.setItem(key, JSON.stringify(data)); } catch { /* armazenamento indisponível */ } },
  clear() { try { localStorage.removeItem(key); } catch { /* ignora */ } }
};
