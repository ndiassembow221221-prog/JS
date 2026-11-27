import { session } from '../models/session.js';
import { navigate } from '../controller/router.js';
import { esc, toast } from './ui.js';

const MENUS = {
  passager:   [['/Passager1', 'fa-magnifying-glass', 'Réservation'], ['/Passager2', 'fa-user-gear', 'Profil']],
  conducteur: [['/Conducteur1', 'fa-road', 'Gestion des trajets'], ['/Conducteur2', 'fa-bus', 'Véhicules'], ['/Conducteur3', 'fa-user', 'Profil']],
  admin:      [['/Admin1', 'fa-chart-line', 'Tableau de bord']],
};
const TITRES = { passager: 'Passager', conducteur: 'Conducteur', admin: 'Admin' };

export const sidebar = (actif) => {
  const { type, data: u } = session.user;
  return `<nav id="sidBar">
    <div id="haut">
      <div class="profilUser"><div>${TITRES[type]}</div><div>Nu Dem</div></div>
      <div class="voy"><i class="fa-solid fa-user"></i>
        <div><div>${esc(u.nom)}</div><div>${esc(u.ville || u.lieu || 'Sénégal')}</div></div></div>
      ${MENUS[type].map(([l, i, t]) => `<div class="reservation ${l === actif ? 'actif' : ''}" data-nav="${l}"><i class="fa-solid ${i}"></i><div>${t}</div></div>`).join('')}
    </div>
    <div id="bas"><hr><div id="dec"><i class="fa-solid fa-right-from-bracket"></i> Déconnexion</div></div>
  </nav>`;
};

// À appeler dans afterRender de chaque page connectée
export const brancherSidebar = () => {
  document.querySelectorAll('[data-nav]').forEach((el) => el.addEventListener('click', () => navigate(el.dataset.nav)));
  document.querySelector('#dec')?.addEventListener('click', () => { session.fermer(); toast('Déconnecté'); navigate('/Connexion'); });
};
