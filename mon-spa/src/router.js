// =============================================================================
// router.js : le routeur par hash.
//
// Principe : l'URL ressemble à  index.html#/solution . Tout ce qui suit le « # »
// peut changer SANS que le navigateur recharge la page. On écoute cet
// événement ("hashchange") et on remplace le contenu de <main id="app">.
//
//   hashchange → getPath() → table des routes → import() de la page
//              → page() renvoie le HTML → afterRender() branche les événements
// =============================================================================
import { routes } from './routes.js';
import { isLoggedIn } from './session.js';
import { toast } from './components/toast.js';
import { APP_NAME } from './config.js';

let renderId = 0;        // numéro de la navigation en cours (voir render)
let currentPath = null;  // chemin actuellement affiché
let firstRender = true;

// "#/solution?x=1" → "/solution"  |  "" ou "#" → "/"
export function getPath() {
  let path = window.location.hash.replace(/^#/, '').split('?')[0];
  if (!path.startsWith('/')) path = '/' + path;
  if (path.length > 1) path = path.replace(/\/+$/, '');
  return path || '/';
}

// Changer de page = changer le hash. { replace: true } remplace l'entrée de
// l'historique (le bouton « Retour » ne revient alors pas en arrière dessus).
export function navigate(path, { replace = false } = {}) {
  if (replace) window.location.replace('#' + path);
  else window.location.hash = path;
}

async function render(path) {
  const app = document.getElementById('app');
  if (!app) return;

  const id = ++renderId;
  const route = routes[path];

  // Garde de route : page privée sans session → direction la connexion.
  if (route?.private && !isLoggedIn()) {
    toast('Connectez-vous pour accéder à cette page.', 'info');
    navigate('/login', { replace: true });
    return;
  }

  const name = route ? route.page : 'NotFound';
  const ctx = { path, route };

  try {
    // Import dynamique : le fichier de la page n'est téléchargé qu'à la première visite.
    const pageModule = await import(`./pages/${name}/${name}.js`);

    // Si la personne a cliqué ailleurs pendant le chargement, on abandonne celle-ci.
    if (id !== renderId) return;

    const page = pageModule.default;       // une page = une fonction qui renvoie du HTML
    app.innerHTML = page(ctx);
    page.afterRender?.(ctx);               // puis on branche les événements (clics, formulaires)

    currentPath = path;
    document.title = `${route ? route.title : '404 · Page introuvable'} · ${APP_NAME}`;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (!firstRender) app.focus({ preventScroll: true }); // utile aux lecteurs d'écran
    firstRender = false;

    window.dispatchEvent(new CustomEvent('route:change', { detail: { path } }));
  } catch (error) {
    console.error(`Erreur de chargement de la page « ${name} » :`, error);
    app.innerHTML = `
      <div class="page error-box">
        <h1>Erreur technique</h1>
        <p>La page n'a pas pu être chargée. Ouvrez la console (F12) pour voir le détail.</p>
        <button class="btn btn--primary" id="retry">Réessayer</button>
      </div>`;
    document.getElementById('retry').addEventListener('click', () => render(path));
  }
}

const handleHashChange = () => render(getPath());

export function initRouter() {
  window.addEventListener('hashchange', handleHashChange);

  // Déconnexion pendant qu'on est sur une page privée → retour à l'accueil.
  window.addEventListener('session:change', () => {
    if (routes[currentPath]?.private && !isLoggedIn()) navigate('/', { replace: true });
  });

  handleHashChange(); // affiche la page correspondant à l'URL de départ
}
