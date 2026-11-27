// =============================================================================
// Espace : page PROTÉGÉE (route private: true). C'est la « deuxième page »
// atteinte depuis « Se connecter ». Le routeur ne l'affiche que si une session existe.
// =============================================================================
import { getUser, logout } from '../../session.js';
import { toast } from '../../components/toast.js';
import { escapeHtml } from '../../utils.js';
import { icons } from '../../components/icons.js';

const Espace = () => {
  const user = getUser() ?? { name: 'invité', email: '', since: Date.now() };
  const time = new Date(user.since).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return `
    <div class="page">
      <header class="page-head">
        <span class="badge badge--ok">${icons.lock} Page protégée</span>
        <h1>Bonjour, <span class="grad">${escapeHtml(user.name)}</span></h1>
        <p>Vous voyez cette page parce qu'une session existe. Le routeur la cache à toute personne non connectée.</p>
      </header>

      <div class="grid grid--2">
        <article class="card">
          <h3>Votre session</h3>
          <dl class="kv">
            <div><dt>Nom</dt><dd>${escapeHtml(user.name)}</dd></div>
            <div><dt>E-mail</dt><dd>${user.email ? escapeHtml(user.email) : '—'}</dd></div>
            <div><dt>Connecté à</dt><dd>${time}</dd></div>
          </dl>
          <button class="btn btn--secondary" id="logoutBtn">${icons.logout} Se déconnecter</button>
        </article>

        <article class="card">
          <h3>À essayer</h3>
          <p>Déconnectez-vous, puis ouvrez <code>#/espace</code> : le routeur vous renvoie vers la connexion.
             Ouvrez deux onglets : se déconnecter dans l'un déconnecte l'autre.</p>
          <a class="btn btn--primary" href="#/menu">Retour au menu ${icons.arrow}</a>
        </article>
      </div>
    </div>`;
};

Espace.afterRender = () => {
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    logout();                                  // le routeur redirige ensuite vers l'accueil
    toast('Vous êtes déconnecté.', 'info');
  });
};

export default Espace;
