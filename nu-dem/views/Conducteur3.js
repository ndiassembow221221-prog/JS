import { sidebar, brancherSidebar } from '../lib/sidebar.js';
import { session } from '../models/session.js';
import { avis, passagers, vehicules, trajets } from '../models/api.js';
import { Conducteur, Vehicule } from '../models/classes.js';
import { esc } from '../lib/ui.js';

// Page "Profil + avis reçus" (maquette docs/maquettes/C3.png)
const Conducteur3 = async () => {
  const c = Conducteur.fromJSON(session.user.data);
  const q = `idConducteur=${c.id}`;
  const [av, pas, veh, tr] = await Promise.all([avis.obtenirTous(q), passagers.obtenirTous(), vehicules.obtenirTous(q), trajets.obtenirTous(q)]);
  const moyenne = av.length ? av.reduce((s, a) => s + a.note, 0) / av.length : 0;
  const etoiles = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));
  return `<div id="Conducteur3" class="page-c3">
    ${sidebar('/Conducteur3')}
    <div id="corps">
      <div id="titre"><div>Profil</div><span></span><img src="public/images/logo.svg" id="log" alt="Logo"></div>
      <div class="gps-card" style="padding:20px;display:flex;gap:20px;flex-wrap:wrap;align-items:center">
        <div class="avatar-lg"><i class="fa-solid fa-user"></i></div>
        <div style="flex:1"><div class="info-nom">${esc(c.nom)} ${c.estPremium() ? '<span class="badge-premium">Premium</span>' : ''}</div>
          <div class="contact-row">${esc(c.email)} · ${esc(c.telephone)}</div>
          <div class="contact-row">${esc(c.genererMessageAlerte())}</div></div>
        <div><span class="exp-badge">Exp: ${c.ancienete} ans</span><br><span class="exp-badge">${tr.length} trajets</span></div>
      </div>
      <div class="corps-grid" style="margin-top:20px">
        <div class="col-left"><div class="section-title">Véhicules enregistrés</div>
          ${veh.map(Vehicule.fromJSON).map((v) => `<div class="vehicules-card"><div class="vehicle-item">
            <div class="vehicle-icon"><i class="fa-solid ${v.estAutobus() ? 'fa-bus' : 'fa-car'}"></i></div>
            <div class="vehicle-info"><div class="vehicle-name">${esc(v.name)}</div><div class="vehicle-cap">Capacité : ${v.capacite} passagers</div></div>
            <span class="plate plate-green">${esc(v.matricule)}</span></div></div>`).join('') || '<p class="vide">Aucun véhicule</p>'}</div>
        <div class="col-right"><div class="gps-card" style="padding:20px"><div class="section-title">Avis reçus</div>
          <div class="avis-note">${moyenne ? moyenne.toFixed(1).replace('.', ',') : '—'}</div><div>${etoiles(moyenne)} (${av.length} avis)</div>
          ${av.map((a) => `<p style="margin-top:10px"><b>${esc(pas.find((p) => String(p.id) === String(a.idPassager))?.nom || 'Passager')}</b> ${etoiles(a.note)}<br>
            <span class="vide" style="padding:0;text-align:left">${esc(a.texte)}</span></p>`).join('')}</div></div>
      </div></div></div>`;
};

Conducteur3.afterRender = brancherSidebar;

export default Conducteur3;
