<?php
// Fonctions communes à contact.php et avis.php : réponse au navigateur, nettoyage des champs, envoi par e-mail.
// Rien n'est enregistré sur le serveur : chaque message part par e-mail vers TEAMORA_DESTINATAIRE (config.php).
require __DIR__ . '/config.php';

function teamora_configure(): bool {
  return TEAMORA_DESTINATAIRE !== 'contact@votre-domaine.fr' && filter_var(TEAMORA_DESTINATAIRE, FILTER_VALIDATE_EMAIL) && filter_var(TEAMORA_EXPEDITEUR, FILTER_VALIDATE_EMAIL);
}

// Réponse JSON pour le script de la page ; sans JavaScript, retour au formulaire avec un message
// (ancre #contact-envoye ou #contact-erreur, #avis-envoye ou #avis-erreur pour les avis).
function teamora_repondre(bool $ok, string $erreur = '', int $code = 200, string $ancre = 'contact'): void {
  $json = stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;
  if (!$json) { header('Location: index.html#' . $ancre . ($ok ? '-envoye' : '-erreur'), true, 303); exit; }
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'erreur' => $erreur], JSON_UNESCAPED_UNICODE);
  exit;
}

function teamora_couper(string $v, int $max): string {
  return function_exists('mb_substr') ? mb_substr($v, 0, $max, 'UTF-8') : substr($v, 0, $max);
}
// Champ d'une ligne : retours à la ligne supprimés (ils permettraient d'ajouter des en-têtes à l'e-mail).
function teamora_ligne($v, int $max): string {
  return teamora_couper(trim(preg_replace('/[\r\n\t]+/', ' ', (string) $v)), $max);
}
function teamora_texte($v, int $max): string {
  return teamora_couper(trim(str_replace("\r\n", "\n", (string) $v)), $max);
}

function teamora_envoyer(string $sujet, string $corps, string $repondreA = ''): bool {
  $entetes = [
    'From: Teamora <' . TEAMORA_EXPEDITEUR . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
  ];
  if ($repondreA !== '' && filter_var($repondreA, FILTER_VALIDATE_EMAIL)) $entetes[] = 'Reply-To: ' . $repondreA;
  return mail(TEAMORA_DESTINATAIRE, '=?UTF-8?B?' . base64_encode($sujet) . '?=', $corps, implode("\r\n", $entetes));
}
