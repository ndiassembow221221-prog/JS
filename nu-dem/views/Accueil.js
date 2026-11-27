import { navigate } from '../controller/router.js';
import { accueilDe } from '../controller/routes.js';
import { session } from '../models/session.js';
import { passagers, conducteurs, trajets, avis } from '../models/api.js';

const Accueil = () => `
    <!-- ACCUEIL -->
    <div id="Accueil">

        <header id="header">
            <div class="gauche"> 
                Ñu <br> dem 
            </div>
            <div class="milieu">
                Partagez vos trajets, <br>
                <span>économisez ensemble</span>
            </div>
            <div class="droite">
                <img src="public/images/logo.svg" alt="">
            </div>
        </header>

        <div class="slogan">
            Un moyen simple, sécurisé et convivial de voyager partout au Sénégal
        </div>

        <div class="recherche">
            <div class="dep">
                <label for="dep"><i class="fa-solid fa-location-dot"></i> Depart</label>
                <input type="text" id="dep"/>
            </div>
            <div class="des">
                <label for="des"><i class="fa-solid fa-flag-checkered"></i> Destination</label>
                <input type="text" id="des"/>
            </div>
            <div class="dat">
                <label for="dat"><i class="fa-regular fa-calendar"></i> Date et heure</label>
                <input type="datetime-local" id="dat"/>
            </div>
            <div class="pas">
                <label for="pas"><i class="fa-regular fa-user"></i> Passager</label>
                <select name="pas" id="pas" class="pas">
                    <option value="1">1 passager</option>
                    <option value="2">2 passagers</option>
                    <option value="3">3 passagers</option>
                </select>
            </div>
            
            <button class="btnS">
                <i class="fa-solid fa-magnifying-glass"></i> Recherche
            </button>
        </div>

        <div class="stats">
            <div class="mem">
                <i class="fa-solid fa-users" style="color: lime;"></i>
                <div><b data-stat="membres">100+</b> <br> Membres Actifs</div>
            </div>
            <div class="trj">
                <i class="fa-solid fa-route" style="color: lime;"></i>
                <div><b data-stat="trajets">50+</b> <br> Trajets disponibles</div>
            </div>
            <div class="not">
                <i class="fa-solid fa-star" style="color: #f59e0b;"></i>
                <div><b data-stat="note">4 / 5</b> <br> Note Moyenne</div>
            </div>
            <div class="red">
                <i class="fa-solid fa-leaf" style="color: lime;"></i>
                <div>Réduction CO₂ <br> Voyager éco-responsable</div>
            </div>
        </div>

    </div>
    `;

Accueil.afterRender = async () => {
  const val = (s) => document.querySelector(s)?.value || '';
  document.querySelector('.btnS').addEventListener('click', () => {
    // la recherche saisie ici préremplit la page de réservation
    sessionStorage.setItem('nudem:recherche', JSON.stringify({ dep: val('#dep'), des: val('#des'), dat: val('#dat') }));
    const u = session.user;
    navigate(u?.type === 'passager' ? accueilDe.passager : '/Connexion');
  });

  // statistiques réelles (les valeurs écrites dans le HTML servent de repli si l'API est éteinte)
  try {
    const [p, c, t, a] = await Promise.all([passagers, conducteurs, trajets, avis].map((s) => s.obtenirTous()));
    const set = (k, v) => { const el = document.querySelector(`[data-stat="${k}"]`); if (el) el.textContent = v; };
    set('membres', p.length + c.length);
    set('trajets', t.length);
    if (a.length) set('note', `${(a.reduce((s, x) => s + x.note, 0) / a.length).toFixed(1).replace('.', ',')} / 5`);
  } catch { /* API éteinte : on garde les valeurs statiques */ }
};

export default Accueil;
