import { sidebar, brancherSidebar } from '../lib/sidebar.js';
import { rafraichir } from '../controller/router.js';
import { session } from '../models/session.js';
import { trajets, reservations, passagers, conducteurs, vehicules } from '../models/api.js';
import { esc, fcfa, quand, toast, retirerLigne } from '../lib/ui.js';

const BADGES = { programme: ['badge-programme', 'Programmé'], 'en cours': ['badge-encours', 'En cours'], termine: ['badge', 'Terminé'] };
const SUIVANT = { programme: 'en cours', 'en cours': 'termine' };
let T = [];

const Conducteur1 = async () => {
  const u = session.user.data;
  const [tr, res, pas] = await Promise.all([trajets.obtenirTous(`idConducteur=${u.id}`), reservations.obtenirTous(), passagers.obtenirTous()]);
  T = tr;
  const ids = tr.map((t) => String(t.id));
  const actifs = tr.filter((t) => t.statut !== 'termine');
  const finis = tr.filter((t) => t.statut === 'termine');
  const demandes = res.filter((r) => r.statut === 'en attente' && ids.includes(String(r.idTrajet)));
  const places = (t) => t.places - res.filter((r) => String(r.idTrajet) === String(t.id) && ['en attente', 'acceptee'].includes(r.statut)).reduce((s, r) => s + r.places, 0);

  return `<div id="Conducteur1">
  ${sidebar('/Conducteur1')}
  <div id="corps">
    <div id="titre"><div>Trajets</div>
      <div class="search-bar"><i class="fa-solid fa-magnifying-glass"></i><input type="text" id="filtre" placeholder="Rechercher un trajet..."></div>
      <img src="public/images/logo.svg" alt="Logo" id="log"></div>
    <div class="section-intro"><h2>Gestion des trajets</h2><p>Organisez vos itinéraires et gérez vos passagers en temps réel.</p>
      <form class="form-publier" id="f-publier">
        <label>Départ<input name="depart" required></label><label>Arrivée<input name="arrivee" required></label>
        <label>Date<input name="date" type="datetime-local" required></label>
        <label>Prix (FCFA)<input name="prix" type="number" min="0" required></label>
        <label>Places<input name="places" type="number" min="1" required></label>
        <button class="btn btn-primary">Publier un trajet</button></form></div>
    <div class="corps-grid">
      <div class="col-left">
        <div class="trajets-card">
          <div class="trajets-card-header"><div class="section-title">Trajets programmés</div><div class="voir-tout">${actifs.length} au total</div></div>
          <table class="trajets-table"><thead><tr><th>Itinéraire</th><th>Places</th><th>État</th><th>Actions</th></tr></thead>
          <tbody id="corps-trajets">${actifs.map((t) => `<tr data-id="${t.id}">
            <td><span class="itineraire-nom">${esc(t.depart)} ➜ ${esc(t.arrivee)}</span><div class="itineraire-date">${quand(t.date)}</div></td>
            <td>${places(t)} libres</td>
            <td><span class="badge ${BADGES[t.statut][0]}">${BADGES[t.statut][1]}</span></td>
            <td><button class="action-icon" data-avance="${t.id}" title="Passer à l'état suivant"><i class="fa-solid fa-pen"></i></button>
                <button class="action-icon delete" data-suppr="${t.id}"><i class="fa-solid fa-trash"></i></button></td></tr>`).join('')
            || '<tr><td colspan="4" class="vide">Aucun trajet programmé</td></tr>'}</tbody></table>
        </div>
        <div class="historique-card"><div class="section-title" style="margin-bottom:12px">Historique des trajets</div>
          ${finis.map((t) => `<div class="historique-item"><div class="hist-left"><div class="hist-icon"><i class="fa-solid fa-route"></i></div>
            <div><div class="hist-trajet">${esc(t.depart)} ➜ ${esc(t.arrivee)}</div><div class="hist-meta">${quand(t.date)}</div></div></div>
            <div class="hist-prix">${fcfa(t.prix)}</div></div>`).join('') || '<p class="vide">Aucun trajet terminé</p>'}
        </div>
        <div class="demandes-card"><div class="demandes-header"><div class="section-title">Liste des demandes</div><div class="trajet-badge">${demandes.length} en attente</div></div>
          <table class="demandes-table"><thead><tr><th>Passager</th><th>Trajet</th><th>Places</th><th>Actions</th></tr></thead><tbody>
          ${demandes.map((r) => { const p = pas.find((x) => String(x.id) === String(r.idPassager)); const t = tr.find((x) => String(x.id) === String(r.idTrajet));
            return `<tr data-res="${r.id}"><td><div class="trajet-detail"><div class="passager-avatar" style="background:#9fb5e8">${esc((p?.nom || '?').slice(0, 2).toUpperCase())}</div>
              <div><div class="passager-nom">${esc(p?.nom)}</div><div class="passager-id">ID : ${esc(r.idPassager)}</div></div></div></td>
              <td><div class="trajet-nom">${esc(t.depart)} ➜ ${esc(t.arrivee)}</div><div class="trajet-heure">${quand(t.date)}</div></td><td>${r.places}</td>
              <td><button class="btn-action btn-accept" data-rep="acceptee"><i class="fa-solid fa-check"></i></button>
                  <button class="btn-action btn-refuse" data-rep="refusee"><i class="fa-solid fa-xmark"></i></button></td></tr>`; }).join('')
            || '<tr><td colspan="4" class="vide">Aucune demande</td></tr>'}</tbody></table>
        </div>
      </div>
      <div class="col-right">
        <div class="gps-card"><div class="gps-map"><div class="gps-badge"><span class="dot-gps"></span> Suivi GPS Actif</div></div>
          <div class="gps-info"><div class="gps-info-label">Prochain départ</div><div class="gps-info-row">
            <div class="gps-lieu">${esc(actifs[0] ? actifs[0].depart : 'Aucun départ')}</div><div class="gps-temps">${actifs[0] ? quand(actifs[0].date) : '—'}</div></div></div></div>
        <div class="statut-card"><div class="statut-header"><div class="statut-label">Statut en direct <span class="dot-online"></span></div></div>
          <div class="toggle-wrap"><span class="toggle-label">Partage de localisation</span>
            <label class="toggle"><input type="checkbox" id="loc" ${u.localisation ? 'checked' : ''}><span class="slider"></span></label></div></div>
      </div>
    </div>
  </div></div>`;
};

Conducteur1.afterRender = () => {
  brancherSidebar();
  const u = session.user.data;
  const racine = document.querySelector('#Conducteur1');

  document.querySelector('#filtre').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('#corps-trajets tr[data-id]').forEach((tr) => { tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none'; });
  });

  document.querySelector('#loc').addEventListener('change', async (e) => {
    try { await conducteurs.modifier(u.id, { localisation: e.target.checked }); session.maj({ localisation: e.target.checked }); }
    catch { toast('Mise à jour impossible', 'err'); e.target.checked = !e.target.checked; }
  });

  document.querySelector('#f-publier').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    try {
      await trajets.ajouter({ idConducteur: u.id, depart: f.depart.trim(), arrivee: f.arrivee.trim(), date: f.date, prix: Number(f.prix), places: Number(f.places), statut: 'programme' });
      toast('Trajet publié ✔'); rafraichir();
    } catch { toast('Publication impossible', 'err'); }
  });

  racine.addEventListener('click', async (e) => {
    const b = e.target.closest('button'); if (!b) return;
    try {
      if (b.dataset.rep) {                                           // accepter / refuser (ANIM-19)
        const ligne = b.closest('tr');
        await reservations.modifier(ligne.dataset.res, { statut: b.dataset.rep });
        retirerLigne(ligne, b.dataset.rep === 'refusee');
        toast(b.dataset.rep === 'acceptee' ? 'Demande acceptée ✔' : 'Demande refusée');
      } else if (b.dataset.avance) {                                 // programmé → en cours → terminé
        const t = T.find((x) => String(x.id) === b.dataset.avance);
        await trajets.modifier(t.id, { statut: SUIVANT[t.statut] }); rafraichir();
      } else if (b.dataset.suppr) {
        if (!confirm('Supprimer ce trajet ?')) return;
        await trajets.supprimer(b.dataset.suppr); toast('Trajet supprimé'); rafraichir();
      }
    } catch (err) { console.error(err); toast('Action impossible', 'err'); }
  });
};

export default Conducteur1;
