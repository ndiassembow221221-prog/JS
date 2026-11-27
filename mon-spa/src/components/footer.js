// =============================================================================
// footer.js : pied de page, injecté dans <footer id="footer"> (index.html).
// =============================================================================
import { APP_NAME } from '../config.js';

export function mountFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="container footer__inner">
      <p>© ${new Date().getFullYear()} ${APP_NAME} · Fait en JavaScript pur, sans framework.</p>
      <nav class="footer__links" aria-label="Pied de page">
        <a href="#/solution">Comment ça marche</a>
        <a href="#/menu">Plan</a>
        <a href="#/apropos">À propos</a>
      </nav>
    </div>`;
}
