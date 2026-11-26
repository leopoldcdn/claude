<?php
// Avis sur Teamora : formulaire « Aidez-nous à améliorer Teamora » du site, et bouton « Donner mon avis » de la démo
// hébergée (demo/index.html définit TEAMORA_AVIS_URL). Ils partent par e-mail, sans nom ; rien n'est enregistré sur le serveur.
require __DIR__ . '/envoi.php';

function avis_repondre(bool $ok, string $erreur = '', int $code = 200): void { teamora_repondre($ok, $erreur, $code, 'avis'); }

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') avis_repondre(false, 'Méthode non acceptée.', 405);

// Le site et la démo envoient du JSON ; sans JavaScript, le formulaire du site arrive en champs classiques.
$a = json_decode((string) file_get_contents('php://input', false, null, 0, 20000), true);
if (!is_array($a)) $a = $_POST;

// Pièges à robots du formulaire du site, comme dans contact.php : on répond « envoyé » sans rien envoyer.
if (trim((string) ($a['site'] ?? '')) !== '') avis_repondre(true);
if (($a['duree'] ?? '') !== '' && (int) $a['duree'] < 3000) avis_repondre(true);

if (!teamora_configure()) avis_repondre(false, 'Envoi des avis non configuré.', 503);

$types = ['aide' => 'Ça m’aide', 'manque' => 'Il manque quelque chose', 'confus' => 'Ce n’est pas clair', 'bug' => 'Quelque chose ne marche pas'];
$type = is_string($a['type'] ?? null) ? ($types[$a['type']] ?? 'Avis') : 'Avis';
$message = teamora_texte($a['message'] ?? '', 4000);
if ((function_exists('mb_strlen') ? mb_strlen($message, 'UTF-8') : strlen($message)) < 3) avis_repondre(false, 'Avis trop court.', 422);
$note = max(0, min(5, (int) ($a['note'] ?? 0)));

$lignes = ['Avis sur Teamora', '', 'Type : ' . $type . ($note ? " · utilité $note/5" : '')];
foreach (['ecran' => 'Écran', 'profil' => 'Profil', 'appareil' => 'Appareil', 'entreprise' => 'Entreprise', 'taille' => 'Taille'] as $cle => $libelle) {
  $v = teamora_ligne($a[$cle] ?? '', 200);
  if ($v !== '') $lignes[] = "$libelle : $v";
}
$lignes[] = ''; $lignes[] = $message;

$ok = teamora_envoyer('Avis Teamora : ' . $type, implode("\n", $lignes));
avis_repondre($ok, $ok ? '' : 'Envoi impossible pour le moment.', $ok ? 200 : 500);
