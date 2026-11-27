// Modèles métier (ex views/others) — désormais utilisés par les pages
export class Conducteur {
  constructor({ id, nom, telephone, tel, email, ancienete, lieu, localisation = false }) {
    this.id = id; this.nom = nom; this.telephone = telephone ?? tel; this.email = email;
    this.ancienete = parseInt(ancienete) || 0; this.lieu = lieu; this.localisation = localisation;
  }
  static fromJSON(json) { return new Conducteur(json); }
  estPremium() { return this.ancienete >= 5; }
  genererMessageAlerte() { return `Alerte : Le conducteur ${this.nom} (${this.telephone}) est disponible à ${this.lieu}.`; }
  presenter() { return `Conducteur: ${this.nom}`; }
}

export class Vehicule {
  constructor({ id, idVehicule, name, capacite, matricule, mat, idConducteur }) {
    this.id = id ?? idVehicule; this.name = name; this.capacite = Number(capacite);
    this.matricule = matricule ?? mat; this.idConducteur = idConducteur;
  }
  static fromJSON(json) { return new Vehicule(json); }
  estAutobus() { return this.capacite > 30; }
}
