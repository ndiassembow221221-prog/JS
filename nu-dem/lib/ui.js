const MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => MAP[c]);
export const fcfa = (n) => `${Number(n || 0).toLocaleString('fr-FR')} FCFA`;
export const quand = (iso) => iso ? new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

// Petits messages à la place des alert()
export function toast(msg, type = 'ok') {
  let zone = document.querySelector('.toasts');
  if (!zone) { zone = document.createElement('div'); zone.className = 'toasts'; document.body.append(zone); }
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  zone.append(t);
  setTimeout(() => t.remove(), 3200);
}

// Disparition douce d'une ligne (ANIM-19)
export function retirerLigne(el, refus = false) {
  if (refus) el.style.background = '#fdecea';
  el.style.transition = 'opacity 300ms ease';
  el.style.opacity = '0';
  setTimeout(() => el.remove(), 310);
}
