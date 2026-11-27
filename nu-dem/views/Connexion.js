import { navigate } from '../controller/router.js';
import { routes, accueilDe } from '../controller/routes.js';
import { session } from '../models/session.js';
import { passagers, conducteurs, admins } from '../models/api.js';
import { toast } from '../lib/ui.js';

const Connexion = () => `
    <!-- CONN -->
    <div id="ALLConn" class="ALLConn">

        <div id="infos">
            <img id="log2" src="public/images/logo.svg"/>

            <div class="bienvenue">
                <h3>Bon retour parmi nous ! </h3>
                <i class="fa-solid fa-hand" style="color: rgb(255, 212, 59);"></i>
            </div>

            <p class="text">Connectez-vous pour accéder à votre espace <br> et continuer vos voyages en toute simplicité </p>

            <div class="acteur">
                <div class="passager">
                    <div class="divUn"><i class="fa-regular fa-user" style="color: lime;"></i></div>
                    <div class="titre">Partager</div>
                    <p>Réservez et gérez vos trajets </p>
                    <hr class="un">
                </div>
                <div class="conducteur">
                    <div class="divDeux"><i class="fa-solid fa-car" style="color: blue;"></i></div>
                    <div class="titre">Conducteur</div>
                    <p>Publiez vos trajets et gérez vos passagers</p>
                    <hr class="deux">
                </div>
                <div class="admin">
                    <div class="divTrois"><i class="fa-solid fa-lock" style="color: pink;"></i></div>
                    <div class="titre">Admin</div>
                    <p>Gérez la plateforme et les utilisateurs</p>
                    <hr class="trois">
                </div>
            </div>
        </div>
        
        <form action="">
            <h2>Se connecter</h2>

            <div class="login">
                <label for="login"><i class="fa-regular fa-envelope"></i> Email </label>
                <input class="inp1" id="login" type="email" placeholder="Entrez votre email ou téléphone">
            </div>

            <div class="mdp">
                <label for="mdp"><i class="fa-solid fa-lock"></i> Mot de passe</label>
                <input class="inp1" id="mdp" type="password" placeholder="Entrez votre mot de passe">
            </div>

            <div class="mdpM">Mot de passe oublié ?</div>

            <button class="btnCon" type="button">
                <i class="fa-solid fa-right-to-bracket"></i> Se connecter
            </button>

            <div class="sec"></div>

            <div class="versInsc">Vous n'avez pas de compte ? <span>S'inscrire maintenant</span></div>
        </form>
    </div>
`;

// Un seul écran pour les 3 profils : passager, conducteur, admin
const connexion = async (email, mdp) => {
  const profils = [['passager', passagers], ['conducteur', conducteurs], ['admin', admins]];
  const listes = await Promise.all(profils.map(([, svc]) => svc.obtenirTous()));
  for (const [i, [type]] of profils.entries()) {
    const user = listes[i].find((u) => u.email.toLowerCase() === email.toLowerCase() && u.motDePasse === mdp);
    if (!user) continue;
    session.ouvrir(type, user);
    toast(`Bienvenue ${user.nom} (${type})`);
    const retour = sessionStorage.getItem('nudem:retour');
    sessionStorage.removeItem('nudem:retour');
    const roleRetour = Object.entries(routes).find(([k]) => k.toLowerCase() === retour?.toLowerCase())?.[1].role;
    return navigate(roleRetour === type ? retour : accueilDe[type]);
  }
  toast("Email ou mot de passe incorrect", 'err');
};

Connexion.afterRender = () => {
  const champ = (id) => document.getElementById(id).value.trim();
  const envoyer = async () => {
    const email = champ('login'), mdp = document.getElementById('mdp').value;
    if (!email || !mdp) return toast('Tous les champs doivent être remplis', 'err');
    try { await connexion(email, mdp); }
    catch (e) { console.error(e); toast("Serveur injoignable : lancez npm start", 'err'); }
  };
  document.querySelector('.btnCon').addEventListener('click', envoyer);
  document.querySelector('#mdp').addEventListener('keydown', (e) => { if (e.key === 'Enter') envoyer(); });
  document.querySelector('.versInsc').addEventListener('click', () => navigate('/Inscription'));
};

export default Connexion;
