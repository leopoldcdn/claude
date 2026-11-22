<?php
// Avis donnés dans la démo hébergée sur le site (bouton « Donner mon avis ») : ils partent par e-mail, sans nom.
// Rien n'est enregistré sur le serveur. La démo appelle ce script parce que demo/index.html définit TEAMORA_AVIS_URL.
require __DIR__ . '/envoi.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') teamora_repondre(false, 'Méthode non acceptée.', 405);
if (!teamora_configure()) teamora_repondre(false, 'Envoi des avis non configuré.', 503);

$a = json_decode((string) file_get_contents('php://input', false, null, 0, 20000), true);
if (!is_array($a)) teamora_repondre(false, 'Avis illisible.', 400);

$types = ['aide' => 'Ça m’aide', 'manque' => 'Il manque quelque chose', 'confus' => 'Ce n’est pas clair', 'bug' => 'Quelque chose ne marche pas'];
$type = $types[$a['type'] ?? ''] ?? 'Avis';
$message = teamora_texte($a['message'] ?? '', 4000);
if (strlen($message) < 3) teamora_repondre(false, 'Avis trop court.', 422);
$note = max(0, min(5, (int) ($a['note'] ?? 0)));

$lignes = ['Avis sur la démo Teamora', '', 'Type : ' . $type . ($note ? " · utilité $note/5" : '')];
foreach (['ecran' => 'Écran', 'profil' => 'Profil', 'appareil' => 'Appareil', 'entreprise' => 'Entreprise', 'taille' => 'Taille'] as $cle => $libelle) {
  $v = teamora_ligne($a[$cle] ?? '', 200);
  if ($v !== '') $lignes[] = "$libelle : $v";
}
$lignes[] = ''; $lignes[] = $message;

$ok = teamora_envoyer('Avis démo Teamora : ' . $type, implode("\n", $lignes));
teamora_repondre($ok, $ok ? '' : 'Envoi impossible pour le moment.', $ok ? 200 : 500);
