// Session unique (ex clés "con" / "pas") : { type: 'passager'|'conducteur'|'admin', data }
const CLE = 'nudem:session';

export const session = {
  get user() { try { return JSON.parse(sessionStorage.getItem(CLE)); } catch { return null; } },
  ouvrir(type, data) {
    const { motDePasse, mdp, ...publique } = data; // jamais le mot de passe en session
    sessionStorage.setItem(CLE, JSON.stringify({ type, data: publique }));
  },
  maj(champs) { const u = this.user; if (u) sessionStorage.setItem(CLE, JSON.stringify({ ...u, data: { ...u.data, ...champs } })); },
  fermer() { sessionStorage.removeItem(CLE); },
};
