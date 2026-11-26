// Teamora · Teamo, l'assistant du site : une barre « Posez-nous vos questions sur Teamora » en bas de l'écran, la
// conversation s'ouvre au-dessus. Teamo ne connaît que le contenu de cette page (lu au chargement) : aucune donnée de
// salarié ne lui est transmise. Dans l'aperçu publié sur claude.ai, il interroge Claude via la capacité « sample », sur le
// compte de la personne qui consulte. Ailleurs, la barre reste cachée tant qu'aucun service de réponse n'est branché
// (en ligne : un script serveur qui appelle l'API Claude ; la clé ne doit jamais se trouver dans le navigateur).
(function () {
  'use strict';
  var zone = document.getElementById('teamo');
  if (!zone || !window.claude || typeof window.claude.use !== 'function') return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var form = $('#teamo-form'), champ = $('#teamo-q'), envoyer = $('#teamo-envoyer'), panneau = $('#teamo-panneau'), fil = $('#teamo-fil');
  var etat = $('#teamo-etat'), nouveau = $('#teamo-nouveau'), fermerB = $('#teamo-fermer'), avatar = $('.teamo-tete .teamo');
  var S = { tours: [], occupe: false, ctl: null, sample: null, ouvert: false };

  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var texte = function (el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; };

  // Ce que sait Teamo : le texte de la page, tel que le visiteur le lit.
  var savoir = (function () {
    var l = [];
    l.push('ACCUEIL : ' + [texte($('#titre')), texte($('.accroche')), texte($('.promesse-texte'))].join(' '));
    l.push('En bref : ' + $$('.reperes li').map(texte).join(' ; ') + '.');
    l.push('Questionnaire de l’accueil (2 questions, puis la démo s’ouvre à la taille de l’entreprise et selon le rôle ; sur téléphone, elle montre l’espace salarié) : ' + $$('.quiz .question').map(texte).join(' / '));
    l.push('', 'LES 12 RUBRIQUES (« De A à Z, au même endroit ») — [clé] nom (famille · rang) : description. Étapes :');
    $$('.rcarte').forEach(function (c) {
      l.push('- [' + c.dataset.step + '] ' + texte($('.rcarte-t', c)) + ' (' + texte($('.reye', c)) + ') : ' + texte($('.rcarte-p', c)) + ' Étapes : ' + $$('.rcarte-d li', c).map(texte).join(' / '));
    });
    var ec = $('.ec');
    if (ec) l.push('', 'EXPERTS-COMPTABLES : ' + texte($('.ec-t', ec)) + ' Bouton « ' + texte($('.btn', ec)) + ' » vers le formulaire « Être recontacté ».');
    l.push('', 'QUESTIONS FRÉQUENTES');
    $$('.faq details').forEach(function (d) { l.push('- ' + texte($('summary', d)) + ' ' + texte($('p', d))); });
    ['avis', 'contact'].forEach(function (id) {
      var a = $('#' + id + ' .aside-contact');
      if (a) l.push('', (id === 'avis' ? 'DONNER SON AVIS' : 'ÊTRE RECONTACTÉ') + ' : ' + $$('h2, p:not(:has(.btn))', a).map(texte).join(' '));
    });
    return l.join('\n');
  })();

  var REGLES = 'Tu es Teamo, l’assistant du site de présentation de Teamora, un logiciel RH pour les PME, encore en phase de test. '
    + 'Tu réponds aux visiteurs (dirigeants, gestionnaires des RH, management, experts-comptables) en français, en les vouvoyant, de façon brève et concrète : 2 à 5 phrases, ou une courte liste. '
    + 'Appuie-toi UNIQUEMENT sur le CONTENU DU SITE ci-dessous. N’invente rien : ni fonction, ni prix, ni date, ni intégration, ni client, ni chiffre. '
    + 'Si le contenu ne répond pas, dis-le simplement et propose d’écrire à l’équipe (formulaire « Être recontacté ») ou d’essayer la démo. '
    + 'Pour une question de droit du travail, donne au plus l’orientation présente sur le site et rappelle qu’un professionnel du droit social doit valider. '
    + 'Ne réponds pas aux questions sans rapport avec Teamora. Ne donne aucun avis sur une situation individuelle de salarié ; '
    + 'si le visiteur écrit des informations personnelles (nom, salaire, santé…), ne les reprends pas et rappelle-lui de ne pas en indiquer ici. '
    + 'Quand c’est utile, termine par UN lien sous la forme exacte [[aller:CLE|Texte du bouton]], avec CLE parmi : demo (essayer la démo), contact (être recontacté), avis (donner son avis), '
    + 'ou la clé d’une rubrique (entre crochets dans la liste des rubriques) pour l’ouvrir dans le carrousel. '
    + 'Mise en forme permise : **gras** et listes avec « - ». Pas de titres, pas d’émoji.\n\nCONTENU DU SITE\n' + savoir;
  var SUGGESTIONS = ['Que couvrent les 12 rubriques ?', 'Teamora remplace-t-il mon logiciel de paie ?', 'Ma convention collective est-elle prise en compte ?'];

  // Teamo, la mascotte du logiciel : une bulle souriante qui cligne des yeux et regarde de côté quand il réfléchit.
  var n = 0;
  var mascotte = function (cls) {
    var g = 'teamo-g' + (n += 1);
    return '<svg class="teamo ' + (cls || '') + '" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f46e5"/><stop offset="1" stop-color="#0ea5c6"/></linearGradient></defs>'
      + '<circle cx="32" cy="32" r="32" fill="url(#' + g + ')"/><path d="M32 10.5v5.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><circle class="teamo-dot" cx="32" cy="9" r="3.4" fill="#fde68a"/>'
      + '<path d="M13.5 31c0-8.3 7.6-14.5 18.5-14.5S50.5 22.7 50.5 31v5c0 8.3-7.6 13.5-18.5 13.5h-5.6l-7.6 5.6 1.7-7C15.6 45.6 13.5 41.6 13.5 36z" fill="#fff"/>'
      + '<g class="teamo-eyes"><ellipse cx="25" cy="32.5" rx="3.1" ry="3.7" fill="#1e1b4b"/><ellipse cx="39" cy="32.5" rx="3.1" ry="3.7" fill="#1e1b4b"/><circle cx="26.1" cy="31.2" r="1" fill="#fff"/><circle cx="40.1" cy="31.2" r="1" fill="#fff"/></g>'
      + '<path d="M26.5 40.2c3.2 3 7.8 3 11 0" stroke="#1e1b4b" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="20.2" cy="38.6" r="2.3" fill="#f9a8d4" opacity=".85"/><circle cx="43.8" cy="38.6" r="2.3" fill="#f9a8d4" opacity=".85"/></svg>';
  };

  // Réponses : **gras**, listes « - », et un lien [[aller:CLE|Texte]] vers la démo, un formulaire ou une rubrique.
  var FLECHE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var cles = {}; ['demo', 'contact', 'avis'].forEach(function (k) { cles[k] = 1; }); $$('.rcarte').forEach(function (c) { cles[c.dataset.step] = 1; });
  var lien = function (k, l) {
    if (k === 'demo') { var e = $('.essai'); return '<a class="teamo-lien" href="' + esc(e ? e.getAttribute('href') : 'demo/') + '">' + l + FLECHE + '</a>'; }
    if (k === 'contact' || k === 'avis') return '<a class="teamo-lien" href="#' + k + '" data-teamo-quitte>' + l + FLECHE + '</a>';
    return '<button type="button" class="teamo-lien" data-rubrique="' + k + '">' + l + FLECHE + '</button>';
  };
  var miseEnForme = function (t) {
    return esc(t).split(/\n{2,}/).map(function (bloc) {
      var lignes = bloc.split('\n').filter(function (x) { return x.trim(); });
      if (!lignes.length) return '';
      var fmt = function (s) { return s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\[\[aller:([a-z0-9-]+)\|([^\]]{1,60})\]\]/g, function (m, k, l) { return cles[k] ? lien(k, l) : l; }); };
      if (lignes.every(function (x) { return /^\s*[-•]\s+/.test(x); })) return '<ul>' + lignes.map(function (x) { return '<li>' + fmt(x.replace(/^\s*[-•]\s+/, '')) + '</li>'; }).join('') + '</ul>';
      return '<p>' + fmt(lignes.join('<br>')) + '</p>';
    }).join('');
  };
  // Pendant l'écriture, un lien pas encore terminé (« [[aller:… ») n'apparaît pas.
  var enCours = function (t) { return t.replace(/\[\[[^\]]*\]?$/, ''); };

  var dire = function (msg) { etat.textContent = msg; };
  var majBouton = function () {
    envoyer.classList.toggle('stop', S.occupe);
    envoyer.setAttribute('aria-label', S.occupe ? 'Arrêter la réponse' : 'Envoyer la question');
    envoyer.innerHTML = S.occupe ? '<span class="carre"></span>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
    envoyer.disabled = !S.occupe && (!S.sample || !champ.value.trim());
  };
  var dessiner = function () {
    var bot = function (inner, cls) { return '<div class="teamo-ligne bot' + (cls ? ' ' + cls : '') + '"><span class="teamo-mini">' + mascotte() + '</span><div class="teamo-msg">' + inner + '</div></div>'; };
    fil.innerHTML = S.tours.length ? S.tours.map(function (t) {
      if (t.role === 'user') return '<div class="teamo-ligne moi"><div class="teamo-msg">' + esc(t.content) + '</div></div>';
      return t.content ? bot(miseEnForme(t.content), t.erreur ? 'erreur' : '') : bot('<span class="teamo-points" role="img" aria-label="Teamo réfléchit"><i></i><i></i><i></i></span>', 'attente');
    }).join('')
      : '<div class="teamo-bonjour">' + mascotte() + '<b>Bonjour, je suis Teamo</b><p>Je réponds à vos questions sur Teamora, à partir des informations de ce site.</p></div>'
        + '<div class="teamo-sugg"><p>Pour commencer</p>' + SUGGESTIONS.map(function (q) { return '<button type="button" class="teamo-puce" data-q="' + esc(q) + '">' + esc(q) + '</button>'; }).join('') + '</div>';
    var reflechit = S.occupe && !S.tours[S.tours.length - 1].content;
    avatar.classList.toggle('think', reflechit);
    dire(reflechit ? 'réfléchit…' : S.occupe ? 'écrit…' : 'L’assistant Teamora');
    nouveau.hidden = !S.tours.length;
    majBouton();
    fil.scrollTop = fil.scrollHeight;
  };
  var ecrire = function (rep) {
    var m = $('.teamo-ligne.bot:last-child', fil); if (!m) return;
    m.classList.remove('attente'); $('.teamo-msg', m).innerHTML = miseEnForme(enCours(rep.content));
    avatar.classList.remove('think'); dire('écrit…');
    fil.scrollTop = fil.scrollHeight;
  };

  var ouvrir = function () {
    if (S.ouvert) return;
    S.ouvert = true; panneau.hidden = false; zone.classList.add('ouverte'); dessiner();
  };
  var fermer = function () {
    if (!S.ouvert) return;
    S.ouvert = false; panneau.hidden = true; zone.classList.remove('ouverte');
    if (!S.sample) masquer();
  };
  var montrer = function () { zone.hidden = false; document.documentElement.classList.add('avec-teamo'); majBouton(); };
  var masquer = function () { zone.hidden = true; document.documentElement.classList.remove('avec-teamo'); };

  // Une question : les consignes et le contenu du site dans le premier message, puis les 6 derniers échanges réussis.
  var demander = function (q) {
    q = (q || '').trim(); if (!q || S.occupe || !S.sample) return;
    var paires = [];
    for (var i = 0; i + 1 < S.tours.length; i += 2) if (S.tours[i + 1].content && !S.tours[i + 1].erreur) paires.push([S.tours[i].content, S.tours[i + 1].content]);
    var msgs = [];
    paires.slice(-6).forEach(function (p) { msgs.push({ role: 'user', content: p[0] }, { role: 'assistant', content: p[1] }); });
    msgs.push({ role: 'user', content: q });
    msgs[0] = { role: 'user', content: REGLES + '\n\nQUESTION DU VISITEUR : ' + msgs[0].content };
    champ.value = '';
    S.tours.push({ role: 'user', content: q });
    var rep = { role: 'assistant', content: '' }; S.tours.push(rep);
    S.occupe = true; ouvrir(); dessiner();
    var ctl = new AbortController(); S.ctl = ctl;
    S.sample(msgs, { cache: false, modelTier: 'quick', signal: ctl.signal, onText: function (o) { rep.content = o.text; ecrire(rep); } })
      .then(function (r) { rep.content = r.text + (r.truncated ? '\n\n(Réponse coupée : posez une question plus précise.)' : ''); })
      .catch(function (e) {
        var code = e && e.code, partiel = (e && e.text) || '';
        if (/^(not_granted|sampling_disabled|not_declared|capability_disabled|capability_removed)$/.test(code)) {
          rep.content = 'Teamo n’est pas disponible dans cette vue.'; rep.erreur = true; S.sample = null;
        } else if (code === 'cancelled') rep.content = partiel ? partiel + '\n\n(Interrompu.)' : 'Question annulée.';
        else if (code === 'rate_limited') { rep.content = 'Trop de questions d’un coup : réessayez dans un instant.'; rep.erreur = true; }
        else if (code === 'refused') { rep.content = 'Je ne peux pas répondre à cette question. Posez-la autour de Teamora.'; rep.erreur = true; }
        else if (code === 'session_expired') { rep.content = 'Votre session Claude a expiré : reconnectez-vous, puis réessayez.'; rep.erreur = true; }
        else { rep.content = partiel ? partiel + '\n\n(Réponse interrompue : réessayez.)' : 'Je n’ai pas pu répondre (problème de connexion). Réessayez.'; rep.erreur = !partiel; }
      })
      .then(function () {
        S.occupe = false; S.ctl = null; dessiner();
        // Le bouton « Arrêter » redevient « Envoyer », grisé : le focus revient au champ plutôt que de se perdre.
        var a = document.activeElement; if (S.ouvert && (a === envoyer || a === document.body)) champ.focus();
      });
  };

  // Une rubrique citée par Teamo : la page descend au carrousel et la carte s'ouvre.
  var allerRubrique = function (k) {
    var c = $('.rcarte[data-step="' + k + '"]'); if (!c) return;
    fermer();
    var sec = document.getElementById('logiciel'); if (sec) sec.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    var plus = $('.plus', c);
    if (plus && !c.classList.contains('ouvert')) plus.click();
    if (plus) setTimeout(function () { plus.focus({ preventScroll: true }); }, reduce ? 0 : 700);
  };

  champ.addEventListener('input', function () { majBouton(); if (champ.value.trim()) ouvrir(); });
  champ.addEventListener('pointerdown', ouvrir);
  champ.addEventListener('keydown', function (e) { if (e.key === 'ArrowUp' && !champ.value && S.ouvert) { var d = $$('.teamo-puce, .teamo-lien', fil).pop(); if (d) { e.preventDefault(); d.focus(); } } });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (S.occupe) { if (S.ctl) S.ctl.abort(); return; }
    demander(champ.value);
  });
  fil.addEventListener('click', function (e) {
    var p = e.target.closest('.teamo-puce'); if (p) { demander(p.dataset.q); champ.focus(); return; }
    var r = e.target.closest('[data-rubrique]'); if (r) { allerRubrique(r.dataset.rubrique); return; }
    if (e.target.closest('[data-teamo-quitte]')) fermer();
  });
  nouveau.addEventListener('click', function () { if (S.ctl) S.ctl.abort(); S.tours = []; dessiner(); champ.focus(); });
  fermerB.addEventListener('click', function () { fermer(); champ.focus(); });
  zone.addEventListener('keydown', function (e) { if (e.key === 'Escape' && S.ouvert) { e.stopPropagation(); fermer(); champ.focus(); } });
  // Un clic ailleurs, ou le focus clavier qui quitte Teamo, referme la conversation (elle est gardée).
  document.addEventListener('pointerdown', function (e) { if (S.ouvert && !zone.contains(e.target)) fermer(); });
  zone.addEventListener('focusout', function () { setTimeout(function () { var a = document.activeElement; if (S.ouvert && a && a !== document.body && !zone.contains(a)) fermer(); }, 0); });
  // Sur téléphone, la barre s'efface pendant la saisie dans un autre formulaire (le clavier occupe déjà le bas de l'écran).
  var petit = window.matchMedia('(max-width: 920px)');
  var saisie = 'textarea, select, input:not([type="radio"]):not([type="checkbox"]):not([type="submit"]):not([type="button"])';
  var discret = function () { var a = document.activeElement; zone.classList.toggle('discret', petit.matches && !!a && !zone.contains(a) && a.matches(saisie)); };
  document.addEventListener('focusin', discret);
  document.addEventListener('focusout', function () { setTimeout(discret, 0); });

  // Sur un petit téléphone, une invite plus courte qui tient dans le champ.
  var etroit = window.matchMedia('(max-width: 480px)');
  var invite = function () { champ.placeholder = etroit.matches ? 'Une question sur Teamora ?' : 'Posez-nous vos questions sur Teamora'; };
  invite(); if (etroit.addEventListener) etroit.addEventListener('change', invite);

  window.claude.use('sample').then(function (fn) { if (!fn) return; S.sample = fn; montrer(); }).catch(function () {});
})();
