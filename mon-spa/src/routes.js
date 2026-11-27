// =============================================================================
// routes.js : la TABLE DES ROUTES (chemin → page). Source unique de vérité :
// le routeur, la navbar et la page Menu la lisent toutes.
//
//   page    : nom du dossier ET du fichier dans src/pages/<page>/<page>.js
//   title   : titre de l'onglet et libellé dans les menus
//   nav     : true → le lien apparaît dans la barre de navigation
//   private : true → réservé aux utilisateurs connectés (garde de route)
//   icon    : nom d'une icône de components/icons.js
//   desc    : description affichée sur la page Menu
//
// Ajouter une page = créer son fichier + ajouter UNE ligne ici.
// =============================================================================
export const routes = {
  '/':         { page: 'Home',     title: 'Accueil',     icon: 'home',     nav: true,
                 desc: "La page d'introduction : présentation et accès rapide à la connexion." },
  '/menu':     { page: 'Menu',     title: 'Menu',        icon: 'compass',  nav: true,
                 desc: "Le plan de l'application, généré à partir de la table des routes." },
  '/solution': { page: 'Solution', title: 'Solution',    icon: 'code',     nav: true,
                 desc: 'Comment fonctionne le routeur, étape par étape, avec le code.' },
  '/apropos':  { page: 'Apropos',  title: 'À propos',    icon: 'info',     nav: true,
                 desc: 'Le projet, les concepts réunis et la structure des fichiers.' },
  '/login':    { page: 'Login',    title: 'Connexion',   icon: 'user',
                 desc: 'Formulaire de connexion de démonstration (sans vraie authentification).' },
  '/register': { page: 'Register', title: 'Inscription', icon: 'userPlus',
                 desc: 'Créez un compte de démonstration en quelques secondes.' },
  '/espace':   { page: 'Espace',   title: 'Mon espace',  icon: 'lock',     private: true,
                 desc: 'Page protégée : accessible seulement une fois connecté.' },
};
