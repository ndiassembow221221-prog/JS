import { sidebar, brancherSidebar } from '../lib/sidebar.js';
import { rafraichir } from '../controller/router.js';
import { session } from '../models/session.js';
import { vehicules } from '../models/api.js';
import { Conducteur, Vehicule } from '../models/classes.js';
import { esc, toast } from '../lib/ui.js';

const Conducteur2 = async () => {
  const c = Conducteur.fromJSON(session.user.data);
  const liste = (await vehicules.obtenirTous(`idConducteur=${c.id}`)).map(Vehicule.fromJSON);
  return `<div id="Conducteur2">
    ${sidebar('/Conducteur2')}
    <div id="corps">
      <div id="titre"><div>Profil</div><span></span><img src="public/images/logo.svg" id="log" alt="Logo"></div>
      <div id="titre-profil" class="profil-entete">
        <div><div class="avatar-lg"><i class="fa-solid fa-user"></i></div>
          <div><div class="info-nom">${esc(c.nom)} ${c.estPremium() ? '<span class="badge-premium">Premium</span>' : ''}</div>
            <div class="contact-row"><i class="fa-solid fa-envelope"></i> ${esc(c.email)}</div>
            <div class="contact-row"><i class="fa-solid fa-phone"></i> ${esc(c.telephone)}</div></div></div>
        <div><span class="exp-badge">Exp: ${c.ancienete} ans</span></div>
      </div>
      <div class="section-header"><span class="section-title">Véhicules enregistrés</span>
        <button class="add-btn" id="ajout"><i class="fa-solid fa-plus"></i> Ajouter un véhicule</button></div>
      <form class="form-publier" id="f-vehicule" hidden>
        <label>Nom<input name="name" required placeholder="Bus, Peugeot 508…"></label>
        <label>Capacité<input name="capacite" type="number" min="1" required></label>
        <label>Matricule<input name="matricule" required></label>
        <button class="btn btn-primary">Enregistrer</button></form>
      <div id="listeVehicules">${liste.map((v) => `
        <div class="vehicules-card"><div class="vehicle-item">
          <div class="vehicle-icon"><i class="fa-solid ${v.estAutobus() ? 'fa-bus' : 'fa-car'}"></i></div>
          <div class="vehicle-info"><div class="vehicle-name">${esc(v.name)}</div><div class="vehicle-cap">Capacité : ${v.capacite} passagers</div></div>
          <span class="plate plate-green">${esc(v.matricule)}</span>
          <button class="action-icon delete" data-suppr="${v.id}" title="Supprimer"><i class="fa-solid fa-trash"></i></button></div></div>`).join('')
        || '<div class="vehicules-card">Aucun véhicule enregistré</div>'}</div>
    </div></div>`;
};

Conducteur2.afterRender = () => {
  brancherSidebar();
  const form = document.querySelector('#f-vehicule');
  document.querySelector('#ajout').addEventListener('click', () => { form.hidden = !form.hidden; });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(form));
    try {
      await vehicules.ajouter({ name: f.name.trim(), capacite: Number(f.capacite), matricule: f.matricule.trim(), idConducteur: session.user.data.id });
      toast('Véhicule ajouté ✔'); rafraichir();
    } catch { toast('Ajout impossible', 'err'); }
  });
  document.querySelector('#listeVehicules').addEventListener('click', async (e) => {
    const id = e.target.closest('[data-suppr]')?.dataset.suppr;
    if (!id || !confirm('Supprimer ce véhicule ?')) return;
    try { await vehicules.supprimer(id); toast('Véhicule supprimé'); rafraichir(); } catch { toast('Suppression impossible', 'err'); }
  });
};

export default Conducteur2;
