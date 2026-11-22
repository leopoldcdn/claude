<?php
// Formulaire de contact du site Teamora : vérifie le message et l'envoie par e-mail. Rien n'est enregistré sur le serveur.
require __DIR__ . '/envoi.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { header('Location: index.html#contact', true, 303); exit; }

// Pièges à robots : le champ caché « site » est rempli, ou le formulaire a été envoyé en moins de 3 secondes.
// On répond « envoyé » sans rien envoyer, pour ne pas renseigner le robot.
if (trim((string) ($_POST['site'] ?? '')) !== '') teamora_repondre(true);
if (($_POST['duree'] ?? '') !== '' && (int) $_POST['duree'] < 3000) teamora_repondre(true);

if (!teamora_configure()) teamora_repondre(false, 'Le formulaire n’est pas encore configuré (adresse de destination dans config.php).', 503);

$nom = teamora_ligne($_POST['nom'] ?? '', 120);
$email = teamora_ligne($_POST['email'] ?? '', 160);
$entreprise = teamora_ligne($_POST['entreprise'] ?? '', 160);
$effectif = teamora_ligne($_POST['effectif'] ?? '', 40);
$fonction = teamora_ligne($_POST['fonction'] ?? '', 80);
$message = teamora_texte($_POST['message'] ?? '', 4000);

if ($nom === '' || $message === '') teamora_repondre(false, 'Remplissez votre nom et votre message.', 422);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) teamora_repondre(false, 'Indiquez une adresse e-mail valide.', 422);

$lignes = ["Nouveau message depuis le site Teamora", '', "Nom : $nom", "E-mail : $email"];
if ($entreprise !== '') $lignes[] = "Entreprise : $entreprise";
if ($effectif !== '') $lignes[] = "Effectif : $effectif";
if ($fonction !== '') $lignes[] = "Fonction : $fonction";
$lignes[] = ''; $lignes[] = $message; $lignes[] = '';
$lignes[] = '(Répondez directement à ce message pour écrire à cette personne.)';

$ok = teamora_envoyer('Contact Teamora : ' . $nom . ($entreprise !== '' ? " ($entreprise)" : ''), implode("\n", $lignes), $email);
teamora_repondre($ok, $ok ? '' : 'Le message n’a pas pu partir. Réessayez plus tard.', $ok ? 200 : 500);
