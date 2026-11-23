// Teamora · site de présentation : la barre de navigation, le questionnaire de l'accroche, le carrousel des rubriques (« + »),
// l'envoi des avis (« Aidez-nous à améliorer Teamora ») et du formulaire « Être recontacté ». Sans JavaScript, toutes les étapes restent lisibles les unes sous les autres.
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
  // Rubrique en cours : recalculée à chaque défilement à partir de la position des sections (et non d'événements
  // d'entrée ou de sortie, qui ratent les sauts, les rechargements à mi-page ou les sections sans lien). La section en
  // cours est la dernière dont le haut a passé le tiers supérieur de l'écran ; tout en haut, l'accueil ; tout en bas, la
  // dernière section. Si elle n'a pas de lien dans la barre (« Être recontacté »), aucune rubrique n'est allumée.
  var navLinks = $$('.liens a[href^="#"]'), sections = $$('main > section[id]');
  if (navLinks.length && sections.length) {
    var allumer = function (id) { navLinks.forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + id)); }); };
    var enCours = function () {
      var doc = document.documentElement, ligne = window.innerHeight / 3, id = sections[0].id;
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 4) id = sections[sections.length - 1].id;
      else if (window.scrollY > 4) sections.forEach(function (sec) { if (sec.getBoundingClientRect().top <= ligne) id = sec.id; });
      allumer(id);
    };
    var prevu = false;
    var planifier = function () { if (!prevu) { prevu = true; window.requestAnimationFrame(function () { prevu = false; enCours(); }); } };
    window.addEventListener('scroll', planifier, { passive: true });
    window.addEventListener('resize', planifier);
    window.addEventListener('hashchange', planifier);
    window.addEventListener('load', enCours);
    // Un clic dans la barre allume tout de suite la rubrique visée ; le défilement confirme ensuite.
    navLinks.forEach(function (a) { a.addEventListener('click', function () { allumer(a.getAttribute('href').slice(1)); }); });
    enCours();
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

  // 1. Carrousel des rubriques : le « + » d'une carte l'élargit et déplie son détail (une seule carte ouverte à la fois,
  // « Échap » la referme) ; les flèches font défiler la rangée.
  var cartes = $$('.rcarte'), track = $('.rtrack'), prev = $('.rnav.prev'), next = $('.rnav.next');
  if (cartes.length && track) {
    // Les cartes fermées ont toutes la hauteur de la plus haute ; seule la carte ouverte grandit.
    var egaliser = function () {
      track.style.removeProperty('--h');
      var h = 0; cartes.forEach(function (c) { h = Math.max(h, $('.rcarte-a', c).offsetHeight); });
      track.style.setProperty('--h', h + 'px');
    };
    // Le détail : la liste prend la largeur de sa ligne la plus longue, pour se centrer dans sa zone.
    var resserrer = function () {
      var r = document.createRange();
      cartes.forEach(function (c) {
        var ul = $('.rcarte-d ul', c); if (!ul) return;
        ul.style.width = '';
        var g = ul.getBoundingClientRect().left, d = g;
        $$('li', ul).forEach(function (li) { r.selectNodeContents(li); Array.prototype.forEach.call(r.getClientRects(), function (x) { d = Math.max(d, x.right); }); });
        if (d > g) ul.style.width = Math.ceil(d - g) + 1 + 'px';
      });
    };
    var basculer = function (carte, ouvrir) {
      var b = $('.plus', carte), d = $('.rcarte-d', carte), contenu = $('.rcarte-d-in', carte);
      carte.classList.toggle('ouvert', ouvrir);
      b.setAttribute('aria-expanded', String(ouvrir));
      b.setAttribute('aria-label', (ouvrir ? 'Fermer le détail : ' : 'Voir le détail : ') + b.dataset.nom);
      d.inert = !ouvrir;
      // Détail à droite (ordinateur) : la carte s'allonge si le détail est plus long que l'illustration et son texte.
      carte.style.minHeight = ouvrir && getComputedStyle(d).position === 'absolute' ? Math.max($('.rcarte-a', carte).offsetHeight, contenu.scrollHeight) + 2 + 'px' : '';
      // La carte ouverte se cale juste après la zone de fondu de gauche (ou au tout début pour la première).
      if (ouvrir) track.scrollTo({ left: Math.max(0, carte.offsetLeft - track.offsetLeft - (parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0)), behavior: reduce ? 'auto' : 'smooth' });
      bouts(); setTimeout(bouts, 620);
    };
    cartes.forEach(function (c) {
      $('.rcarte-d', c).inert = true;
      $('.plus', c).addEventListener('click', function () {
        var ouvrir = !c.classList.contains('ouvert');
        if (ouvrir) cartes.forEach(function (x) { if (x !== c && x.classList.contains('ouvert')) basculer(x, false); });
        basculer(c, ouvrir);
      });
    });
    // Flèches : une carte de plus ou de moins ; elles disparaissent aux deux bouts de la rangée. Repère : les segments
    // des cartes visibles (au moins à moitié) s'allument, celui de la carte ouverte s'épaissit.
    var segments = $$('.rprog i');
    var bouts = function () {
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
      // Bords en fondu seulement du côté où il reste des cartes.
      track.classList.toggle('fondu-g', track.scrollLeft > 2);
      track.classList.toggle('fondu-d', track.scrollLeft < track.scrollWidth - track.clientWidth - 2);
      var t = track.getBoundingClientRect();
      cartes.forEach(function (c, i) {
        var r = c.getBoundingClientRect(), vu = Math.min(r.right, t.right) - Math.max(r.left, t.left);
        if (segments[i]) { segments[i].classList.toggle('on', vu >= r.width / 2); segments[i].classList.toggle('ouvert', c.classList.contains('ouvert')); }
      });
    };
    var defiler = function (k) { track.scrollBy({ left: k * (cartes[0].offsetWidth + 16), behavior: reduce ? 'auto' : 'smooth' }); };
    if (prev) prev.addEventListener('click', function () { defiler(-1); });
    if (next) next.addEventListener('click', function () { defiler(1); });
    track.addEventListener('scroll', bouts, { passive: true });
    // Clavier : les flèches passent d'un « + » à l'autre ; « Échap » referme la carte ouverte.
    track.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { var o = e.target.closest('.rcarte.ouvert'); if (o) { basculer(o, false); $('.plus', o).focus(); } return; }
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var ici = e.target.closest('.rcarte'), i = ici ? cartes.indexOf(ici) + (e.key === 'ArrowRight' ? 1 : -1) : 0;
      if (i < 0 || i >= cartes.length) return;
      e.preventDefault();
      $('.plus', cartes[i]).focus({ preventScroll: true });
      cartes[i].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest', inline: 'nearest' });
    });
    egaliser(); resserrer(); bouts();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { egaliser(); resserrer(); });
    window.addEventListener('resize', function () { egaliser(); resserrer(); bouts(); });
  }

  // 2. « Aidez-nous à améliorer Teamora » : un avis sans nom, envoyé à avis.php comme « Donner mon avis » dans la démo.
  var avis = $('#form-avis');
  if (avis) {
    var avisDebut = Date.now(), avisStatut = $('#a-statut'), avisBouton = $('#a-envoyer'), avisMsg = $('#a-message');
    var dire = function (texte, genre) { avisStatut.textContent = texte; avisStatut.className = 'status ' + (genre || ''); };
    var champ = function (nom) { var x = avis.elements[nom]; return x ? x.value : ''; };
    avisMsg.addEventListener('input', function () { if (avisMsg.getAttribute('aria-invalid') === 'true' && avisMsg.value.trim().length >= 3) avisMsg.setAttribute('aria-invalid', 'false'); });
    avis.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (avisMsg.value.trim().length < 3) { avisMsg.setAttribute('aria-invalid', 'true'); avisMsg.focus(); dire('Écrivez quelques mots sur ce que vous en pensez.', 'err'); return; }
      avisMsg.setAttribute('aria-invalid', 'false');
      if (document.documentElement.hasAttribute('data-apercu')) { dire('Aperçu : l’envoi fonctionnera une fois le site en ligne chez votre hébergeur.', 'err'); return; }
      var donnees = { type: champ('type'), note: champ('note'), message: avisMsg.value, entreprise: champ('entreprise'), taille: champ('taille'), ecran: champ('ecran'),
        appareil: window.matchMedia && window.matchMedia('(pointer: coarse)').matches ? 'Téléphone ou tablette' : 'Ordinateur', site: champ('site'), duree: String(Date.now() - avisDebut) };
      avisBouton.disabled = true; dire('Envoi en cours…');
      fetch(avis.action, { method: 'POST', body: JSON.stringify(donnees), headers: { 'Content-Type': 'application/json', Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && j.ok) { avis.reset(); dire('Merci, votre avis est bien arrivé.', 'ok'); }
          else dire((j && j.erreur) || 'L’avis n’a pas pu partir. Réessayez dans un instant.', 'err');
        })
        .catch(function () { dire('L’avis n’a pas pu partir. Vérifiez votre connexion et réessayez.', 'err'); })
        .then(function () { avisBouton.disabled = false; });
    });
  }

  // 3. « Être recontacté » : envoi sans recharger la page (contact.php répond en JSON).
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
