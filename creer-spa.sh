#!/usr/bin/env bash
# =============================================================================
#  creer-spa.sh : UN SEUL fichier pour UN SEUL projet SPA (JavaScript pur)
#  Fusion de : mon-spa (thème) + PjtDynamic (script-project.sh, script.sh,
#  create.sh AgriSemence, acteur.json, Breukh).
#
#    ./creer-spa.sh <nom-projet>        crée le projet complet
#    ./creer-spa.sh page <NomPage>      (dans le projet) ajoute une page + sa route
#    ./creer-spa.sh serve               (dans le projet) lance le serveur local
# =============================================================================
set -euo pipefail

usage() {
  echo "Mode d'emploi :"
  echo "  ./creer-spa.sh <nom-projet>     créer le projet"
  echo "  ./creer-spa.sh page <NomPage>   ajouter une page (dans le projet)"
  echo "  ./creer-spa.sh serve            lancer le serveur local"
  exit 1
}

[ -z "${1:-}" ] && usage

# ---------- Mode : serve ------------------------------------------------------
if [ "$1" = "serve" ]; then
  echo "→ http://localhost:${PORT:-5173}"
  exec python3 -m http.server "${PORT:-5173}"
fi

# ---------- Mode : page (ex script.sh) ----------------------------------------
if [ "$1" = "page" ]; then
  NOM="${2:-}"
  [ -z "$NOM" ] && { echo "Usage : ./creer-spa.sh page NomPage"; exit 1; }
  [[ "$NOM" =~ ^[A-Za-z][A-Za-z0-9]*$ ]] || { echo "Nom invalide (lettres/chiffres, sans espace)."; exit 1; }
  [ -f src/routes.js ] || { echo "Lancez cette commande à la racine du projet (src/routes.js introuvable)."; exit 1; }
  FICHIER="src/views/$NOM.js"
  [ -e "$FICHIER" ] && { echo "$FICHIER existe déjà."; exit 1; }
  CLE="/$(echo "$NOM" | tr '[:upper:]' '[:lower:]')"
  cat > "$FICHIER" <<__F__
import { navigate } from '../controller/router.js';

const $NOM = () => \`
  <section>
    <h1>$NOM</h1>
    <p class="muted">Bienvenue sur la page $NOM.</p>
    <button class="btn" id="btn-retour">Retour à l'accueil</button>
  </section>
\`;

$NOM.afterRender = () => {
  document.querySelector('#btn-retour').addEventListener('click', () => navigate('/'));
};

export default $NOM;
__F__
  LIGNE="  '$CLE': { page: '$NOM', titre: '$NOM', desc: 'Page $NOM.', nav: true },"
  awk -v l="$LIGNE" '/\/\/ \{\{ROUTES\}\}/{print l} {print}' src/routes.js > src/routes.js.tmp && mv src/routes.js.tmp src/routes.js
  echo "Page créée : $FICHIER  (route $CLE ajoutée à src/routes.js)"
  exit 0
fi

# ---------- Mode : création du projet (ex script-project.sh + create.sh) -------
R="$1"
if [ -d "$R" ] && [ -n "$(ls -A "$R" 2>/dev/null)" ]; then
  echo "Le dossier '$R' existe déjà et n'est pas vide."; exit 1
fi

ecrire() { mkdir -p "$(dirname "$1")"; cat > "$1"; }
mkdir -p "$R/public/images" "$R/src/controller" "$R/src/views" "$R/src/lib" "$R/src/styles"
touch "$R/public/images/.gitkeep"

# ---------------------------------------------------------------- index.html
ecrire "$R/index.html" <<'__F__'
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AgriSemence</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&family=Figtree:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./src/styles/theme.css">
</head>
<body>
  <header id="nav"></header>
  <main id="app">Chargement...</main>
  <script>
    if (location.protocol === 'file:')
      document.getElementById('app').innerHTML =
        '<p style="padding:2rem">Les modules JS sont bloqués en file://. Lancez : <code>./creer-spa.sh serve</code> ou <code>python3 -m http.server 5173</code>, puis ouvrez http://localhost:5173</p>';
  </script>
  <script type="module" src="./src/app.js"></script>
</body>
</html>
__F__

# ----------------------------------------------------------------- data.json
# (ex acteur.json : posts / comments / profile conservés + données AgriSemence)
ecrire "$R/data.json" <<'__F__'
{
  "paysans": [
    { "nom": "Awa Diop", "village": "Thiès", "culture": "Mil" },
    { "nom": "Moussa Ndiaye", "village": "Kaolack", "culture": "Arachide" }
  ],
  "stocks": [
    { "semence": "Mil souna 3", "quantite": "1200 kg", "entrepot": "Thiès" },
    { "semence": "Arachide 55-437", "quantite": "800 kg", "entrepot": "Kaolack" }
  ],
  "distributions": [
    { "paysan": "Awa Diop", "semence": "Mil souna 3", "quantite": "50 kg", "date": "2026-06-02" }
  ],
  "suivis": [
    { "paysan": "Awa Diop", "parcelle": "Parcelle A", "etat": "Levée correcte", "date": "2026-06-20" }
  ],
  "posts": [ { "id": 1, "title": "json-server", "author": "typicode" } ],
  "comments": [ { "id": 1, "body": "some comment", "postId": 1 } ],
  "profile": { "name": "typicode" }
}
__F__

# ------------------------------------------------------------ src/routes.js
ecrire "$R/src/routes.js" <<'__F__'
// Table de routes = source unique (navbar, page Menu et routeur en dépendent).
// prive: true  → page protégée (redirige vers /connexion)
// nav: true    → lien dans la barre de navigation
export const routes = {
  '/':              { page: 'Accueil',       titre: 'Accueil',       desc: 'Bienvenue.',                       nav: true },
  '/menu':          { page: 'Menu',          titre: 'Menu',          desc: 'Toutes les pages du site.',        nav: true },
  '/solution':      { page: 'Solution',      titre: 'Solution',      desc: 'Comment nous aidons les paysans.', nav: true },
  '/apropos':       { page: 'Apropos',       titre: 'À propos',      desc: 'Qui sommes-nous ?',                nav: true },
  '/connexion':     { page: 'Connexion',     titre: 'Connexion',     desc: 'Accéder à votre espace.' },
  '/inscription':   { page: 'Inscription',   titre: 'Inscription',   desc: 'Créer un compte.' },
  '/espace':        { page: 'Espace',        titre: 'Mon espace',    desc: 'Tableau de bord.',                 nav: true, prive: true },
  '/paysans':       { page: 'Paysans',       titre: 'Paysans',       desc: 'Ajouter et lister les paysans.',   nav: true, prive: true },
  '/stocks':        { page: 'Stocks',        titre: 'Stocks',        desc: 'Stocks de semences.',              nav: true, prive: true },
  '/distributions': { page: 'Distributions', titre: 'Distributions', desc: 'Distributions effectuées.',        nav: true, prive: true },
  '/suivi':         { page: 'Suivi',         titre: 'Suivi',         desc: 'Suivi des parcelles.',             nav: true, prive: true },
  // {{ROUTES}}  (ne pas supprimer : ./creer-spa.sh page y ajoute les nouvelles routes)
};
__F__

# ------------------------------------------------------------- src/app.js
ecrire "$R/src/app.js" <<'__F__'
import { affPage, obtenirRoute } from './controller/router.js';
import { lire, ecrire, deconnecter } from './lib/store.js';
import { toast } from './lib/ui.js';

const racine = document.documentElement;
racine.dataset.theme = lire('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

window.addEventListener('hashchange', () => affPage(obtenirRoute()));

document.querySelector('#nav').addEventListener('click', (e) => {
  const nav = e.currentTarget;
  const act = e.target.closest('[data-act]')?.dataset.act;
  if (act === 'burger') nav.classList.toggle('ouvert');
  else if (act === 'theme') {
    racine.dataset.theme = racine.dataset.theme === 'dark' ? 'light' : 'dark';
    ecrire('theme', racine.dataset.theme);
  } else if (act === 'logout') {
    deconnecter(); toast('Déconnecté');
    nav.classList.remove('ouvert');
    location.hash = '/'; affPage('/');
  } else if (e.target.closest('a')) nav.classList.remove('ouvert');
});

affPage(obtenirRoute());
__F__

# ------------------------------------------------ src/controller/router.js
ecrire "$R/src/controller/router.js" <<'__F__'
import { routes } from '../routes.js';
import { estConnecte } from '../lib/store.js';
import { majNavbar } from '../lib/navbar.js';
import { esc } from '../lib/ui.js';

const app = document.querySelector('#app');
let jeton = 0; // ignore les rendus périmés (clics rapides)

const trouver = (lien) => {
  const cle = Object.keys(routes).find((k) => k.toLowerCase() === lien.toLowerCase());
  return cle ? { cle, ...routes[cle] } : null;
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
  app.innerHTML = '<p class="chargement">Chargement...</p>';

  if (route?.prive && !estConnecte()) {          // garde de route
    sessionStorage.setItem('retour', lien);
    return navigate('/connexion');
  }
  try {
    const page = await import(`../views/${route ? route.page : 'NotFound'}.js`);
    const component = page.default;
    const html = await component();
    if (moi !== jeton) return;
    app.innerHTML = html;
    document.title = `${route ? route.titre : 'Page introuvable'} · AgriSemence`;
    majNavbar(route ? route.cle : '');
    window.scrollTo(0, 0);
    // Exécute les addEventListener de la vue après l'injection HTML
    if (component.afterRender) component.afterRender();
  } catch (error) {
    console.error('Erreur de navigation', error);
    if (moi !== jeton) return;
    app.innerHTML = `<section class="carte erreur"><h1>Erreur technique</h1>
      <p class="muted">${esc(error.message || 'Erreur de navigation')}</p>
      <button class="btn" id="reessayer">Réessayer</button></section>`;
    document.querySelector('#reessayer').addEventListener('click', () => affPage(lien));
  }
};

export { navigate, affPage, obtenirRoute, rafraichir };
__F__

# ------------------------------------------------------ src/lib/store.js
ecrire "$R/src/lib/store.js" <<'__F__'
const K = 'spa:';
export const lire = (cle, defaut = null) => {
  try { const v = localStorage.getItem(K + cle); return v === null ? defaut : JSON.parse(v); } catch { return defaut; }
};
export const ecrire = (cle, val) => { try { localStorage.setItem(K + cle, JSON.stringify(val)); } catch { /* ignoré */ } };
export const utilisateur = () => lire('user');
export const estConnecte = () => !!utilisateur();
export const connecter = (nom, email) => ecrire('user', { nom, email });
export const deconnecter = () => { try { localStorage.removeItem(K + 'user'); } catch { /* ignoré */ } };
__F__

# -------------------------------------------------------- src/lib/ui.js
ecrire "$R/src/lib/ui.js" <<'__F__'
const MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => MAP[c]);

// Petit message à la place des alert()
export function toast(msg, type = 'ok') {
  let zone = document.querySelector('.toasts');
  if (!zone) { zone = document.createElement('div'); zone.className = 'toasts'; document.body.append(zone); }
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  zone.append(t);
  setTimeout(() => t.remove(), 3000);
}
__F__

# ----------------------------------------------------- src/lib/navbar.js
ecrire "$R/src/lib/navbar.js" <<'__F__'
import { routes } from '../routes.js';
import { estConnecte, utilisateur } from './store.js';
import { esc } from './ui.js';

const nav = document.querySelector('#nav');

export function majNavbar(actif = '') {
  const co = estConnecte();
  const liens = Object.entries(routes)
    .filter(([, r]) => r.nav && (!r.prive || co))
    .map(([p, r]) => `<a href="#${p}" class="${p === actif ? 'actif' : ''}">${r.titre}</a>`).join('');
  const auth = co
    ? `<span class="salut">${esc(utilisateur().nom)}</span><button class="btn ghost" data-act="logout">Déconnexion</button>`
    : `<a class="btn ghost" href="#/connexion">Se connecter</a><a class="btn" href="#/inscription">S'inscrire</a>`;
  const ouvert = nav.classList.contains('ouvert');
  nav.innerHTML = `<div class="nav-in">
    <a class="brand" href="#/">🌱 AgriSemence</a>
    <button class="btn ghost burger" data-act="burger" aria-label="Menu">☰</button>
    <div class="panneau"><nav class="liens">${liens}</nav>
      <div class="auth">${auth}<button class="btn ghost" data-act="theme" aria-label="Changer de thème">◐</button></div></div>
  </div>`;
  nav.classList.toggle('ouvert', ouvert);
}
__F__

# -------------------------------------------------- src/lib/collection.js
# (ex pages AgriSemence : interfaceAjouterPaysan / Stocks / Distributions / Suivie)
ecrire "$R/src/lib/collection.js" <<'__F__'
import { lire, ecrire } from './store.js';
import { esc, toast } from './ui.js';
import { rafraichir } from '../controller/router.js';

let cache;
export async function donnees() {
  if (cache) return cache;
  let base = {};
  try { base = await (await fetch('./data.json')).json(); } catch { base = {}; }
  const ajouts = lire('ajouts', {});
  cache = { ...base };
  for (const k in ajouts) cache[k] = [...(cache[k] || []), ...ajouts[k]];
  return cache;
}

// Fabrique une page "formulaire d'ajout + tableau" pour une collection de data.json
export function pageCollection({ cle, titre, intro, champs }) {
  const vue = async () => {
    const lignes = (await donnees())[cle] || [];
    const corps = lignes.map((l) => `<tr>${champs.map((c) => `<td>${esc(l[c.nom])}</td>`).join('')}</tr>`).join('')
      || `<tr><td colspan="${champs.length}">Aucune donnée</td></tr>`;
    return `<section>
      <h1>${titre}</h1><p class="muted">${intro}</p>
      <form id="f-${cle}" class="carte form-inline" novalidate>
        ${champs.map((c) => `<label>${c.label}<input name="${c.nom}" type="${c.type || 'text'}"></label>`).join('')}
        <button class="btn">Ajouter</button>
      </form>
      <div class="table-wrap"><table><thead><tr>${champs.map((c) => `<th>${c.label}</th>`).join('')}</tr></thead>
      <tbody>${corps}</tbody></table></div></section>`;
  };
  vue.afterRender = () => {
    const f = document.querySelector(`#f-${cle}`);
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const o = Object.fromEntries(new FormData(f));
      if (Object.values(o).some((v) => !String(v).trim())) return toast('Tous les champs sont requis', 'err');
      const d = await donnees();
      (d[cle] ||= []).push(o);
      const a = lire('ajouts', {});
      (a[cle] ||= []).push(o);
      ecrire('ajouts', a);
      toast('Ajouté ✔');
      rafraichir();
    });
  };
  return vue;
}
__F__

# ------------------------------------------------------------------ vues
ecrire "$R/src/views/Accueil.js" <<'__F__'
import { navigate } from '../controller/router.js';

const Accueil = () => `
  <section class="hero">
    <h1>Des semences, <span class="grad">au bon moment</span>, pour chaque paysan.</h1>
    <p class="muted">Gérez paysans, stocks, distributions et suivi de parcelles au même endroit.</p>
    <p><button class="btn" id="btn-inscription">Aller à Inscription</button>
       <a class="btn ghost" href="#/solution">Voir la solution</a></p>
  </section>
  <div class="grille">
    <article class="carte"><h3>👩‍🌾 Paysans</h3><p class="muted">Un registre simple et à jour.</p></article>
    <article class="carte"><h3>📦 Stocks</h3><p class="muted">Sachez ce qu'il reste, où.</p></article>
    <article class="carte"><h3>🚚 Distributions</h3><p class="muted">Tracez chaque remise de semences.</p></article>
  </div>`;

Accueil.afterRender = () => {
  document.querySelector('#btn-inscription').addEventListener('click', () => navigate('/inscription'));
};

export default Accueil;
__F__

ecrire "$R/src/views/Menu.js" <<'__F__'
import { routes } from '../routes.js';
import { estConnecte } from '../lib/store.js';

const Menu = () => `
  <section><h1>Menu</h1>
  <div class="grille">${Object.entries(routes).filter(([p]) => p !== '/').map(([p, r]) => `
    <a class="carte lien" href="#${p}"><h3>${r.titre}${r.prive && !estConnecte() ? ' 🔒' : ''}</h3>
    <p class="muted">${r.desc || ''}</p></a>`).join('')}</div></section>`;

export default Menu;
__F__

ecrire "$R/src/views/Solution.js" <<'__F__'
const Solution = () => `
  <section><h1>Notre solution</h1>
  <div class="grille">
    <article class="carte"><h3>1. Recenser</h3><p class="muted">Chaque paysan est enregistré avec son village et sa culture.</p></article>
    <article class="carte"><h3>2. Distribuer</h3><p class="muted">Les semences sorties du stock sont liées à un paysan et à une date.</p></article>
    <article class="carte"><h3>3. Suivre</h3><p class="muted">L'état des parcelles est noté pour mesurer l'effet des semences.</p></article>
  </div></section>`;

export default Solution;
__F__

ecrire "$R/src/views/Apropos.js" <<'__F__'
const Apropos = () => `
  <section><h1>À propos</h1>
  <div class="carte"><p>AgriSemence est une application web monopage écrite en JavaScript pur :
  sans framework, sans dépendance, avec un routeur par hash.</p>
  <p class="muted">Elle sert de base pour apprendre, tester et étendre rapidement.</p></div></section>`;

export default Apropos;
__F__

ecrire "$R/src/views/Connexion.js" <<'__F__'
import { navigate } from '../controller/router.js';
import { connecter } from '../lib/store.js';
import { toast } from '../lib/ui.js';

const Connexion = () => `
  <section><h1>Connexion</h1>
  <form id="f-connexion" class="carte form" novalidate>
    <label>Email<input name="email" type="email" autocomplete="email"></label>
    <label>Mot de passe<input name="mdp" type="password" autocomplete="current-password"></label>
    <button class="btn">Se connecter</button>
    <p class="muted">Démo : n'importe quel email valide et 4 caractères minimum.</p>
    <a href="#/">Retour à l'Accueil</a>
  </form></section>`;

Connexion.afterRender = () => {
  const f = document.querySelector('#f-connexion');
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const { email, mdp } = Object.fromEntries(new FormData(f));
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast('Email invalide', 'err');
    if (mdp.length < 4) return toast('Mot de passe trop court', 'err');
    connecter(email.split('@')[0], email);
    toast('Connecté ✔');
    const retour = sessionStorage.getItem('retour') || '/espace';
    sessionStorage.removeItem('retour');
    navigate(retour);
  });
};

export default Connexion;
__F__

ecrire "$R/src/views/Inscription.js" <<'__F__'
import { navigate } from '../controller/router.js';
import { connecter } from '../lib/store.js';
import { toast } from '../lib/ui.js';

const Inscription = () => `
  <section><h1>Inscription</h1>
  <form id="f-inscription" class="carte form" novalidate>
    <label>Nom<input name="nom" type="text" autocomplete="name"></label>
    <label>Email<input name="email" type="email" autocomplete="email"></label>
    <label>Mot de passe<input name="mdp" type="password" autocomplete="new-password"></label>
    <button class="btn">S'inscrire</button>
    <button type="button" class="btn ghost" id="btn-connexion">Aller à Connexion</button>
  </form></section>`;

Inscription.afterRender = () => {
  document.querySelector('#btn-connexion').addEventListener('click', () => navigate('/connexion'));
  const f = document.querySelector('#f-inscription');
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const { nom, email, mdp } = Object.fromEntries(new FormData(f));
    if (nom.trim().length < 2) return toast('Nom trop court', 'err');
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast('Email invalide', 'err');
    if (mdp.length < 6) return toast('Mot de passe : 6 caractères minimum', 'err');
    connecter(nom.trim(), email);
    toast('Compte créé ✔');
    navigate('/espace');
  });
};

export default Inscription;
__F__

ecrire "$R/src/views/Espace.js" <<'__F__'
import { utilisateur } from '../lib/store.js';
import { donnees } from '../lib/collection.js';
import { esc } from '../lib/ui.js';

const BLOCS = [['paysans', 'Paysans', '/paysans'], ['stocks', 'Stocks', '/stocks'],
               ['distributions', 'Distributions', '/distributions'], ['suivis', 'Suivi', '/suivi']];

const Espace = async () => {
  const d = await donnees();
  return `<section><h1>Bonjour ${esc(utilisateur().nom)} 👋</h1>
    <p class="muted">Votre tableau de bord.</p>
    <div class="grille">${BLOCS.map(([k, t, l]) => `
      <a class="carte lien stat" href="#${l}"><strong>${(d[k] || []).length}</strong><span>${t}</span></a>`).join('')}
    </div></section>`;
};

export default Espace;
__F__

ecrire "$R/src/views/Paysans.js" <<'__F__'
import { pageCollection } from '../lib/collection.js';

export default pageCollection({
  cle: 'paysans', titre: 'Paysans', intro: 'Ajoutez un paysan au registre.',
  champs: [{ nom: 'nom', label: 'Nom' }, { nom: 'village', label: 'Village' }, { nom: 'culture', label: 'Culture' }],
});
__F__

ecrire "$R/src/views/Stocks.js" <<'__F__'
import { pageCollection } from '../lib/collection.js';

export default pageCollection({
  cle: 'stocks', titre: 'Stocks', intro: 'Semences disponibles par entrepôt.',
  champs: [{ nom: 'semence', label: 'Semence' }, { nom: 'quantite', label: 'Quantité' }, { nom: 'entrepot', label: 'Entrepôt' }],
});
__F__

ecrire "$R/src/views/Distributions.js" <<'__F__'
import { pageCollection } from '../lib/collection.js';

export default pageCollection({
  cle: 'distributions', titre: 'Distributions', intro: 'Enregistrez chaque remise de semences.',
  champs: [{ nom: 'paysan', label: 'Paysan' }, { nom: 'semence', label: 'Semence' },
           { nom: 'quantite', label: 'Quantité' }, { nom: 'date', label: 'Date', type: 'date' }],
});
__F__

ecrire "$R/src/views/Suivi.js" <<'__F__'
import { pageCollection } from '../lib/collection.js';

export default pageCollection({
  cle: 'suivis', titre: 'Suivi', intro: "Notez l'état des parcelles.",
  champs: [{ nom: 'paysan', label: 'Paysan' }, { nom: 'parcelle', label: 'Parcelle' },
           { nom: 'etat', label: 'État' }, { nom: 'date', label: 'Date', type: 'date' }],
});
__F__

ecrire "$R/src/views/NotFound.js" <<'__F__'
const NotFound = () => `
  <section class="carte erreur" id="NotFound">
    <h1>Page introuvable (404)</h1>
    <p class="muted">Cette page n'existe pas.</p>
    <a class="btn" href="#/">Retour à l'accueil</a>
  </section>`;

export default NotFound;
__F__

# --------------------------------------------------------------- thème CSS
ecrire "$R/src/styles/theme.css" <<'__F__'
/* Toutes les couleurs sont des variables : modifiez-les ici. */
:root{--bg:#fff7f3;--surface:#fff;--text:#2a1a22;--muted:#7a6670;--rose:#e11d74;--orange:#f97316;
  --grad:linear-gradient(135deg,var(--rose),var(--orange));--bord:#f0dcd6;--ombre:0 8px 24px rgba(225,29,116,.12);
  --r:16px;--navh:64px;--titre:'Bricolage Grotesque',system-ui,sans-serif;--corps:'Figtree',system-ui,sans-serif}
[data-theme=dark]{--bg:#150e12;--surface:#211820;--text:#f6e9ee;--muted:#b49aa6;--bord:#37262f;--ombre:0 8px 24px rgba(0,0,0,.4)}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.6 var(--corps);padding-top:var(--navh)}
h1,h2,h3{font-family:var(--titre);line-height:1.15;margin:0 0 .5em}
a{color:var(--rose)}
.muted{color:var(--muted)}
.grad{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
#app{max-width:1100px;margin:auto;padding:2rem 1rem}
.chargement{text-align:center;color:var(--muted)}

#nav{position:fixed;inset:0 0 auto;height:var(--navh);z-index:10;background:color-mix(in srgb,var(--surface) 90%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--bord)}
.nav-in{max-width:1100px;margin:auto;height:100%;display:flex;align-items:center;gap:1rem;padding:0 1rem}
.brand{font:700 1.3rem var(--titre);text-decoration:none;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
.panneau{display:flex;flex:1;align-items:center;gap:1rem}
.liens{display:flex;gap:.25rem;flex:1;flex-wrap:wrap}
.liens a{padding:.35rem .8rem;border-radius:99px;text-decoration:none;color:var(--text)}
.liens a:hover,.liens a.actif{background:var(--bord)}
.auth{display:flex;gap:.5rem;align-items:center}
.salut{color:var(--muted)}
.burger{display:none;margin-left:auto}

.btn{display:inline-block;border:0;cursor:pointer;font:600 1rem var(--corps);padding:.6rem 1.1rem;border-radius:99px;color:#fff;background:var(--grad);text-decoration:none}
.btn:hover{filter:brightness(1.08)}
.btn.ghost{background:transparent;color:var(--text);border:1px solid var(--bord)}

.carte{background:var(--surface);border:1px solid var(--bord);border-radius:var(--r);padding:1.25rem;box-shadow:var(--ombre)}
.lien{text-decoration:none;color:inherit;transition:transform .15s}
.lien:hover{transform:translateY(-3px)}
.grille{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem}
.hero{text-align:center;padding:3rem 0}
.hero h1{font-size:clamp(2rem,6vw,3.6rem);max-width:18ch;margin:0 auto .4em}
.stat strong{display:block;font:700 2.4rem var(--titre)}
.erreur{text-align:center}

label{display:grid;gap:.3rem;font-weight:600}
input{font:inherit;padding:.6rem .8rem;border-radius:10px;border:1px solid var(--bord);background:var(--bg);color:var(--text)}
input:focus{outline:2px solid var(--rose);outline-offset:1px}
.form{max-width:420px;margin:auto;display:grid;gap:1rem}
.form-inline{display:flex;flex-wrap:wrap;gap:1rem;align-items:end;margin-bottom:1.5rem}
.table-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;background:var(--surface);border-radius:var(--r);overflow:hidden}
th,td{padding:.7rem 1rem;text-align:left;border-bottom:1px solid var(--bord)}
th{background:var(--bord)}

.toasts{position:fixed;right:1rem;bottom:1rem;display:grid;gap:.5rem;z-index:20}
.toast{padding:.7rem 1rem;border-radius:12px;color:#fff;background:#16a34a;box-shadow:var(--ombre)}
.toast.err{background:#dc2626}

@media(max-width:760px){
  .burger{display:block}
  .panneau{display:none}
  #nav.ouvert .panneau{display:flex;flex-direction:column;align-items:stretch;position:absolute;top:var(--navh);left:0;right:0;background:var(--surface);padding:1rem;border-bottom:1px solid var(--bord)}
  #nav.ouvert .liens{flex-direction:column}
}
__F__

# ------------------------------------------------------------------ README
ecrire "$R/README.md" <<'__F__'
# AgriSemence : SPA en JavaScript pur (sans framework)

    ./creer-spa.sh serve        # ou : python3 -m http.server 5173
    → http://localhost:5173

Les modules JS sont bloqués en `file://` : il faut un petit serveur local.

## Ajouter une page
    ./creer-spa.sh page MaPage
Crée `src/views/MaPage.js` et ajoute la route dans `src/routes.js`
(navbar et page Menu se mettent à jour seules).

## Correspondance anciens fichiers → projet
| Ancien                                   | Maintenant                                         |
|------------------------------------------|----------------------------------------------------|
| script-project.sh (index, router, vues)  | `./creer-spa.sh <nom>`                             |
| script.sh (une page)                     | `./creer-spa.sh page <Nom>`                        |
| Breukh/controller/router.js              | `src/controller/router.js`                         |
| Breukh/views/*.js                        | `src/views/*.js` (+ NotFound)                      |
| hooks `apresPage` / `afterRender`        | `afterRender` uniquement                           |
| create.sh : welcome/login/register       | Accueil / Connexion / Inscription                  |
| create.sh : dashboard                    | `Espace` (page protégée)                           |
| create.sh : AjouterPaysan/Stocks/Distrib/Suivi | `Paysans`, `Stocks`, `Distributions`, `Suivi` |
| create.sh : data.json, images/, toastify | `data.json`, `public/images/`, `lib/ui.js` (toast) |
| acteur.json (posts/comments/profile)     | clés de `data.json`                                |
| tableau `routes`                         | `src/routes.js` (source unique)                    |
__F__

# Le script lui-même est copié dans le projet : un seul fichier, partout.
cp -- "$0" "$R/creer-spa.sh" 2>/dev/null && chmod +x "$R/creer-spa.sh" || true

echo "✔ Projet '$R' créé."
echo "  cd $R && ./creer-spa.sh serve   → http://localhost:5173"
