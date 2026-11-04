#!/usr/bin/env python3
"""Verification independante de l'ordre de grandeur : « si tout le sel des oceans etait etale sur toutes les terres ».
Entrees (toutes sourcees dans fiche-sources.md) :
  volume des oceans  1 335 000 000 km3        (NOAA NGDC, https://oceanservice.noaa.gov/facts/oceanwater.html)
  salinite moyenne   3,5 % en masse           (NOAA, https://oceanservice.noaa.gov/facts/whysalty.html)
  densite eau de mer 1,025 kg/L en surface    (Wikipedia « Seawater », valeur courante en oceanographie)
  densite du sel     2,17 (halite)            (Wikipedia « Halite »)
  surface des terres 148 940 000 km2          (Wikipedia « Earth »)
Hypotheses : tout le sel est assimile a de la halite pleine, sans porosite ; etalement uniforme."""
V = 1.335e9 * 1e9            # m3
rho_sw = 1025.0              # kg/m3
S = 0.035
rho_salt = 2170.0            # kg/m3
land = 148.94e6 * 1e6        # m2
m = V * rho_sw * S
e = m / rho_salt / land
print(f"masse de sel : {m:.2e} kg")
print(f"epaisseur    : {e:.0f} m  (~{e/0.3048:.0f} pieds)")
print(f"USGS annonce « plus de 500 pieds » = {500*0.3048:.1f} m (la page USGS ecrit 166 m, ce qui ne correspond pas a 500 pieds)")
for s in (0.034, 0.036):
    print(f"  sensibilite salinite {s*100:.1f} % -> {V*rho_sw*s/rho_salt/land:.0f} m")
print(f"  si densite du sel 2,0 -> {m/2000/land:.0f} m ; si 2,5 -> {m/2500/land:.0f} m")
