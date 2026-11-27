# Ñu dem — Covoiturage au Sénégal (SPA JavaScript pur)

Un seul projet, sans framework : routeur par hash, vues en fonctions, API `json-server`.

## Lancer
    npm install
    npm start          # API sur http://localhost:3000 (db.json)
    npm run web        # site sur http://localhost:5173

(les modules JS sont bloqués en `file://` : il faut le petit serveur `npm run web`.)

## Comptes de démonstration (db.json)
| Profil     | Email                   | Mot de passe |
|------------|-------------------------|--------------|
| Passager   | amadou@gmail.com        | 1234         |
| Passager   | fatou@gmail.com         | abcd         |
| Conducteur | amadou@gmail.com        | Amadou221    |
| Conducteur | modou@gmail.com         | Modou221     |
| Admin      | admin@nudem.sn          | admin        |

(Mots de passe en clair : démonstration uniquement.)

## Parcours
- **Accueil** : recherche (préremplit la réservation), statistiques réelles.
- **Passager1** : recherche et réservation de trajets · **Passager2** : profil, réservations (en cours / terminées), annuler, noter, modifier, supprimer le compte.
- **Conducteur1** : publier/avancer/supprimer des trajets, accepter/refuser des demandes, partage de localisation · **Conducteur2** : véhicules · **Conducteur3** : profil et avis.
- **Admin1** : statistiques, tables passagers/conducteurs/trajets, export JSON.
- **404**, **Erreur technique** (bouton Réessayer), garde de route par rôle.

## Structure
    index.html            une seule page, tous les CSS
    controller/           router.js (routeur) + routes.js (table de routes)
    views/                une fonction par page (+ afterRender)
    models/               api.js (service CRUD), classes.js (Conducteur, Vehicule), session.js
    lib/                  ui.js (toast, échappement), sidebar.js
    css/  public/images/  db.json  api/index.js (Vercel)  vercel.json
    docs/                 maquettes Figma, leçon fetch, archives des anciens projets

## Fusion des 3 projets (JS_SPA, PROJET, AncienPROJET)
| Ancien | Maintenant |
|---|---|
| PROJET (base la plus complète) | tout le projet |
| JS_SPA : Admin1, Conducteur3, maquettes PNG | `views/Admin1.js`, `Conducteur3.js`, `docs/maquettes/` |
| JS_SPA / AncienPROJET : `utilisateurs` (js.json) | fusionnés dans `passagers` de `db.json` |
| AncienPROJET : `api/index.js`, `vercel.json` | `api/index.js` (lit `db.json`), `vercel.json` |
| AncienPROJET : `src/router.js` (promesses, timers, fetch), `script.js` (localStorage, export JSON) | `docs/archives/` ; l'export JSON vit dans Admin1 |
| PROJET : `views/others` (classes, ConducteurService, doc animations/transform) | `models/classes.js`, `models/api.js`, `docs/archives/` |
| PROJET : `models/session.js` | `models/session.js` (une seule session, sans mot de passe) |
| `lecon-fetch-interactive.html` | `docs/` |
| `apresPage` / `afterRender` | `afterRender` |
