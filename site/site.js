// Teamora · site de présentation : l'explorateur des étapes et sa roue, le repère « Votre PME » sur la règle des seuils,
// les aperçus animés et l'envoi du formulaire « Être recontacté ». Sans JavaScript, toutes les étapes restent lisibles les unes sous les autres.
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var whenVisible = function (el, fn) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (entries) { if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); fn(); } }, { threshold: 0.35 });
    io.observe(el);
  };

  // 0. En-tête : une ombre dès que la page défile, et la rubrique en cours soulignée dans le menu.
  var top = $('.top');
  if (top) { var onScroll = function () { top.classList.toggle('scrolled', window.scrollY > 8); }; window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); }
  var navLinks = $$('.nav a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (es) {
      // En haut de page (accroche), aucune rubrique n'est soulignée.
      es.forEach(function (e) { if (!e.isIntersecting) return; navLinks.forEach(function (a) { a.setAttribute('aria-current', String(!!e.target.id && a.getAttribute('href') === '#' + e.target.id)); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) { var t = $(a.getAttribute('href')); if (t && t.tagName === 'SECTION') spy.observe(t); });
    if ($('.hero')) spy.observe($('.hero'));
  }

  // 1. Explorateur : familles, étapes, roue. Une seule étape affichée à la fois.
  var details = $$('.detail'), picks = $$('.pick'), fams = $$('.fam'), nodes = $$('.node');
  var hubFam = $('#hub-fam'), hubNom = $('#hub-nom'), panel = $('.panel');
  var famName = {}; fams.forEach(function (f) { famName[f.dataset.fam] = f.firstChild.textContent.trim(); });
  var stepName = {}; picks.forEach(function (p) { stepName[p.dataset.step] = p.textContent.trim(); });
  var current = null;
  var showHub = function (step) { var d = $('#etape-' + step); if (!d || !hubNom) return; hubFam.textContent = famName[d.dataset.fam]; hubNom.textContent = stepName[step]; };
  function select(step, fromWheel) {
    var d = $('#etape-' + step); if (!d) return;
    var fam = d.dataset.fam;
    var changed = current !== null && current !== step;
    details.forEach(function (x) { x.hidden = x !== d; });
    if (changed && !reduce) { d.classList.remove('enter'); void d.offsetWidth; d.classList.add('enter'); }
    picks.forEach(function (p) { p.hidden = p.dataset.fam !== fam; p.setAttribute('aria-pressed', String(p.dataset.step === step)); });
    fams.forEach(function (f) { f.setAttribute('aria-pressed', String(f.dataset.fam === fam)); });
    nodes.forEach(function (n) { n.setAttribute('aria-pressed', String(n.dataset.step === step)); });
    current = step; showHub(step);
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
    // La ligne des étapes garde la hauteur de la famille la plus fournie (« Gérer » passe sur deux lignes) : le panneau ne saute pas.
    var picksBox = $('.picks');
    var equalize = function () {
      if (!picksBox) return;
      var fam = $('#etape-' + current).dataset.fam, max = 0;
      picksBox.style.minHeight = '';
      fams.forEach(function (f) { picks.forEach(function (p) { p.hidden = p.dataset.fam !== f.dataset.fam; }); max = Math.max(max, picksBox.offsetHeight); });
      picks.forEach(function (p) { p.hidden = p.dataset.fam !== fam; });
      picksBox.style.minHeight = max + 'px';
    };
    equalize();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(equalize);
    var resizeTimer = null;
    window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(equalize, 150); });
  }

  // Liens des exemples : « Voir l'étape… » choisit l'étape dans l'explorateur, « Voir l'aperçu… » lance le bon aperçu.
  $$('[data-step]').forEach(function (a) { if (a.tagName !== 'A') return; a.addEventListener('click', function () { if (details.length) select(a.dataset.step); }); });
  $$('a[data-apercu]').forEach(function (a) { a.addEventListener('click', function () { document.dispatchEvent(new CustomEvent('teamora:apercu', { detail: a.dataset.apercu })); }); });

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


  // 3. Aperçus animés : les vraies captures de la démo, enchaînées avec GSAP (curseur, zoom, surlignage).
  // Rien n'est redessiné : chaque image est une capture de la démo (site/outils/apercus.js), les positions viennent de ses éléments.
  var player = $('#player'), IM = window.TEAMORA_IMAGES, G = window.gsap;
  if (player && IM && G) (function () {
    var ALT = {
      'matin-1': 'Accueil de Teamora : le bloc Aujourd’hui avec cinq actions datées, et la roue des rubriques repliée.',
      'matin-2': 'La roue de l’accueil déployée : douze rubriques autour du centre Collaborateurs.',
      'matin-3': 'La liste À traiter : les actions en retard, chacune avec sa date et son bouton.',
      'matin-4': 'Écran Absences, onglet À valider : quatre demandes avec les boutons Valider et Refuser.',
      'matin-5': 'La demande de Hugo Laurent a quitté la liste ; message « Demande de Hugo Laurent validée ».',
      'obligations-1': 'Obligations selon l’effectif, avec un effectif simulé à 52 : indicateurs, évolution de l’effectif et alertes.',
      'obligations-2': 'Onglet Index égalité : calcul indicatif de l’index 2026 et bloc Publication.',
      'telephone-1': 'Espace salarié sur téléphone : boutons Poser une absence, Bulletin de septembre, Écrire aux RH, et la liste À faire.',
      'telephone-2': 'Formulaire de demande d’absence sur téléphone, avec le solde après validation.',
      'telephone-3': 'Bulletin de paie de septembre 2026 ouvert sur téléphone, avec le bouton Imprimer ou enregistrer en PDF.',
    };
    var CH = {
      matin: { steps: [
        { f: 'matin-1', cap: 'Chaque matin, l’accueil affiche les cinq actions les plus urgentes, avec leur date.', ring: 'aujourdhui', hold: 2.8, to: 'roue' },
        { f: 'matin-2', cap: 'Survolez la roue : les douze rubriques du parcours salarié s’ouvrent.', hold: 2.4, to: 'toutVoir', ring: 'toutVoir', click: true },
        { f: 'matin-3', cap: '« À traiter » range tout par urgence : en retard, cette semaine, plus tard. Une ligne et un bouton par action.', zoom: 'tache', z: 1.6, ring: 'tache', hold: 2.8, to: 'bouton', click: true },
        { f: 'matin-4', cap: 'Le bouton mène au bon écran : ici, les absences à valider.', zoom: 'valider', z: 1.5, hold: 2.2, to: 'valider', click: true },
        { f: 'matin-5', cap: 'C’est validé : le solde de congés est mis à jour et Hugo Laurent est prévenu.', zoom: 'toast', z: 1.5, ring: 'toast', hold: 3.2 },
      ] },
      obligations: { steps: [
        { f: 'obligations-1', cap: 'Dans la démo, on simule un effectif de 52 salariés depuis plus d’un an.', hold: 2.8 },
        { f: 'obligations-1', cap: 'Teamora calcule l’effectif moyen sur 12 mois, en équivalent temps plein.', zoom: 'effectif', z: 1.9, ring: 'effectif', hold: 2.8 },
        { f: 'obligations-1', cap: 'Chaque obligation arrive avec sa date : l’index égalité 2026 est à publier avant le 1er mars 2027.', zoom: 'index', z: 1.7, ring: 'index', hold: 2.6, to: 'ouvrir', click: true },
        { f: 'obligations-2', cap: 'Un clic ouvre l’écran où agir : le calcul indicatif de l’index et sa publication.', ring: 'onglet', hold: 3.4 },
      ] },
      telephone: { phone: true, steps: [
        { f: 'telephone-1', cap: 'Chaque salarié a son espace sur téléphone : ses actions rapides et ce qui l’attend.', hold: 2.6, to: 'absence', click: true },
        { f: 'telephone-2', cap: 'Poser une absence : le solde après validation s’affiche avant l’envoi.', hold: 3.4 },
        { f: 'telephone-1', cap: 'Le dernier bulletin est à portée de main.', hold: 1.2, to: 'bulletin', click: true },
        { f: 'telephone-3', cap: 'Le bulletin de septembre s’ouvre, prêt à enregistrer en PDF.', hold: 3.4 },
      ] },
    };
    var ORDER = ['matin', 'obligations', 'telephone'];
    var stage = $('.stage', player), cap = $('#player-caption'), dotsBox = $('#player-dots'), btn = $('#player-play');
    var chaps = $$('.chap', player), cur = null, tl = null, auto = !reduce, seen = false, userPaused = false;
    var pct = function (n) { return (n * 100).toFixed(3) + '%'; };
    var centre = function (b) { return [b[0] + b[2] / 2, b[1] + b[3] / 2]; };
    var CURSOR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3l14 8.2-6.2 1.3 3.6 6.6-2.6 1.4-3.6-6.6L5 18.3z" fill="#fff" stroke="#141834" stroke-width="1.6" stroke-linejoin="round"/></svg>';

    function build(key) {
      var C = CH[key], frames = [];
      C.steps.forEach(function (st) { if (frames.indexOf(st.f) < 0) frames.push(st.f); });
      var imgs = frames.map(function (f, i) { var m = IM[f]; return '<img class="frame' + (i ? '' : ' on') + '" data-f="' + f + '" src="' + m.img + '" width="' + Math.round(m.w * (C.phone ? 2 : 1.5)) + '" height="' + Math.round(m.h * (C.phone ? 2 : 1.5)) + '" alt="' + ALT[f] + '" decoding="async"' + (i ? ' loading="lazy"' : '') + '>'; }).join('');
      stage.innerHTML = '<div class="screen ' + (C.phone ? 'phone' : 'desk') + '"><div class="cam">' + imgs + '<span class="ring"></span><span class="ripple"></span>' + (C.phone ? '' : '<span class="cursor">' + CURSOR + '</span>') + '</div></div><span class="pbar" aria-hidden="true"></span>';
      var cam = $('.cam', stage), ring = $('.ring', stage), ripple = $('.ripple', stage), cursor = $('.cursor', stage), pbar = $('.pbar', stage);
      var img = {}; $$('.frame', stage).forEach(function (x) { img[x.dataset.f] = x; });
      dotsBox.innerHTML = C.steps.map(function (s, i) { return '<button type="button" class="pdot" data-i="' + i + '" aria-label="Étape ' + (i + 1) + ' sur ' + C.steps.length + '"></button>'; }).join('');
      var dots = $$('.pdot', dotsBox);
      var setStep = function (i) { cap.textContent = C.steps[i].cap; dots.forEach(function (d, k) { d.setAttribute('aria-current', String(k === i)); }); };
      var t = G.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
      G.set(cam, { xPercent: 0, yPercent: 0, scale: 1, transformOrigin: '0 0' });
      if (cursor) G.set(cursor, { left: '78%', top: '86%', scale: 1 });
      var shown = C.steps[0].f, zoomed = 0;
      C.steps.forEach(function (st, i) {
        var B = IM[st.f].boites || {}, next = C.steps[i + 1];
        t.addLabel('s' + i).call(setStep, [i]);
        if (st.f !== shown) {
          var others = frames.filter(function (f) { return f !== st.f; }).map(function (f) { return img[f]; });
          t.to(img[st.f], { opacity: 1, duration: 0.45, ease: 'none' }).to(others, { opacity: 0, duration: 0.45, ease: 'none' }, '<');
          shown = st.f;
        }
        if (st.zoom && B[st.zoom]) {
          var c = centre(B[st.zoom]), z = st.z || 1.5;
          var xp = Math.min(0, Math.max((1 - z) * 100, (0.5 - c[0] * z) * 100)), yp = Math.min(0, Math.max((1 - z) * 100, (0.5 - c[1] * z) * 100));
          t.to(cam, { xPercent: xp, yPercent: yp, scale: z, duration: 1 });
          if (cursor) t.to(cursor, { scale: 1 / z, duration: 1 }, '<');
          zoomed = z;
        }
        if (st.ring && B[st.ring]) {
          var r = B[st.ring];
          t.set(ring, { left: pct(r[0]), top: pct(r[1]), width: pct(r[2]), height: pct(r[3]) }).to(ring, { opacity: 1, duration: 0.3, ease: 'none' });
        }
        t.to({}, { duration: reduce ? 0.6 : st.hold + 0.4 }); // temps de lecture de la légende
        if (st.to && B[st.to]) {
          var p = centre(B[st.to]);
          if (cursor) t.to(cursor, { left: pct(p[0]), top: pct(p[1]), duration: 0.9 });
          if (st.click) {
            t.set(ripple, { left: pct(p[0]), top: pct(p[1]), scale: 0.3, opacity: 0.95 }).to(ripple, { scale: 1.7, opacity: 0, duration: 0.55, ease: 'power1.out' });
            if (cursor) t.to(cursor, { scale: (zoomed ? 1 / zoomed : 1) * 0.85, duration: 0.12, yoyo: true, repeat: 1, ease: 'none' }, '<');
          }
          t.to({}, { duration: 0.35 });
        }
        if (st.ring) t.to(ring, { opacity: 0, duration: 0.25, ease: 'none' });
        var keep = next && next.zoom && next.f === st.f;
        if (zoomed && !keep) { t.to(cam, { xPercent: 0, yPercent: 0, scale: 1, duration: 0.8 }); if (cursor) t.to(cursor, { scale: 1, duration: 0.8 }, '<'); zoomed = 0; }
      });
      t.to({}, { duration: 0.6 }).call(function () { if (auto && !userPaused) show(ORDER[(ORDER.indexOf(key) + 1) % ORDER.length], true); });
      // Barre de progression : elle se remplit pendant chaque étape (on voit que l'aperçu avance tout seul).
      C.steps.forEach(function (s, i) { var a = t.labels['s' + i], z = i + 1 < C.steps.length ? t.labels['s' + (i + 1)] : t.duration(); t.fromTo(pbar, { scaleX: 0 }, { scaleX: 1, duration: z - a, ease: 'none', immediateRender: false }, a); });
      dots.forEach(function (d) { d.addEventListener('click', function () { tl.seek('s' + d.dataset.i); if (!reduce) play(); else pause(true); }); });
      setStep(0);
      return t;
    }
    function play() { if (!tl) return; tl.play(); player.classList.add('playing'); btn.setAttribute('aria-label', 'Mettre l’aperçu en pause'); }
    function pause(byUser) { if (!tl) return; tl.pause(); player.classList.remove('playing'); btn.setAttribute('aria-label', 'Lire l’aperçu'); if (byUser) userPaused = true; }
    function show(key, autoplay) {
      if (tl) tl.kill();
      cur = key; chaps.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.chap === key)); });
      tl = build(key);
      if (autoplay) play(); else pause();
    }
    btn.hidden = false;
    btn.addEventListener('click', function () { if (tl && tl.isActive()) pause(true); else { userPaused = false; if (tl && tl.progress() === 1) tl.restart(); play(); } });
    chaps.forEach(function (c) { c.addEventListener('click', function () { userPaused = reduce; show(c.dataset.chap, !reduce); }); });
    show('matin', false);
    document.addEventListener('teamora:apercu', function (e) { if (CH[e.detail]) { userPaused = reduce; show(e.detail, !reduce); } });
    // Lecture automatique quand l'aperçu est à l'écran (sauf si le visiteur a demandé moins d'animations ou mis en pause).
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { seen = true; if (auto && !userPaused) play(); } else if (seen) pause(); });
      }, { threshold: 0.4 }).observe(player);
    }
  })();

  // 4. « Être recontacté » : envoi sans recharger la page (contact.php répond en JSON).
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
