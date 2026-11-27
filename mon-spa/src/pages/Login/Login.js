// =============================================================================
// Login : connexion de démonstration (un nom suffit, aucune vraie authentification).
// =============================================================================
import { navigate } from '../../router.js';
import { login } from '../../session.js';
import { toast } from '../../components/toast.js';
import { showFieldError, clearFieldError } from '../../utils.js';

const Login = () => `
  <div class="page auth">
    <div class="card auth__card">
      <span class="eyebrow">Espace membre</span>
      <h1>Page de connexion</h1>
      <p class="muted">Entrez un nom d'utilisateur (simulation, sans authentification réelle).</p>

      <form id="loginForm" novalidate>
        <div class="field">
          <label for="username">Nom d'utilisateur</label>
          <input id="username" name="username" type="text" placeholder="Nom"
                 autocomplete="username" maxlength="40" aria-describedby="usernameError" />
          <p class="field__error" id="usernameError" role="alert" hidden></p>
        </div>
        <div class="auth__actions">
          <button class="btn btn--primary" type="submit" id="fakeLogin">Se connecter (démo)</button>
          <button class="btn btn--ghost" type="button" id="backHome">Retour à l'accueil</button>
        </div>
      </form>

      <p class="auth__alt">Pas encore de compte ? <a href="#/register">S'inscrire</a></p>
    </div>
  </div>
`;

Login.afterRender = () => {
  const form = document.getElementById('loginForm');
  const input = document.getElementById('username');

  input.addEventListener('input', () => clearFieldError(input));
  input.focus();

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // empêche le rechargement de la page
    const name = input.value.trim();

    if (!name) {
      showFieldError(input, 'Entrez un nom');
      toast('Entrez un nom', 'error');
      input.focus();
      return;
    }

    login({ name });
    toast(`Bienvenue ${name} ! (démo sans authentification)`, 'success');
    navigate('/espace');
  });

  document.getElementById('backHome').addEventListener('click', () => navigate('/'));
};

export default Login;
