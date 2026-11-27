// Service CRUD générique (ex ConducteurService) : une classe, toutes les ressources de db.json
const BASE = ['localhost', '127.0.0.1'].includes(location.hostname) ? 'http://localhost:3000' : '/api';

export class Service {
  constructor(ressource) { this.url = `${BASE}/${ressource}`; }

  async #appel(chemin = '', options) {
    const reponse = await fetch(this.url + chemin, options);
    if (!reponse.ok) throw new Error(`Erreur serveur (${reponse.status})`);
    return reponse.status === 204 ? null : reponse.json();
  }
  obtenirTous(requete = '') { return this.#appel(requete ? `?${requete}` : ''); }
  obtenir(id)               { return this.#appel(`/${id}`); }
  ajouter(objet)            { return this.#appel('', this.#corps('POST', objet)); }
  modifier(id, champs)      { return this.#appel(`/${id}`, this.#corps('PATCH', champs)); } // PATCH : seuls les champs envoyés
  supprimer(id)             { return this.#appel(`/${id}`, { method: 'DELETE' }); }
  #corps(method, objet) {
    return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(objet) };
  }
}

export const passagers    = new Service('passagers');
export const conducteurs  = new Service('conducteurs');
export const vehicules    = new Service('vehicules');
export const trajets      = new Service('trajets');
export const reservations = new Service('reservations');
export const avis         = new Service('avis');
export const admins       = new Service('admins');
