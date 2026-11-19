/* Escapade — estimation du coût d'un voyage, partagée par « Où partir ? » et l'itinéraire,
 * pour que la liste et l'itinéraire détaillé annoncent le même ordre de grandeur.
 *
 *  - accès : aller-retour depuis la ville de départ. Par la terre (train, car, voiture) si les deux lieux
 *    sont sur la même terre et assez proches ; sinon avion (ou ferry, même ordre de prix) : une mer à
 *    traverser n'est jamais un trajet en train.
 *  - séjour : hébergement, repas, visites et transports sur place selon le niveau des prix du pays
 *    (Banque mondiale, 1 = France) et le niveau de confort.
 * Ce sont des estimations, pas des prix réels : la liste affiche une fourchette (économique à confort). */
import { sameLand } from './land.js';

// pays au réseau ferré dense : le train reste le bon choix jusqu'à 800 km
export const RAIL = new Set(['FR', 'MC', 'AD', 'DE', 'IT', 'ES', 'CH', 'AT', 'NL', 'BE', 'LU', 'GB', 'JP', 'KR', 'CN', 'TW', 'CZ', 'DK', 'SE', 'PT', 'PL', 'SK', 'HU', 'SI']);
export const TIERS = [
  { id: 'premium', label: 'Premium', lodge: 2.0, food: 1.6, act: 1.5 },
  { id: 'confort', label: 'Confort', lodge: 1.0, food: 1.0, act: 1.0 },
  { id: 'eco', label: 'Économique', lodge: 0.5, food: 0.6, act: 0.6 },
];

/** Aller-retour par personne depuis `from` jusqu'à `to` ({lat, lon, cc}). km = distance à vol d'oiseau. */
export function accessCost(from, to, month, haversine, km = haversine(from.lat, from.lon, to.lat, to.lon)) {
  const byLand = sameLand(from, to);
  const rail = byLand && RAIL.has(to.cc) && RAIL.has(from.cc || to.cc);
  if (byLand && (km < 500 || (rail && km < 800)))
    return { kind: 'sol', perPerson: Math.round(2 * (25 + km * 0.12)), label: rail ? 'train aller-retour' : 'train ou voiture, aller-retour', km: Math.round(km),
      hours: km / (rail ? 110 : 80) + 0.5 };
  const season = [6, 7, 11].includes(month) ? 1.25 : 1;
  if (!byLand && km < 500)   // mer à traverser, courte distance : vol court ou ferry
    return { kind: 'avion', perPerson: Math.round(2 * (90 + 0.1 * km) * season), label: 'avion ou ferry, aller-retour', km: Math.round(km), hours: km / 780 + 1.2, sea: true };
  const rt = (km < 3000 ? 120 + 0.075 * km : 200 + 0.06 * km) * season;
  return { kind: 'avion', perPerson: Math.round(rt), label: 'avion aller-retour', km: Math.round(km), hours: km / 780 + 1.2, sea: !byLand };
}

/** Hébergement, repas et visites pour un niveau de confort. */
export function stayCost({ pl, travelers, days, month }, tier) {
  const eff = 0.35 + 0.65 * pl;
  const nights = Math.max(1, days - 1), rooms = Math.ceil(travelers / 2);
  const season = [6, 7].includes(month) ? 1.2 : month === 11 ? 1.1 : 1;
  return {
    lodging: rooms * nights * 120 * eff * season * tier.lodge,
    food: travelers * days * 45 * eff * tier.food,
    act: travelers * days * 25 * eff * tier.act,
  };
}
/** Transports sur place en train et bus, pour `km` parcourus entre les étapes. */
export function localTransitCost({ pl, travelers, days }, km) {
  const eff = 0.35 + 0.65 * pl, eff2 = 0.5 + 0.5 * pl;
  return travelers * (km * 0.11 * eff2 + days * 4 * eff);
}

/** Fourchette pour la liste de « Où partir ? » : économique (bas) et confort (haut), trajet compris. */
export function estimateTrip({ from, to, pl, travelers, days, month, haversine }) {
  const acc = from ? accessCost(from, to, month, haversine) : null;
  const travel = acc ? acc.perPerson * travelers : 0;
  // l'itinéraire relie quelques étapes : environ 40 km par jour au-delà de trois jours (aucune pour un court séjour)
  const km = days <= 3 ? 0 : (days - 2) * 40;
  const local = localTransitCost({ pl, travelers, days }, km);
  const tot = tier => { const s = stayCost({ pl, travelers, days, month }, tier); return s.lodging + s.food + s.act + local + travel; };
  return { low: tot(TIERS[2]), high: tot(TIERS[1]), travel, access: acc };
}
