// =============================================================================
// Apropos : présentation du projet et carte des concepts réunis.
// =============================================================================
import { escapeHtml } from '../../utils.js';

const concepts = [
  ['Routage par hash',            'router.js',            "L'événement hashchange déclenche l'affichage."],
  ['Table des routes',            'routes.js',            'Chemin → page, avec titre, icône, garde.'],
  ['Import dynamique',            'router.js',            'import() charge chaque page à la demande.'],
  ['Page = fonction HTML',        'pages/*/*.js',         'Un template string renvoyé par une fonction.'],
  ['Hook afterRender',            'pages/*/*.js',         'Branche les événements après insertion du HTML.'],
  ['navigate()',                  'router.js',            'Change de page en modifiant le hash.'],
  ['Page 404',                    'pages/NotFound',       'Affichée pour tout chemin inconnu.'],
  ['Erreur technique',            'router.js',            "try/catch autour de l'import, bouton Réessayer."],
  ['Message « Chargement... »',   'index.html',           'Visible avant le premier affichage.'],
  ['Barre de navigation fixe',    'components/navbar.js', 'Hors de #app : elle ne se recharge jamais.'],
  ['Connexion de démonstration',  'pages/Login + session.js', 'Un nom suffit, aucune vraie authentification.'],
  ['Boutons Se connecter / S\'inscrire', 'pages/Home, Register', 'Accueil → Connexion ou Inscription → Mon espace.'],
  ['Dossier public/images',       'public/images',        'Logo et favicon.'],
];

const tree = `mon-spa/
├── index.html              point d'entrée (nav, #app, footer, toasts)
├── public/images/          logo.svg, favicon.svg
└── src/
    ├── app.js              démarre tout
    ├── config.js           nom de l'application
    ├── routes.js           table des routes
    ├── router.js           hashchange, import(), navigate()
    ├── session.js          connexion de démo (localStorage)
    ├── theme.js            thème clair / sombre
    ├── utils.js            escapeHtml, validation de champs
    ├── components/         navbar, footer, toast, icons
    ├── pages/              Home, Menu, Solution, Apropos,
    │                       Login, Register, Espace, NotFound
    └── styles/             theme, base, components, pages`;

const Apropos = () => `
  <div class="page">
    <header class="page-head">
      <span class="eyebrow">À propos</span>
      <h1>Un seul projet, tous les concepts</h1>
      <p>Cette application réunit deux petits projets d'apprentissage en un seul :
         même routeur, mêmes idées, avec une interface complète et un thème soigné.</p>
    </header>

    <section class="section">
      <div class="section__head">
        <h2>Ce que le projet rassemble</h2>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Concept</th><th>Où le trouver</th><th>En bref</th></tr></thead>
          <tbody>
            ${concepts.map(([a, b, c]) => `
              <tr><td><strong>${a}</strong></td><td><code>${b}</code></td><td>${c}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </section>

    <section class="section">
      <div class="section__head">
        <h2>Structure des fichiers</h2>
      </div>
      <figure class="codefig">
        <figcaption>arborescence</figcaption>
        <pre class="codeblock"><code>${escapeHtml(tree)}</code></pre>
      </figure>
    </section>
  </div>
`;

export default Apropos;
