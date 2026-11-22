// Teamora · site de présentation : le repère « Votre PME » qui avance sur la règle, et l'envoi du formulaire de contact.
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Le repère glisse de 38 à 44 salariés au chargement. Sans animation, il reste directement à 44.
  var you = document.querySelector('.you');
  if (you && !reduce) {
    var from = Number(you.dataset.de), to = Number(you.dataset.a), num = you.querySelector('b');
    var pos = function (n) { return 30 + (n - 20) * 1.2; }; // 20 salariés à 30 %, 50 à 66 % : 1,2 % par salarié
    var t0 = null, dur = 1400;
    var frame = function (t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3), n = from + (to - from) * e;
      you.style.setProperty('--x', pos(n).toFixed(2) + '%');
      num.textContent = String(Math.round(n));
      if (k < 1) requestAnimationFrame(frame);
    };
    you.style.setProperty('--x', pos(from) + '%'); num.textContent = String(from);
    setTimeout(function () { requestAnimationFrame(frame); }, 350);
  }

  // 2. Formulaire de contact : envoi sans recharger la page (contact.php répond en JSON).
  var form = document.getElementById('form-contact');
  if (!form) return;
  var started = Date.now(), status = document.getElementById('f-statut'), button = document.getElementById('f-envoyer');
  var apercu = document.documentElement.hasAttribute('data-apercu');
  var say = function (text, kind) { status.textContent = text; status.className = 'status ' + (kind || ''); };
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var bad = Array.prototype.find.call(form.elements, function (el) { return el.willValidate && !el.checkValidity(); });
    if (bad) { bad.focus(); say(bad.type === 'email' ? 'Indiquez une adresse e-mail valide.' : 'Remplissez les champs obligatoires : nom, e-mail et message.', 'err'); return; }
    if (apercu) { say('Aperçu : l’envoi fonctionnera une fois le site en ligne chez votre hébergeur.', 'err'); return; }
    document.getElementById('f-duree').value = String(Date.now() - started);
    button.disabled = true; say('Envoi en cours…');
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j && j.ok) { form.reset(); say('Merci, votre message est bien parti. Nous vous répondons rapidement.', 'ok'); }
        else say((j && j.erreur) || 'Le message n’a pas pu partir. Réessayez dans un instant.', 'err');
      })
      .catch(function () { say('Le message n’a pas pu partir. Vérifiez votre connexion et réessayez.', 'err'); })
      .then(function () { button.disabled = false; });
  });
})();
