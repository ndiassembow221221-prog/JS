// =============================================================================
// Register : inscription de démonstration (rien n'est envoyé nulle part).
// =============================================================================
import { navigate } from '../../router.js';
import { login } from '../../session.js';
import { toast } from '../../components/toast.js';
import { showFieldError, clearFieldError, isEmail } from '../../utils.js';

const Register = () => `
  <div class="page auth">
    <div class="card auth__card">
      <span class="eyebrow">Nouveau ici ?</span>
      <h1>Créer un compte</h1>
      <p class="muted">Inscription de démonstration : rien n'est envoyé, tout reste dans votre navigateur.</p>

      <form id="registerForm" novalidate>
        <div class="field">
          <label for="regName">Nom</label>
          <input id="regName" type="text" placeholder="Votre nom" autocomplete="name"
                 maxlength="40" aria-describedby="regNameError" />
          <p class="field__error" id="regNameError" role="alert" hidden></p>
        </div>
        <div class="field">
          <label for="regEmail">E-mail</label>
          <input id="regEmail" type="email" placeholder="vous@exemple.com" autocomplete="email"
                 aria-describedby="regEmailError" />
          <p class="field__error" id="regEmailError" role="alert" hidden></p>
        </div>
        <div class="auth__actions">
          <button class="btn btn--primary" type="submit">S'inscrire</button>
          <button class="btn btn--ghost" type="button" id="toLogin">J'ai déjà un compte</button>
        </div>
      </form>
    </div>
  </div>
`;

Register.afterRender = () => {
  const name = document.getElementById('regName');
  const email = document.getElementById('regEmail');

  [name, email].forEach((el) => el.addEventListener('input', () => clearFieldError(el)));
  name.focus();

  document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;

    if (!name.value.trim()) { showFieldError(name, 'Entrez votre nom'); ok = false; }
    if (!isEmail(email.value.trim())) { showFieldError(email, 'Entrez une adresse e-mail valide'); ok = false; }
    if (!ok) { (document.querySelector('.field--invalid input'))?.focus(); return; }

    login({ name: name.value.trim(), email: email.value.trim() });
    toast('Compte créé. Bienvenue !', 'success');
    navigate('/espace');
  });

  document.getElementById('toLogin').addEventListener('click', () => navigate('/login'));
};

export default Register;
