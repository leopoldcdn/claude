// Teamora · site de présentation : la barre de navigation, le questionnaire de l'accroche, le carrousel des rubriques
// et l'envoi du formulaire « Être recontacté ». Sans JavaScript, toutes les étapes restent lisibles les unes sous les autres.
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // 0. Barre de navigation : la rubrique en cours en pastille blanche, et un menu sur téléphone.
  var barre = $('#barre'), menu = barre && $('.menu', barre);
  if (menu) {
    var fermer = function () { barre.classList.remove('ouvert'); menu.setAttribute('aria-expanded', 'false'); };
    menu.addEventListener('click', function () { menu.setAttribute('aria-expanded', String(barre.classList.toggle('ouvert'))); });
    $$('.liens a', barre).forEach(function (a) { a.addEventListener('click', fermer); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && barre.classList.contains('ouvert')) { fermer(); menu.focus(); } });
    document.addEventListener('click', function (e) { if (barre.classList.contains('ouvert') && !barre.contains(e.target)) fermer(); });
  }
  var navLinks = $$('.liens a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (!e.isIntersecting) return; navLinks.forEach(function (a) { a.setAttribute('aria-current', String(!!e.target.id && a.getAttribute('href') === '#' + e.target.id)); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) { var t = $(a.getAttribute('href')); if (t && t.tagName === 'SECTION') spy.observe(t); });
  }

  // 0 bis. Questionnaire de l'accroche : quatre questions, un clic sur une réponse passe à la suivante ; au clavier,
  // les flèches changent la réponse et Entrée ou Espace la valident. Le champ e-mail sert au rendu : rien n'est envoyé.
  var quiz = $('#quiz');
  if (quiz) {
    var boite = $('#quiz-rubriques');
    // Les douze rubriques, reprises des cartes du carrousel (même ordre, mêmes couleurs).
    $$('.rcarte').forEach(function (c) {
      var l = document.createElement('label'); l.className = 'opt';
      var i = document.createElement('input'); i.type = 'radio'; i.name = 'rubrique'; i.value = c.dataset.step;
      var pt = document.createElement('span'); pt.className = 'pt'; pt.style.setProperty('--c', c.style.getPropertyValue('--c'));
      l.appendChild(i); l.appendChild(pt); l.appendChild(document.createTextNode($('.rcarte-t', c).textContent));
      boite.appendChild(l);
    });
    var etapes = $$('.etape', quiz), barres = $$('.progres i', quiz), retour = $('.retour', quiz);
    var fin = $('#quiz-fin'), ouvrir = $('#quiz-ouvrir'), baseDemo = ouvrir.getAttribute('href');
    var NOMS = ['taille', 'role', 'rubrique'], PROFILS = { dirigeant: 'rh', rh: 'rh', manager: 'manager', comptable: 'rh' };
    var n = 0, verrou = false, pointeur = 0;
    var valeur = function (nom) { var x = $('input[name="' + nom + '"]:checked', quiz); return x ? x.value : null; };
    var montrer = function (i, sens) {
      var avant = n; n = i;
      etapes.forEach(function (e, k) {
        var vu = k === i; e.setAttribute('aria-hidden', String(!vu));
        $$('input, button', e).forEach(function (x) { x.tabIndex = vu ? 0 : -1; });
        e.classList.remove('entre', 'recule');
        if (vu && avant !== i && !reduce) { void e.offsetWidth; e.classList.add('entre'); if (sens < 0) e.classList.add('recule'); }
      });
      barres.forEach(function (b, k) { b.classList.toggle('fait', k <= i); });
      $('#compteur').textContent = 'Question ' + (i + 1) + ' sur 4';
      $('#compteur-court').textContent = (i + 1) + '/4';
      retour.classList.toggle('cache', i === 0); retour.tabIndex = i === 0 ? -1 : 0;
      if (avant !== i) $(i === 3 && sens > 0 ? '#quiz-email' : '#q' + (i + 1)).focus({ preventScroll: true });
    };
    var avancer = function () {
      if (verrou || n > 2 || !valeur(NOMS[n])) return;
      verrou = true;
      setTimeout(function () { verrou = false; montrer(n + 1, 1); }, reduce ? 0 : 260);
    };
    quiz.addEventListener('pointerdown', function (e) { pointeur = e.target.closest('.opt') ? Date.now() : 0; });
    quiz.addEventListener('click', function (e) { if (e.target.matches('input[type="radio"]') && Date.now() - pointeur < 1000) { pointeur = 0; avancer(); } });
    quiz.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.matches('input[type="radio"]')) { e.preventDefault(); avancer(); } });
    quiz.addEventListener('keyup', function (e) { if (e.key === ' ' && e.target.matches('input[type="radio"]')) setTimeout(avancer, 0); });
    retour.addEventListener('click', function () { if (n > 0) montrer(n - 1, -1); });
    quiz.addEventListener('submit', function (e) {
      e.preventDefault();
      if (n !== 3) return;
      // La démo hébergée (demo/) recevra les réponses pour s'ouvrir au bon endroit ; l'aperçu garde le lien tel quel.
      var q = 'profil=' + (PROFILS[valeur('role')] || 'rh') + '&rubrique=' + (valeur('rubrique') || '') + '&effectif=' + (valeur('taille') || '');
      ouvrir.href = baseDemo === 'demo/' ? baseDemo + '?' + q : baseDemo;
      fin.style.minHeight = quiz.offsetHeight + 'px';
      quiz.hidden = true; fin.hidden = false;
      fin.classList.remove('joue'); if (!reduce) { void fin.offsetWidth; fin.classList.add('joue'); }
      $('#quiz-pret').focus({ preventScroll: true });
    });
    $('#quiz-modifier').addEventListener('click', function () { fin.hidden = true; quiz.hidden = false; montrer(0, -1); });
    montrer(0, 0);
  }

  // 1. Carrousel des rubriques : une carte par rubrique ; le détail de la carte choisie s'affiche dessous.
  var details = $$('.detail'), cartes = $$('.rcarte'), track = $('.rtrack');
  var prev = $('.rnav.prev'), next = $('.rnav.next'), current = null;
  var ordre = cartes.map(function (c) { return c.dataset.step; });
  function select(step, opts) {
    opts = opts || {};
    var d = $('#etape-' + step); if (!d) return;
    var changed = current !== null && current !== step;
    details.forEach(function (x) { x.hidden = x !== d; });
    if (changed && !reduce) { d.classList.remove('enter'); void d.offsetWidth; d.classList.add('enter'); }
    cartes.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.step === step)); });
    current = step;
    var i = ordre.indexOf(step);
    if (prev) prev.disabled = i <= 0;
    if (next) next.disabled = i >= ordre.length - 1;
    // La carte choisie vient au centre de la rangée.
    var carte = cartes[i];
    if (carte && track && opts.scroll !== false) {
      var gauche = carte.offsetLeft - track.offsetLeft - (track.clientWidth - carte.offsetWidth) / 2;
      track.scrollTo({ left: Math.max(0, gauche), behavior: reduce ? 'auto' : 'smooth' });
    }
    // Si le détail est hors de l'écran (téléphone), on descend jusqu'à lui.
    if (opts.voir) { var r = d.getBoundingClientRect(); if (r.top > window.innerHeight * 0.8 || r.bottom < 0) d.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' }); }
  }
  if (details.length && cartes.length) {
    cartes.forEach(function (c) { c.addEventListener('click', function () { select(c.dataset.step, { voir: true }); }); });
    var pas = function (k) { var i = ordre.indexOf(current) + k; if (i >= 0 && i < ordre.length) { select(ordre[i]); return cartes[i]; } };
    if (prev) prev.addEventListener('click', function () { pas(-1); });
    if (next) next.addEventListener('click', function () { pas(1); });
    // Clavier : flèches gauche et droite dans la rangée de cartes.
    if (track) track.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault(); var c = pas(e.key === 'ArrowRight' ? 1 : -1); if (c) c.focus({ preventScroll: true });
    });
    select(ordre[0], { scroll: false });
  }

  // 2. « Être recontacté » : envoi sans recharger la page (contact.php répond en JSON).
  var form = $('#form-contact');
  if (!form) return;
  // « Parlons partenariat » : le formulaire s'ouvre avec la fonction déjà choisie.
  $$('[data-fonction]').forEach(function (a) { a.addEventListener('click', function () { var f = $('#f-fonction'); if (f) f.value = a.dataset.fonction; }); });
  var started = Date.now(), status = $('#f-statut'), button = $('#f-envoyer');
  var apercu = document.documentElement.hasAttribute('data-apercu');
  var say = function (text, kind) { status.textContent = text; status.className = 'status ' + (kind || ''); };
  form.addEventListener('input', function (ev) { if (ev.target.getAttribute('aria-invalid') === 'true' && ev.target.checkValidity()) ev.target.setAttribute('aria-invalid', 'false'); });
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var invalid = Array.prototype.filter.call(form.elements, function (el) { return el.willValidate && !el.checkValidity(); });
    Array.prototype.forEach.call(form.elements, function (el) { if (el.willValidate) el.setAttribute('aria-invalid', String(invalid.indexOf(el) >= 0)); });
    var bad = invalid[0];
    if (bad) { bad.focus(); say(bad.type === 'email' && bad.value ? 'Indiquez une adresse e-mail valide.' : 'Indiquez votre nom et votre adresse e-mail.', 'err'); return; }
    if (apercu) { say('Aperçu : l’envoi fonctionnera une fois le site en ligne chez votre hébergeur.', 'err'); return; }
    $('#f-duree').value = String(Date.now() - started);
    button.disabled = true; say('Envoi en cours…');
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j && j.ok) { form.reset(); say('Merci, votre demande est bien partie. Nous vous recontactons rapidement.', 'ok'); }
        else say((j && j.erreur) || 'La demande n’a pas pu partir. Réessayez dans un instant.', 'err');
      })
      .catch(function () { say('La demande n’a pas pu partir. Vérifiez votre connexion et réessayez.', 'err'); })
      .then(function () { button.disabled = false; });
  });
})();
