<?php
// Formulaire « Être recontacté » du site Teamora : vérifie la demande et l'envoie par e-mail. Rien n'est enregistré sur le serveur.
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
$telephone = preg_replace('/[^0-9+ .()-]/', '', teamora_ligne($_POST['telephone'] ?? '', 30));
$message = teamora_texte($_POST['message'] ?? '', 4000);

if ($nom === '') teamora_repondre(false, 'Indiquez votre nom.', 422);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) teamora_repondre(false, 'Indiquez une adresse e-mail valide.', 422);

$lignes = ["Demande de rappel depuis le site Teamora", '', "Nom : $nom", "E-mail : $email"];
if ($telephone !== '') $lignes[] = "Téléphone : $telephone";
if ($entreprise !== '') $lignes[] = "Entreprise : $entreprise";
if ($effectif !== '') $lignes[] = "Effectif : $effectif";
if ($fonction !== '') $lignes[] = "Fonction : $fonction";
$lignes[] = ''; $lignes[] = $message !== '' ? $message : '(pas de message)'; $lignes[] = '';
$lignes[] = '(Répondez directement à ce message pour écrire à cette personne.)';

$ok = teamora_envoyer('Être recontacté : ' . $nom . ($entreprise !== '' ? " ($entreprise)" : ''), implode("\n", $lignes), $email);
teamora_repondre($ok, $ok ? '' : 'Le message n’a pas pu partir. Réessayez plus tard.', $ok ? 200 : 500);
