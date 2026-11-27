import { routes, accueilDe } from './routes.js';
import { session } from '../models/session.js';
import { esc, toast } from '../lib/ui.js';

const app = document.querySelector('#app');
let jeton = 0; // ignore les rendus périmés (clics rapides)

const trouver = (lien) => {
  const cle = Object.keys(routes).find((k) => k.toLowerCase() === lien.toLowerCase());
  return cle ? routes[cle] : null;
};

const obtenirRoute = () => window.location.hash.replace('#', '') || '/';

const navigate = (lien) => {
  if (obtenirRoute() === lien) return affPage(lien);
  window.location.hash = lien;
};

const rafraichir = () => affPage(obtenirRoute());

const affPage = async (lien) => {
  const moi = ++jeton;
  const route = trouver(lien);

  if (route?.role) {                                   // garde de route par rôle
    const user = session.user;
    if (!user) {
      sessionStorage.setItem('nudem:retour', lien);
      toast('Connectez-vous pour continuer', 'err');
      return navigate('/Connexion');
    }
    if (user.type !== route.role) return navigate(accueilDe[user.type]);
  }

  app.innerHTML = '<p class="chargement">Chargement...</p>';
  try {
    const page = await import(`../views/${route ? route.page : 'NotFound'}.js`);
    const component = page.default;
    const html = await component();                    // la vue peut être async (appels API)
    if (moi !== jeton) return;
    app.innerHTML = html;
    document.title = `${route ? route.titre : 'Page introuvable'} · Ñu dem`;
    window.scrollTo(0, 0);
    if (component.afterRender) await component.afterRender();
  } catch (error) {
    console.error('Erreur de navigation', error);
    if (moi !== jeton) return;
    app.innerHTML = `<div class="erreur-tech"><h1>Erreur technique</h1>
      <p>${esc(error.message || 'Erreur de navigation')}</p>
      <p class="aide">Vérifiez que l'API tourne : <code>npm start</code></p>
      <button id="reessayer">Réessayer</button></div>`;
    document.querySelector('#reessayer').addEventListener('click', () => affPage(lien));
  }
};

window.addEventListener('hashchange', () => affPage(obtenirRoute()));
affPage(obtenirRoute());

export { navigate, affPage, rafraichir, obtenirRoute };
