// Table de routes = source unique. role: page protégée (passager | conducteur | admin)
export const routes = {
  '/':             { page: 'Accueil',      titre: 'Accueil' },
  '/Inscription':  { page: 'Inscription',  titre: 'Inscription' },
  '/Connexion':    { page: 'Connexion',    titre: 'Connexion' },
  '/Passager1':    { page: 'Passager1',    titre: 'Recherche & réservation', role: 'passager' },
  '/Passager2':    { page: 'Passager2',    titre: 'Profil passager',         role: 'passager' },
  '/Conducteur1':  { page: 'Conducteur1',  titre: 'Gestion des trajets',     role: 'conducteur' },
  '/Conducteur2':  { page: 'Conducteur2',  titre: 'Véhicules',               role: 'conducteur' },
  '/Conducteur3':  { page: 'Conducteur3',  titre: 'Profil conducteur',       role: 'conducteur' },
  '/Admin1':       { page: 'Admin1',       titre: 'Administration',          role: 'admin' },
};

// Page d'arrivée après connexion
export const accueilDe = { passager: '/Passager1', conducteur: '/Conducteur1', admin: '/Admin1' };
