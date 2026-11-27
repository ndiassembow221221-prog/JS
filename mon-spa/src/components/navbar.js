// =============================================================================
// navbar.js : barre de navigation PERSISTANTE (elle reste en place quand on
// change de page : seul <main id="app"> est remplacé).
//
// Elle est construite une seule fois, puis se met à jour en écoutant :
//   - "route:change"   (émis par le routeur)  → lien actif
//   - "session:change" (émis par session.js)  → boutons Connexion / Déconnexion
// Les clics sont gérés par DÉLÉGATION : un seul écouteur sur le <header>,
// qui continue de marcher même quand on remplace une partie du HTML.
// =============================================================================
import { routes } from '../routes.js';
import { getUser, logout } from '../session.js';
import { toggleTheme } from '../theme.js';
import { icons } from './icons.js';
import { toast } from './toast.js';
import { escapeHtml, initial } from '../utils.js';
import { APP_NAME } from '../config.js';

// Liens du menu : générés depuis la table des routes (celles marquées nav: true)
const links = () =>
  Object.entries(routes)
    .filter(([, r]) => r.nav)
    .map(([path, r]) => `<a class="nav__link" href="#${path}" data-path="${path}">${r.title}</a>`)
    .join('');

// Zone de droite : dépend de l'état de connexion
const auth = () => {
  const user = getUser();
  if (user) {
    return `
      <a class="nav__user" href="#/espace" data-path="/espace">
        <span class="avatar" aria-hidden="true">${escapeHtml(initial(user.name))}</span>
        <span class="nav__username">${escapeHtml(user.name)}</span>
      </a>
      <button class="btn btn--ghost btn--sm" type="button" data-action="logout">
        ${icons.logout} Déconnexion
      </button>`;
  }
  return `
    <a class="btn btn--ghost btn--sm" href="#/login">Connexion</a>
    <a class="btn btn--primary btn--sm" href="#/register">S'inscrire</a>`;
};

const template = () => `
  <div class="nav container">
    <a class="brand" href="#/" aria-label="${APP_NAME} — accueil">
      <img src="./public/images/logo.svg" alt="" width="34" height="34" />
      <span>${APP_NAME}</span>
    </a>

    <nav class="nav__menu" id="nav-menu" aria-label="Navigation principale">
      <div class="nav__links">${links()}</div>
      <div class="nav__auth">${auth()}</div>
    </nav>

    <div class="nav__tools">
      <button class="icon-btn" type="button" data-action="theme" aria-label="Changer de thème">
        <span class="icon-sun">${icons.sun}</span><span class="icon-moon">${icons.moon}</span>
      </button>
      <button class="icon-btn nav__burger" type="button" data-action="menu"
              aria-expanded="false" aria-controls="nav-menu" aria-label="Ouvrir le menu">
        <span class="icon-open">${icons.menu}</span><span class="icon-close">${icons.close}</span>
      </button>
    </div>
  </div>`;

export function mountNavbar() {
  const header = document.getElementById('navbar');
  if (!header) return;
  header.innerHTML = template();

  const burger = header.querySelector('[data-action="menu"]');
  let currentPath = null;

  // Marque le lien de la page courante (style + aria-current pour l'accessibilité)
  const markActive = () => {
    header.querySelectorAll('.nav__link, .nav__user').forEach((a) => {
      if (a.dataset.path === currentPath) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  };

  // Menu mobile (burger)
  const setMenu = (open) => {
    header.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  };

  header.addEventListener('click', (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (actionEl) {
      const action = actionEl.dataset.action;
      if (action === 'theme') toggleTheme();
      if (action === 'menu') setMenu(!header.classList.contains('is-open'));
      if (action === 'logout') { logout(); toast('Vous êtes déconnecté.', 'info'); }
      return;
    }
    if (e.target.closest('a[href^="#/"]')) setMenu(false); // ferme le menu après un clic sur un lien
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  window.addEventListener('route:change', (e) => {
    currentPath = e.detail.path;
    markActive();
    setMenu(false);
  });

  window.addEventListener('session:change', () => {
    header.querySelector('.nav__auth').innerHTML = auth();
    markActive();
  });
}
