/* Progressive enhancements only. All primary content lives in the generated HTML. */
(() => {
  'use strict';
  const site = window.NOVA_SITE;
  if (!site) return;
  document.documentElement.classList.add('js');
  const $ = selector => document.querySelector(selector);
  const menu = $('.menu-toggle');
  const nav = $('#navigation');
  const mobile = window.matchMedia('(max-width: 700px)');

  function closeMenu(returnFocus = false) {
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Ouvrir le menu');
    if (returnFocus) menu.focus();
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  nav.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    closeMenu();
    // Move keyboard focus out of the now-hidden dropdown, to the destination.
    if (mobile.matches) {
      const destination = document.querySelector(link.hash);
      destination?.setAttribute('tabindex', '-1');
      destination?.focus({preventScroll:true});
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header') && nav.classList.contains('is-open')) closeMenu();
  });
  document.addEventListener('focusin', event => {
    if (!event.target.closest('.site-header') && nav.classList.contains('is-open')) closeMenu();
  });
  mobile.addEventListener('change', () => closeMenu());

  // Service cards are genuine shortcuts: selection is carried into the form.
  const form = $('#contact-form');
  const draft = $('#draft-panel');
  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      $('#service').value = link.dataset.service;
      form.hidden = false;
      draft.hidden = true;
    });
  });

  // Local draft only: no fetch, persistence, form backend or booking claim.
  const draftText = $('#draft-text');
  const copyStatus = $('#copy-status');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const selectedService = site.services.find(service => service.id === data.get('service'));
    const serviceName = selectedService?.title || 'Autre / à préciser';
    const subject = `Demande de devis — ${serviceName}`;
    const body = [
      `Bonjour ${site.brand.name},`, '',
      `Je souhaite échanger au sujet de : ${serviceName}.`,
      `Véhicule : ${String(data.get('vehicle')).trim() || 'à préciser ensemble'}`, '',
      String(data.get('message')).trim(), '',
      `Nom : ${String(data.get('name')).trim()}`,
      `Email : ${String(data.get('email')).trim()}`, '',
      'Merci de me recontacter pour préciser les besoins et les prochaines étapes.',
      ...(site.demo ? ['', '[Brouillon de démonstration — destinataire fictif]'] : [])
    ].join('\n');
    draftText.value = `À : ${site.contact.email}\nObjet : ${subject}\n\n${body}`;
    $('#email-draft').href = `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    copyStatus.textContent = '';
    form.hidden = true;
    draft.hidden = false;
    draft.focus({preventScroll:true});
    draft.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',block:'nearest'});
  });
  // Enable only after the submit handler exists, so failure cannot leak a GET URL.
  $('#contact-fields').disabled = false;
  $('#form-inactive-notice').hidden = true;
  $('#edit-draft').addEventListener('click', () => {
    draft.hidden = true;
    form.hidden = false;
    $('#message').focus({preventScroll:true});
  });
  $('#copy-draft').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(draftText.value);
      copyStatus.textContent = 'Message copié. Aucun email n’a été envoyé.';
    } catch {
      draftText.focus();
      draftText.select();
      copyStatus.textContent = 'Copie automatique indisponible. Le texte est sélectionné : utilisez Copier dans votre navigateur (Ctrl+C ou ⌘C).';
    }
  });

  // Dialog: real keyboard containment, close on Escape, return focus to opener.
  const infoDialog = $('#info-dialog');
  const info = site.information;
  document.querySelectorAll('[data-info]').forEach(button => button.addEventListener('click', () => {
    const content = info[button.dataset.info];
    $('#info-title').textContent = content.title;
    // The HTML above is static editorial content, never form input or remote data.
    $('#info-content').innerHTML = content.content;
    infoDialog.showModal();
  }));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });

  // A compact, accessible gallery. No slideshow or automatic movement.
  const lightbox = $('#lightbox');
  let photoIndex = 0;
  function showPhoto(index) {
    photoIndex = (index + site.gallery.length) % site.gallery.length;
    const photo = site.gallery[photoIndex];
    $('#lightbox-image').src = photo.image;
    $('#lightbox-image').alt = photo.alt;
    $('#lightbox-caption').textContent = photo.title;
    $('#photo-count').textContent = `${photoIndex+1} / ${site.gallery.length}`;
  }
  document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
    showPhoto(Number(button.dataset.photo));
    lightbox.showModal();
  }));
  $('#photo-prev').addEventListener('click', () => showPhoto(photoIndex-1));
  $('#photo-next').addEventListener('click', () => showPhoto(photoIndex+1));
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(photoIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  if ('IntersectionObserver' in window) {
    // The sticky mobile CTA steps aside when the actual contact section is visible.
    const mobileCta = $('.mobile-cta');
    const contactObserver = new IntersectionObserver(entries => {
      mobileCta.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, {rootMargin:'-76px 0px 0px 0px',threshold:0});
    contactObserver.observe($('#contact'));
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        nav.querySelectorAll('a').forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current','location');
          else link.removeAttribute('aria-current');
        });
      });
    }, {rootMargin:'-15% 0px -60% 0px',threshold:0});
    document.querySelectorAll('#services,#atelier,#en-images,#contact').forEach(section => sectionObserver.observe(section));
  }
})();
