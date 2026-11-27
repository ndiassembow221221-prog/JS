import { navigate } from '../controller/router.js';
import { passagers } from '../models/api.js';
import { toast } from '../lib/ui.js';

const Inscription = () => `
    <div id="ALLConn" class="AllInsc">

        <div id="infos">
            <img id="log2" src="public/images/logo.svg"/>

            <div class="bienvenue">
                <h3>Rejoignez la communauté <br> <span>du covoiturage</span> </h3>
                <i class="fa-solid fa-hand" style="color: rgb(255, 212, 59);"></i>
            </div>

            <p class="text">Créez votre compte et profitez d'un moyen de <br> transport économique, convivial et sécurisé </p>
        </div>
        
        <form action="">
            <h2 class="insc2">Créer un compte passager</h2>
            <h5>Déjà un compte ? <span class="versConn">Se connecter</span></h5>
            
            <div class="nomComplet">
                <label for="nom"><i class="fa-regular fa-user"></i> Nom </label>
                <input class="inpInsc" type="text" placeholder="Entrez votre nom" id="nom">
            </div>

            <div class="loginInsc">
                <label for="loginInsc"><i class="fa-regular fa-envelope"></i> Email </label>
                <input class="inpInsc" type="email" placeholder="Entrez votre email" id="loginInsc">
            </div>

            <div class="telInsc">
                <label for="tel"><i class="fa-solid fa-phone"></i> Téléphone </label>
                <input class="inpInsc" type="tel" placeholder="Entrez votre téléphone" id="tel">
            </div>

            <div class="mdpInsc">
                <label for="mdp2"><i class="fa-solid fa-lock"></i> Mot de passe </label>
                <input class="inpInsc" type="password" placeholder="Entrez votre mot de passe" id="mdp2">
            </div>

            <div class="mdpConfInsc">
                <label for="mdp3"><i class="fa-solid fa-lock"></i> Confirmer mot de passe </label>
                <input class="inpInsc" type="password" placeholder="Confirmez votre mot de passe" id="mdp3">
            </div>

            <div class="ville">
                <label for="ville"><i class="fa-solid fa-city"></i> Ville </label>
                <input class="inpInsc" type="text" placeholder="Entrez votre ville" id="ville">
            </div>

            <button class="btnInsc btnCon" type="button">
                <i class="fa-solid fa-user-plus"></i> S'inscrire
            </button>

            <div class="sec"></div>
        </form>

    </div>
`;

Inscription.afterRender = () => {
  const v = (id) => document.getElementById(id).value.trim();
  document.querySelector('.versConn').addEventListener('click', () => navigate('/Connexion'));

  document.querySelector('.btnInsc').addEventListener('click', async () => {
    const nom = v('nom'), email = v('loginInsc'), telephone = v('tel'), ville = v('ville');
    const motDePasse = document.getElementById('mdp2').value, confirmation = document.getElementById('mdp3').value;

    if (!nom || !email || !telephone || !motDePasse || !ville) return toast('Tous les champs doivent être remplis', 'err');
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast("L'email doit contenir @ et un point", 'err');
    if (nom.length < 2 || ville.length < 2) return toast('Nom ou ville trop court', 'err');
    if (!/^\+?[0-9 ]{8,15}$/.test(telephone)) return toast('Téléphone invalide', 'err');
    if (motDePasse.length < 4) return toast('Mot de passe : 4 caractères minimum', 'err');
    if (motDePasse !== confirmation) return toast('Les deux mots de passe ne correspondent pas', 'err');

    try {
      const existants = await passagers.obtenirTous();
      if (existants.some((p) => p.email.toLowerCase() === email.toLowerCase())) return toast('Cet email est déjà inscrit', 'err');
      await passagers.ajouter({ nom, email, telephone, motDePasse, ville, dateInscription: new Date().toISOString() });
      toast('Inscription réussie ✔');
      navigate('/Connexion');
    } catch (e) { console.error(e); toast('Serveur injoignable : lancez npm start', 'err'); }
  });
};

export default Inscription;
