const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

menu?.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
  menu.setAttribute('aria-label', expanded ? 'Ouvrir le menu' : 'Fermer le menu');
  nav.classList.toggle('open');
});

nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu?.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

const appointmentButton = document.querySelector('[data-demo-modal]');
const modal = document.querySelector('.demo-modal');
const modalCloseButtons = document.querySelectorAll('[data-modal-close]');

const closeModal = () => {
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  appointmentButton.focus();
};

appointmentButton?.addEventListener('click', () => {
  modal.hidden = false;
  document.body.classList.add('modal-open');
  modal.querySelector('.demo-modal__close').focus();
});

modalCloseButtons.forEach(button => button.addEventListener('click', closeModal));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal && !modal.hidden) closeModal();
});
