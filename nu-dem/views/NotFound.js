import { navigate } from '../controller/router.js';

const NotFound = () => `
  <div class="nf">
    <h1>404 - Page introuvable</h1>
    <p>La route demandée n'existe pas.</p><br>
    <button id="versAccueil">Retour à l'accueil</button>
  </div>`;

NotFound.afterRender = () => {
  document.getElementById('versAccueil')?.addEventListener('click', () => navigate('/'));
};

export default NotFound;
