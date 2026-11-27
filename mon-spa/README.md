# Mon SPA

Une application **SPA complète en JavaScript pur** : pas de framework, pas de bundler, zéro dépendance.
Elle fusionne les deux anciens projets (`z_apprendreSPA` et `z_mon-projet-spa`) sans perdre aucun concept.

## Lancer le projet

Les modules JavaScript (`import` / `export`) sont bloqués quand on ouvre `index.html` directement
(`file://`). Il faut un petit serveur local, au choix :

```bash
python3 -m http.server 5173      # puis http://localhost:5173
# ou
npx serve .
# ou l'extension « Live Server » de VS Code
```

## Structure

```
mon-spa/
├── index.html              point d'entrée (nav, #app, footer, toasts)
├── public/images/          logo.svg, favicon.svg
└── src/
    ├── app.js              démarre tout
    ├── config.js           nom de l'application
    ├── routes.js           table des routes (chemin → page)
    ├── router.js           hashchange, import(), navigate(), garde, 404, erreurs
    ├── session.js          connexion de démo (localStorage)
    ├── theme.js            thème clair / sombre
    ├── utils.js            escapeHtml, validation de champs
    ├── components/         navbar, footer, toast, icons
    ├── pages/              Home, Menu, Solution, Apropos, Login, Register, Espace, NotFound
    └── styles/             theme (variables) → base → components → pages
```

## Ajouter une page en 2 étapes

1. Créer `src/pages/Contact/Contact.js` :

```js
import { navigate } from '../../router.js';

const Contact = () => `
  <div class="page">
    <h1>Contact</h1>
    <button class="btn btn--primary" id="back">Retour</button>
  </div>
`;

Contact.afterRender = () => {
  document.getElementById('back').addEventListener('click', () => navigate('/'));
};

export default Contact;
```

2. Ajouter une ligne dans `src/routes.js` :

```js
'/contact': { page: 'Contact', title: 'Contact', icon: 'info', nav: true, desc: 'Nous écrire.' },
```

Le lien apparaît dans la barre de navigation et sur la page Menu. Mettre `private: true` pour réserver la page aux utilisateurs connectés.

## Où sont passés les concepts des anciens projets ?

| Ancien projet | Dans ce projet |
|---|---|
| Table `'/' : 'page1'` / `'/': 'Intro'` | `routes.js` |
| `affiche()` / `render()` + `import()` dynamique | `router.js` |
| `apresPage` / `afterRender` (même idée, deux noms) | un seul nom : `afterRender` |
| `navigate()` | `router.js` |
| `obtenirnouvHash()` / `handleHashChange()` | `getPath()` / `handleHashChange()` |
| `initialize()` / `initRouter()` | `initRouter()` |
| `page1` + `Intro` | `pages/Home` |
| `page2` (atteinte par « Se connecter ») | « Se connecter » → `Login` → `Espace` |
| Nav : Accueil, Menue, Solution, Appros | navbar : Accueil, Menu, Solution, À propos |
| Bouton « S'inscrire » (sans cible) | `pages/Register` |
| `Login` de démo (nom + alert + retour) | `pages/Login` (toast à la place de `alert`) |
| `NotFound` | `pages/NotFound` |
| « Erreur technique » | `router.js` (`catch`, avec bouton Réessayer) |
| « Chargement... » | `index.html` |
| Dossier `public/images` | `public/images` |

## Ajouts par rapport aux deux projets

Garde de route (`private: true`), session de démo, thème clair/sombre, navigation mobile,
toasts, validation de formulaires, échappement du HTML saisi (`escapeHtml`), titre d'onglet par page,
protection contre les navigations rapides, gestion du focus pour l'accessibilité.

## Personnaliser

- **Couleurs, polices, arrondis** : `src/styles/theme.css` (variables, thèmes clair et sombre).
- **Nom de l'application** : `src/config.js`.
- **Logo** : `public/images/logo.svg`.

## Mettre en ligne

Le routage par hash ne demande aucune configuration serveur : déposez le dossier tel quel
sur n'importe quel hébergement statique (GitHub Pages, Netlify, Nginx...).
