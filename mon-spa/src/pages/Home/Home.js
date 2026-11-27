// =============================================================================
// Home : page d'accueil (fusion de « Intro » et de « page1 » des anciens projets).
//
// Une PAGE = un module qui exporte par défaut une FONCTION renvoyant du HTML.
// Facultatif : Home.afterRender = () => {...} est appelée APRÈS l'insertion du
// HTML dans la page. C'est là qu'on branche clics, formulaires, minuteurs...
// (avant l'insertion, les éléments n'existent pas encore).
// =============================================================================
import { navigate } from '../../router.js';
import { icons } from '../../components/icons.js';

const features = [
  { icon: 'bolt',   title: 'Navigation instantanée',
    text: "Le contenu change sans recharger la page : le routeur écoute l'URL (#/...) et ne remplace que la zone principale." },
  { icon: 'layers', title: 'Chargement à la demande',
    text: "Chaque page est un module importé avec import() uniquement à la première visite. L'affichage initial reste léger." },
  { icon: 'box',    title: 'Zéro dépendance',
    text: 'HTML, CSS et JavaScript natifs. Pas de framework, pas de build : on ouvre, on comprend, on modifie.' },
];

const Home = () => `
  <div class="page">
    <section class="hero">
      <div class="hero__copy">
        <span class="badge">${icons.bolt} Single Page Application · JavaScript pur</span>
        <h1 class="hero__title">Une SPA <span class="grad">fluide</span>, sans framework.</h1>
        <p class="hero__lead">
          Bienvenue sur l'application SPA. Un routeur maison, des pages chargées à la demande
          et une interface soignée : tout en JavaScript natif, du premier clic au dernier.
        </p>
        <div class="hero__cta">
          <button class="btn btn--primary btn--lg" id="goToLogin">Se connecter ${icons.arrow}</button>
          <button class="btn btn--secondary btn--lg" id="goToRegister">S'inscrire</button>
        </div>
      </div>

      <div class="hero__visual" aria-hidden="true">
        <div class="mock">
          <div class="mock__bar">
            <span class="mock__dot"></span><span class="mock__dot"></span><span class="mock__dot"></span>
            <div class="mock__url">mon-spa.local/<b id="mockHash">#/</b></div>
          </div>
          <div class="mock__body">
            <div class="mock__title" id="mockTitle">Accueil</div>
            <div class="mock__lines"><span></span><span></span><span></span></div>
            <div class="mock__cards"><i></i><i></i><i></i></div>
          </div>
          <div class="mock__chip mock__chip--a">import('./pages/…')</div>
          <div class="mock__chip mock__chip--b">afterRender() ✓</div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section__head">
        <span class="eyebrow">Pourquoi une SPA</span>
        <h2>Tout ce qu'il faut, rien de plus</h2>
      </div>
      <div class="grid grid--3">
        ${features.map((f) => `
          <article class="card">
            <span class="card__icon">${icons[f.icon]}</span>
            <h3>${f.title}</h3>
            <p>${f.text}</p>
          </article>`).join('')}
      </div>
    </section>

    <section class="cta-band">
      <div>
        <h2>Envie de regarder sous le capot ?</h2>
        <p>Explorez les pages, puis découvrez le routeur étape par étape.</p>
      </div>
      <div class="cta-band__actions">
        <a class="btn btn--secondary btn--lg" href="#/menu">Voir le menu</a>
        <a class="btn btn--ghost btn--lg" href="#/solution">Comment ça marche ${icons.arrow}</a>
      </div>
    </section>
  </div>
`;

Home.afterRender = () => {
  // Les deux boutons du héros utilisent navigate() ; ceux du bas sont de simples liens <a href="#/...">.
  document.getElementById('goToLogin')?.addEventListener('click', () => navigate('/login'));
  document.getElementById('goToRegister')?.addEventListener('click', () => navigate('/register'));
  startMockDemo();
};

// Petite animation : la fausse fenêtre de navigateur change de « page » toute seule.
function startMockDemo() {
  const hash = document.getElementById('mockHash');
  const title = document.getElementById('mockTitle');
  if (!hash || !title || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const steps = [['#/', 'Accueil'], ['#/menu', 'Menu'], ['#/solution', 'Solution'], ['#/login', 'Connexion']];
  let i = 0;
  const timer = setInterval(() => {
    if (!hash.isConnected) return clearInterval(timer); // la page a été quittée : on s'arrête
    i = (i + 1) % steps.length;
    hash.textContent = steps[i][0];
    title.textContent = steps[i][1];
    title.classList.remove('is-swap');
    void title.offsetWidth;            // force le navigateur à relancer l'animation
    title.classList.add('is-swap');
  }, 2400);
}

export default Home;
