// =============================================================================
// session.js : « connexion » de démonstration. AUCUNE vraie authentification :
// on garde juste un nom dans localStorage pour simuler un utilisateur connecté.
// Chaque changement émet l'événement "session:change" (écouté par la navbar
// et par le routeur).
// =============================================================================
const KEY = 'spa.user';

function load() {
  try {
    const u = JSON.parse(localStorage.getItem(KEY));
    return u && typeof u.name === 'string' ? u : null;
  } catch {
    return null;
  }
}

let user = load();
const emit = () => window.dispatchEvent(new CustomEvent('session:change'));

export const getUser = () => user;
export const isLoggedIn = () => user !== null;

export function login({ name, email = '' }) {
  user = { name, email, since: Date.now() };
  try { localStorage.setItem(KEY, JSON.stringify(user)); } catch { /* ignoré */ }
  emit();
}

export function logout() {
  user = null;
  try { localStorage.removeItem(KEY); } catch { /* ignoré */ }
  emit();
}

// Synchronisation entre onglets : déconnexion dans l'un = déconnexion dans l'autre.
window.addEventListener('storage', (e) => {
  if (e.key === KEY) { user = load(); emit(); }
});
