// =============================================================================
// NotFound : page 404, affichée pour tout chemin absent de la table des routes.
// Le routeur lui passe { path } : on rappelle le chemin demandé (échappé !).
// =============================================================================
import { navigate } from '../../router.js';
import { escapeHtml } from '../../utils.js';

const NotFound = ({ path = '' } = {}) => `
  <div class="page notfound">
    <p class="notfound__code" aria-hidden="true">404</p>
    <h1>Page introuvable</h1>
    <p>La route demandée n'existe pas.</p>
    <p><code>#${escapeHtml(path)}</code></p>
    <button class="btn btn--primary btn--lg" id="homeLink">Retour à l'accueil</button>
  </div>
`;

NotFound.afterRender = () => {
  document.getElementById('homeLink')?.addEventListener('click', () => navigate('/'));
};

export default NotFound;
