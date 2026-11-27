import { sidebar, brancherSidebar } from '../lib/sidebar.js';
import { session } from '../models/session.js';
import { trajets, conducteurs, reservations } from '../models/api.js';
import { esc, fcfa, quand, toast } from '../lib/ui.js';

let D = { tr: [], co: [], re: [] };
const ACTIVES = ['en attente', 'acceptee'];

const libres = (t) => t.places - D.re
  .filter((r) => String(r.idTrajet) === String(t.id) && ACTIVES.includes(r.statut))
  .reduce((s, r) => s + r.places, 0);

const carte = (t) => {
  const c = D.co.find((x) => String(x.id) === String(t.idConducteur));
  const l = libres(t);
  return `<div class="carte-trajet">
      <div><div>Chauffeur ${esc(c?.nom)}</div><div>${fcfa(t.prix)} Prix fixe</div></div>
      <div><div>Place ${l} disponible${l > 1 ? 's' : ''}</div><div>${esc(t.depart)} ➜ ${esc(t.arrivee)} · ${quand(t.date)}</div></div>
    </div>
    <div><label>place</label> <input type="number" min="1" max="${l}" value="1" data-places="${t.id}"></div>
    <button data-reserver="${t.id}">Reserver maintenant</button>`;
};

const cartes = ({ dep = '', des = '', dat = '' } = {}) => {
  const n = (s) => String(s).toLowerCase().trim();
  const liste = D.tr.filter((t) => t.statut === 'programme' && libres(t) > 0
    && n(t.depart).includes(n(dep)) && n(t.arrivee).includes(n(des))
    && (!dat || String(t.date).slice(0, 10) === dat.slice(0, 10)));
  return liste.map(carte).join('') || '<p class="vide">Aucun trajet ne correspond à votre recherche.</p>';
};

const Passager1 = async () => {
  [D.tr, D.co, D.re] = await Promise.all([trajets, conducteurs, reservations].map((s) => s.obtenirTous()));
  const r = JSON.parse(sessionStorage.getItem('nudem:recherche') || '{}'); // venue de l'Accueil
  sessionStorage.removeItem('nudem:recherche');
  return `<div id="Passager1">
    ${sidebar('/Passager1')}
    <div id="corps">
      <div id="ligne1"><h2>Recherche & Réservation</h2><img src="public/images/logo.svg" alt="" id="log"></div>
      <div id="ligne2">
        <div><label for="q-dep">Départ</label><br><input type="text" id="q-dep" value="${esc(r.dep)}"></div>
        <div><label for="q-des">Arrivée</label><br><input type="text" id="q-des" value="${esc(r.des)}"></div>
        <div><label for="q-dat">Date</label><br><input type="date" id="q-dat" value="${esc((r.dat || '').slice(0, 10))}"></div>
        <button id="q-go">Recherche</button>
      </div>
      <div id="ligne3">
        <img src="public/images/frame.png" alt="" id="carte">
        <div id="cards">${cartes(r)}</div>
      </div>
    </div>
  </div>`;
};

Passager1.afterRender = () => {
  brancherSidebar();
  const cards = document.querySelector('#cards');
  const val = (id) => document.getElementById(id).value;
  const actualiser = () => { cards.innerHTML = cartes({ dep: val('q-dep'), des: val('q-des'), dat: val('q-dat') }); };

  document.querySelector('#q-go').addEventListener('click', actualiser);
  ['q-dep', 'q-des', 'q-dat'].forEach((id) => document.getElementById(id).addEventListener('input', actualiser));

  cards.addEventListener('click', async (e) => {
    const id = e.target.dataset.reserver;
    if (!id) return;
    const t = D.tr.find((x) => String(x.id) === id);
    const places = Number(cards.querySelector(`[data-places="${id}"]`).value);
    if (!places || places < 1 || places > libres(t)) return toast('Nombre de places invalide', 'err');
    try {
      await reservations.ajouter({ idTrajet: t.id, idPassager: session.user.data.id, places, statut: 'en attente', dateReservation: new Date().toISOString() });
      D.re = await reservations.obtenirTous();
      actualiser();
      toast('Demande envoyée au conducteur ✔');
    } catch (err) { console.error(err); toast('Réservation impossible', 'err'); }
  });
};

export default Passager1;
