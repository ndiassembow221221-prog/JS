// =============================================================================
// Menu : le plan de l'application. Les cartes sont GÉNÉRÉES depuis la table des
// routes (routes.js) : ajouter une route ajoute automatiquement une carte.
// =============================================================================
import { routes } from '../../routes.js';
import { icons } from '../../components/icons.js';

const card = (path, r) => `
  <a class="card card--link" href="#${path}">
    <span class="card__icon">${icons[r.icon]}</span>
    <h3>${r.title}</h3>
    <p>${r.desc}</p>
    <div class="card__foot">
      <code>#${path}</code>
      ${r.private ? `<span class="badge badge--ok">${icons.lock} Protégée</span>` : ''}
    </div>
  </a>`;

const Menu = () => `
  <div class="page">
    <header class="page-head">
      <span class="eyebrow">Menu</span>
      <h1>Explorez l'application</h1>
      <p>Chaque carte correspond à une route de <code>routes.js</code>. Cliquez : la page est chargée à la demande.</p>
    </header>

    <div class="grid grid--3">
      ${Object.entries(routes).map(([path, r]) => card(path, r)).join('')}

      <a class="card card--link" href="#/page-inexistante">
        <span class="card__icon">${icons.alert}</span>
        <h3>Tester la page 404</h3>
        <p>Un chemin absent de la table des routes affiche la page « introuvable ».</p>
        <div class="card__foot"><code>#/page-inexistante</code></div>
      </a>
    </div>
  </div>
`;

export default Menu;
