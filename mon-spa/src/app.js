// =============================================================================
// app.js : point d'entrée. On démarre chaque brique dans le bon ordre.
// =============================================================================
import { initTheme } from './theme.js';
import { mountNavbar } from './components/navbar.js';
import { mountFooter } from './components/footer.js';
import { initRouter } from './router.js';

initTheme();     // 1. thème clair / sombre
mountNavbar();   // 2. barre de navigation (elle écoute les événements du routeur)
mountFooter();   // 3. pied de page
initRouter();    // 4. routeur en dernier : il affiche la première page

// Lien « Aller au contenu » : avec un routeur par hash, un href="#app" serait
// pris pour une route (/app → 404). On le gère donc à la main.
document.querySelector('.skip-link')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('app').focus();
});
