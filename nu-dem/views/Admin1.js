import { sidebar, brancherSidebar } from '../lib/sidebar.js';
import { passagers, conducteurs, trajets, reservations, vehicules, avis, admins } from '../models/api.js';
import { esc, fcfa, quand, toast } from '../lib/ui.js';

// Tableau de bord administrateur (maquette docs/maquettes/A1.png)
let D = {};
const COLS = {
  passagers:   [['nom', 'Nom'], ['email', 'Email'], ['telephone', 'Téléphone'], ['ville', 'Ville']],
  conducteurs: [['nom', 'Nom'], ['email', 'Email'], ['telephone', 'Téléphone'], ['lieu', 'Lieu'], ['ancienete', 'Ancienneté (ans)']],
  trajets:     [['depart', 'Départ'], ['arrivee', 'Arrivée'], ['date', 'Date', quand], ['prix', 'Prix', fcfa], ['statut', 'État']],
};
let onglet = 'trajets';

const table = () => `<div class="table-wrap"><table class="table-admin"><thead><tr>${COLS[onglet].map(([, l]) => `<th>${l}</th>`).join('')}<th></th></tr></thead>
  <tbody>${D[onglet].map((r) => `<tr>${COLS[onglet].map(([k, , f]) => `<td>${esc(f ? f(r[k]) : r[k])}</td>`).join('')}
  <td><button class="action-icon delete" data-suppr="${r.id}" title="Supprimer"><i class="fa-solid fa-trash"></i></button></td></tr>`).join('')
  || `<tr><td colspan="9" class="vide">Aucune donnée</td></tr>`}</tbody></table></div>`;

const Admin1 = async () => {
  const noms = ['passagers', 'conducteurs', 'trajets', 'reservations', 'vehicules', 'avis', 'admins'];
  const svc = { passagers, conducteurs, trajets, reservations, vehicules, avis, admins };
  const res = await Promise.all(noms.map((n) => svc[n].obtenirTous()));
  D = Object.fromEntries(noms.map((n, i) => [n, res[i]]));
  const prix = (r) => (D.trajets.find((t) => String(t.id) === String(r.idTrajet))?.prix || 0) * r.places;
  const ca = D.reservations.filter((r) => ['acceptee', 'terminee'].includes(r.statut)).reduce((s, r) => s + prix(r), 0);
  onglet = 'trajets';
  const carte = (l, v, cls = '') => `<div class="stat-card ${cls}"><span>${l}</span><strong>${v}</strong></div>`;
  return `<div id="Admin1">
    ${sidebar('/Admin1')}
    <div id="corps">
      <h2>Administration</h2><p>Gérez la plateforme et les utilisateurs.</p>
      <div class="stats-admin">
        ${carte('Passagers', D.passagers.length)}${carte('Conducteurs', D.conducteurs.length)}${carte('Trajets', D.trajets.length)}
        ${carte('Réservations', D.reservations.length)}${carte("Chiffre d'affaires", fcfa(ca), 'ca')}
      </div>
      <div class="onglets">${Object.keys(COLS).map((k) => `<button data-onglet="${k}" class="${k === onglet ? 'actif' : ''}">${k[0].toUpperCase() + k.slice(1)}</button>`).join('')}</div>
      <div id="zone-table">${table()}</div>
      <button class="btn-export" id="export"><i class="fa-solid fa-download"></i> Exporter les données (JSON)</button>
    </div></div>`;
};

Admin1.afterRender = () => {
  brancherSidebar();
  const zone = document.querySelector('#zone-table');
  document.querySelectorAll('[data-onglet]').forEach((b) => b.addEventListener('click', () => {
    onglet = b.dataset.onglet;
    document.querySelectorAll('[data-onglet]').forEach((x) => x.classList.toggle('actif', x === b));
    zone.innerHTML = table();
  }));
  zone.addEventListener('click', async (e) => {
    const id = e.target.closest('[data-suppr]')?.dataset.suppr;
    if (!id || !confirm('Supprimer cet élément ?')) return;
    const svc = { passagers, conducteurs, trajets }[onglet];
    try { await svc.supprimer(id); D[onglet] = D[onglet].filter((r) => String(r.id) !== id); zone.innerHTML = table(); toast('Supprimé'); }
    catch { toast('Suppression impossible', 'err'); }
  });
  // Export de la base (ex fonction exporterJSON de l'ancien script.js)
  document.querySelector('#export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(D, null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'db.json' });
    a.click(); URL.revokeObjectURL(a.href);
  });
};

export default Admin1;
