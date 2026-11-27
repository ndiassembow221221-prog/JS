// =============================================================================
// toast.js : petit message qui apparaît puis disparaît (remplace alert()).
// type : 'info' | 'success' | 'error'
// textContent (et non innerHTML) : le texte est affiché tel quel, jamais
// interprété comme du HTML → sûr même avec un nom saisi par l'utilisateur.
// =============================================================================
export function toast(message, type = 'info', duration = 3200) {
  const host = document.getElementById('toasts');
  if (!host) return;

  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.textContent = message;
  host.append(el);

  setTimeout(() => {
    el.classList.add('is-leaving');
    setTimeout(() => el.remove(), 260);
  }, duration);
}
