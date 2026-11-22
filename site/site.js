// Teamora · site de présentation : l'explorateur des étapes et sa roue, le repère « Votre PME » sur la règle des seuils,
// et l'envoi du formulaire « Être recontacté ». Sans JavaScript, toutes les étapes restent lisibles les unes sous les autres.
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var whenVisible = function (el, fn) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (entries) { if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); fn(); } }, { threshold: 0.35 });
    io.observe(el);
  };

  // 1. Explorateur : familles, étapes, roue. Une seule étape affichée à la fois.
  var details = $$('.detail'), picks = $$('.pick'), fams = $$('.fam'), nodes = $$('.node');
  var hubFam = $('#hub-fam'), hubNom = $('#hub-nom'), panel = $('.panel');
  var famName = {}; fams.forEach(function (f) { famName[f.dataset.fam] = f.firstChild.textContent.trim(); });
  var stepName = {}; picks.forEach(function (p) { stepName[p.dataset.step] = p.textContent.trim(); });
  var current = null;
  var showHub = function (step) { var d = $('#etape-' + step); if (!d || !hubNom) return; hubFam.textContent = famName[d.dataset.fam]; hubNom.textContent = stepName[step]; };
  function select(step, fromWheel) {
    var d = $('#etape-' + step); if (!d) return;
    current = step; var fam = d.dataset.fam;
    details.forEach(function (x) { x.hidden = x !== d; });
    picks.forEach(function (p) { p.hidden = p.dataset.fam !== fam; p.setAttribute('aria-pressed', String(p.dataset.step === step)); });
    fams.forEach(function (f) { f.setAttribute('aria-pressed', String(f.dataset.fam === fam)); });
    nodes.forEach(function (n) { n.setAttribute('aria-pressed', String(n.dataset.step === step)); });
    showHub(step);
    // Sur téléphone, la roue est au-dessus du panneau : on fait descendre jusqu'au détail choisi.
    if (fromWheel && panel && window.innerWidth <= 920) panel.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
  if (details.length) {
    fams.forEach(function (f) { f.addEventListener('click', function () { var first = picks.filter(function (p) { return p.dataset.fam === f.dataset.fam; })[0]; if (first) select(first.dataset.step); }); });
    picks.forEach(function (p) { p.addEventListener('click', function () { select(p.dataset.step); }); });
    nodes.forEach(function (n) {
      n.addEventListener('click', function () { select(n.dataset.step, true); });
      // Survol ou focus d'une rubrique : son nom s'affiche au centre de la roue, comme dans le logiciel.
      n.addEventListener('mouseenter', function () { showHub(n.dataset.step); });
      n.addEventListener('focus', function () { showHub(n.dataset.step); });
      n.addEventListener('mouseleave', function () { showHub(current); });
      n.addEventListener('blur', function () { showHub(current); });
    });
    select(details[0].dataset.step);
  }

  // La roue se déploie un peu quand elle arrive à l'écran (les rubriques restent visibles avant).
  var wheel = $('.wheel');
  if (wheel && !reduce && 'IntersectionObserver' in window) {
    nodes.forEach(function (n, i) { n.style.transitionDelay = (i * 40) + 'ms'; });
    wheel.classList.add('pop');
    whenVisible(wheel, function () {
      wheel.classList.remove('pop');
      setTimeout(function () { nodes.forEach(function (n) { n.style.transitionDelay = ''; }); }, 1100);
    });
  }

  // 2. Le repère « Votre PME » glisse de 38 à 44 salariés quand la règle des seuils apparaît.
  var you = $('.you');
  if (you && !reduce) {
    var from = Number(you.dataset.de), to = Number(you.dataset.a), num = $('b', you);
    var pos = function (n) { return 30 + (n - 20) * 1.2; }; // 20 salariés à 30 %, 50 à 66 % : 1,2 % par salarié
    you.style.setProperty('--x', pos(from) + '%'); num.textContent = String(from);
    whenVisible($('.ruler'), function () {
      var t0 = null, dur = 1400;
      var frame = function (t) {
        if (t0 === null) t0 = t;
        var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3), n = from + (to - from) * e;
        you.style.setProperty('--x', pos(n).toFixed(2) + '%'); num.textContent = String(Math.round(n));
        if (k < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    });
  }

  // 3. « Être recontacté » : envoi sans recharger la page (contact.php répond en JSON).
  var form = $('#form-contact');
  if (!form) return;
  var started = Date.now(), status = $('#f-statut'), button = $('#f-envoyer');
  var apercu = document.documentElement.hasAttribute('data-apercu');
  var say = function (text, kind) { status.textContent = text; status.className = 'status ' + (kind || ''); };
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var bad = Array.prototype.filter.call(form.elements, function (el) { return el.willValidate && !el.checkValidity(); })[0];
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
