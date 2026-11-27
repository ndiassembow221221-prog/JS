// =============================================================================
// Solution : explique le fonctionnement du routeur (la page documente le projet).
// Les extraits de code sont échappés avec escapeHtml pour s'afficher tels quels.
// =============================================================================
import { escapeHtml } from '../../utils.js';
import { icons } from '../../components/icons.js';

const steps = [
  { title: "L'URL change",
    text: "Un clic sur un lien <code>&lt;a href=\"#/menu\"&gt;</code> modifie seulement la partie après le « # ». Le navigateur ne recharge rien et émet l'événement <code>hashchange</code>." },
  { title: 'Le routeur cherche la page',
    text: "<code>getPath()</code> lit le hash, puis la table <code>routes</code> donne le nom de la page. Chemin inconnu : c'est la page <code>NotFound</code>. Page privée sans session : retour à la connexion." },
  { title: 'Import dynamique',
    text: "<code>await import(...)</code> télécharge le fichier de la page seulement maintenant. Le navigateur le garde ensuite en cache." },
  { title: 'Affichage',
    text: "La page est une fonction qui renvoie du HTML. Le routeur l'insère dans <code>&lt;main id=\"app\"&gt;</code> avec <code>innerHTML</code>." },
  { title: 'afterRender',
    text: "Le HTML existe enfin : <code>afterRender()</code> branche les clics et les formulaires. La navbar, elle, met à jour le lien actif grâce à l'événement <code>route:change</code>." },
];

const samples = {
  routes: `// src/routes.js
export const routes = {
  '/':       { page: 'Home',   title: 'Accueil' },
  '/login':  { page: 'Login',  title: 'Connexion' },
  '/espace': { page: 'Espace', private: true },
};`,
  page: `// src/pages/Exemple/Exemple.js
import { navigate } from '../../router.js';

const Exemple = () => \`
  <h1>Bonjour</h1>
  <button id="go">Retour à l'accueil</button>
\`;

Exemple.afterRender = () => {
  document.getElementById('go')
    .addEventListener('click', () => navigate('/'));
};

export default Exemple;`,
  core: `// src/router.js (cœur du routeur)
const pageModule = await import(\`./pages/\${name}/\${name}.js\`);
const page = pageModule.default;

app.innerHTML = page(ctx);   // 1. on insère le HTML
page.afterRender?.(ctx);     // 2. on branche les événements`,
};

const figure = (title, code) => `
  <figure class="codefig">
    <figcaption>${title}</figcaption>
    <pre class="codeblock"><code>${escapeHtml(code)}</code></pre>
  </figure>`;

const extras = [
  { icon: 'lock',  title: 'Garde de route',
    text: "Une route marquée <code>private: true</code> redirige vers la connexion si personne n'est connecté. Essayez <code>#/espace</code> sans session." },
  { icon: 'alert', title: 'Page 404',
    text: "Tout chemin absent de la table affiche <code>NotFound</code>, qui rappelle le chemin demandé et propose un retour à l'accueil." },
  { icon: 'check', title: 'Erreur technique',
    text: "Si l'import d'une page échoue, le routeur attrape l'erreur, affiche un message clair et propose « Réessayer »." },
];

const Solution = () => `
  <div class="page">
    <header class="page-head">
      <span class="eyebrow">Solution</span>
      <h1>Comment ça marche</h1>
      <p>Le parcours complet d'une navigation, de l'URL à l'écran, en cinq étapes.</p>
    </header>

    <ol class="steps">
      ${steps.map((s) => `
        <li class="step">
          <div class="step__body"><h3>${s.title}</h3><p>${s.text}</p></div>
        </li>`).join('')}
    </ol>

    <section class="section">
      <div class="section__head">
        <span class="eyebrow">En pratique</span>
        <h2>Écrire une page en deux étapes</h2>
        <p>1. Créer le fichier de la page. 2. Ajouter une ligne dans la table des routes. C'est tout.</p>
      </div>
      <div class="grid grid--2">
        ${figure('src/pages/Exemple/Exemple.js', samples.page)}
        <div class="stack">
          ${figure('src/routes.js', samples.routes)}
          ${figure('src/router.js', samples.core)}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section__head">
        <span class="eyebrow">Et aussi</span>
        <h2>Les cas particuliers sont gérés</h2>
      </div>
      <div class="grid grid--3">
        ${extras.map((x) => `
          <article class="card">
            <span class="card__icon">${icons[x.icon]}</span>
            <h3>${x.title}</h3>
            <p>${x.text}</p>
          </article>`).join('')}
      </div>
    </section>
  </div>
`;

export default Solution;
