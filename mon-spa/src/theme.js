// =============================================================================
// theme.js : thème clair / sombre. Le choix est mémorisé dans localStorage.
// Le thème est un simple attribut sur <html> : <html data-theme="dark">.
// Les couleurs de chaque thème sont définies dans styles/theme.css.
// =============================================================================
const KEY = 'spa.theme';
const root = document.documentElement;
const media = matchMedia('(prefers-color-scheme: dark)');

const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const write = (v) => { try { localStorage.setItem(KEY, v); } catch { /* navigation privée */ } };
const system = () => (media.matches ? 'dark' : 'light');
const set = (t) => root.setAttribute('data-theme', t);

export function initTheme() {
  set(read() || system());
  // Si la personne n'a jamais choisi, on suit le réglage du système.
  media.addEventListener('change', () => { if (!read()) set(system()); });
}

export function toggleTheme() {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  set(next);
  write(next);
  return next;
}
