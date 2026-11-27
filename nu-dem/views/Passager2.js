import { sidebar, brancherSidebar } from '../lib/sidebar.js';
import { navigate, rafraichir } from '../controller/router.js';
import { session } from '../models/session.js';
import { passagers, reservations, trajets, conducteurs, avis } from '../models/api.js';
import { esc, fcfa, quand, toast } from '../lib/ui.js';

let R = [];            // réservations enrichies du passager
let onglet = 'cours';
const EN_COURS = ['en attente', 'acceptee'];

const liste = () => R.filter((r) => (onglet === 'cours') === EN_COURS.includes(r.statut));

const lignes = () => liste().map((r) => `
  <div class="reservationCard">
    <div class="reservationIcon"><i class="fa-solid fa-car"></i></div>
    <div class="reservationInfos">
      <h4>${esc(r.t?.depart)} — ${esc(r.t?.arrivee)}</h4>
      <p>Chauffeur : ${esc(r.c?.nom)} • ${quand(r.t?.date)} • ${r.places} place(s)</p>
    </div>
    <div class="reservationActions">
      <span>${fcfa((r.t?.prix || 0) * r.places)}</span>
      <span class="statut">${esc(r.statut)}</span>
      ${r.statut === 'terminee' ? `<a data-act="noter" data-id="${r.id}">Noter</a>` : ''}
      ${EN_COURS.includes(r.statut) ? `<a data-act="annuler" data-id="${r.id}" class="annuler">Annuler</a>` : ''}
    </div>
  </div>`).join('') || '<p class="vide">Aucune réservation ici.</p>';

const Passager2 = async () => {
  const u = session.user.data;
  const [res, tr, co] = await Promise.all([reservations.obtenirTous(`idPassager=${u.id}`), trajets.obtenirTous(), conducteurs.obtenirTous()]);
  R = res.map((r) => {
    const t = tr.find((x) => String(x.id) === String(r.idTrajet));
    return { ...r, t, c: co.find((x) => String(x.id) === String(t?.idConducteur)) };
  });
  const dernier = R.filter((r) => r.statut === 'terminee').at(-1);
  onglet = 'cours';
  return `<div id="Passager2">
    ${sidebar('/Passager2')}
    <div id="corpsP2">
      <div id="gauche">
        <div class="photoBloc"><div class="photoProfil avatar-ini">${esc(u.nom[0]?.toUpperCase())}</div></div>
        <h3>${esc(u.nom)}</h3><p>Passager</p>
        <div class="infoProfil"><span>Téléphone</span><strong data-champ="telephone">${esc(u.telephone)}</strong></div>
        <div class="infoProfil"><span>Email</span><strong>${esc(u.email)}</strong></div>
        <div class="infoProfil"><span>Ville</span><strong data-champ="ville">${esc(u.ville)}</strong></div>
        <button class="btn bleu" id="modifier"><i class="fa-solid fa-pen"></i> Modifier les infos</button>
        <button class="btn rouge" id="supprimer"><i class="fa-solid fa-trash"></i> Supprimer le compte</button>
        <div class="trajetFavori">
          <h4>Dernier trajet</h4>
          <p>${dernier ? `${esc(dernier.t?.depart)} ➜ ${esc(dernier.t?.arrivee)}` : 'Aucun trajet terminé'}</p>
          ${dernier ? `<button class="btn vert" data-act="noter" data-id="${dernier.id}">Noter le chauffeur</button>` : ''}
        </div>
      </div>
      <div id="droite">
        <div class="tabs"><div class="tab active" data-onglet="cours">En cours</div><div class="tab" data-onglet="fini">Terminées</div></div>
        <div class="reservations" id="liste-res">${lignes()}</div>
      </div>
    </div>
  </div>`;
};

Passager2.afterRender = () => {
  brancherSidebar();
  const u = session.user.data;
  const zone = document.querySelector('#liste-res');

  document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => {
    onglet = tab.dataset.onglet;
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t === tab));
    zone.innerHTML = lignes();
  }));

  document.querySelector('#Passager2').addEventListener('click', async (e) => {
    const { act, id } = e.target.dataset;
    if (!act) return;
    const r = R.find((x) => String(x.id) === id);
    try {
      if (act === 'annuler') { await reservations.modifier(id, { statut: 'annulee' }); toast('Réservation annulée'); rafraichir(); }
      if (act === 'noter') {
        const note = Number(prompt('Note de 1 à 5 ?'));
        if (!(note >= 1 && note <= 5)) return toast('Note invalide', 'err');
        await avis.ajouter({ idConducteur: r.t.idConducteur, idPassager: u.id, note, texte: '' });
        toast('Merci pour votre avis ✔');
      }
    } catch (err) { console.error(err); toast('Action impossible', 'err'); }
  });

  // Modifier les infos : les valeurs se transforment en champs, 2e clic = enregistrer
  let edition = false;
  const btn = document.querySelector('#modifier');
  btn.addEventListener('click', async () => {
    const champs = document.querySelectorAll('[data-champ]');
    if (!edition) {
      champs.forEach((s) => { s.innerHTML = `<input value="${esc(s.textContent)}" data-k="${s.dataset.champ}">`; });
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Enregistrer'; edition = true; return;
    }
    const maj = Object.fromEntries([...champs].map((s) => [s.dataset.champ, s.querySelector('input').value.trim()]));
    if (Object.values(maj).some((v) => v.length < 2)) return toast('Champs trop courts', 'err');
    try { await passagers.modifier(u.id, maj); session.maj(maj); toast('Profil mis à jour ✔'); rafraichir(); }
    catch { toast('Mise à jour impossible', 'err'); }
  });

  document.querySelector('#supprimer').addEventListener('click', async () => {
    if (!confirm('Supprimer définitivement votre compte ?')) return;
    try { await passagers.supprimer(u.id); session.fermer(); toast('Compte supprimé'); navigate('/'); }
    catch { toast('Suppression impossible', 'err'); }
  });
};

export default Passager2;
