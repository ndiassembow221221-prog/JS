// =============================================================================
// utils.js : petits outils partagés.
// =============================================================================

// Neutralise le HTML d'un texte saisi par l'utilisateur avant de l'insérer dans
// un template. Sans ça, un nom comme <img onerror=...> s'exécuterait (faille XSS).
export const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const initial = (name = '') => (name.trim()[0] || '?').toUpperCase();

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Affiche / efface un message d'erreur sous un champ (.field > input + .field__error)
export function showFieldError(input, message) {
  const field = input.closest('.field');
  const error = field.querySelector('.field__error');
  field.classList.add('field--invalid');
  input.setAttribute('aria-invalid', 'true');
  error.textContent = message;
  error.hidden = false;
}

export function clearFieldError(input) {
  const field = input.closest('.field');
  const error = field.querySelector('.field__error');
  field.classList.remove('field--invalid');
  input.removeAttribute('aria-invalid');
  error.hidden = true;
}
