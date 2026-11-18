// (temporaire) mesure des portées et des séries, à effacer
export async function mesurer(nomPerso) {
  const b = await import('/tools/banc_essai.js'); b.preparer();
  const F = b.F, out = { p: nomPerso };
  const touche = (code, d) => { b.placer(d); b.pas(20); const v = jeu.match.vies[1]; b.tap(code); b.pas(90); const ok = jeu.match.vies[1] < v; b.pas(140); return ok; };
  for (const [nom, code] of [['poing', 'KeyH'], ['pied', 'KeyJ']]) {
    let max = 0;
    for (let d = 0.8; d <= 3.0; d += 0.05) if (touche(code, d)) max = d;
    out[nom] = +max.toFixed(2);
  }
  // Série depuis le contact : H, H, J, H, J (un coup toutes les 0,57 s) : combien touchent ?
  b.placer(0.5); b.pas(30);
  let touches = 0, v = jeu.match.vies[1];
  for (const code of ['KeyH', 'KeyH', 'KeyJ', 'KeyH', 'KeyJ']) {
    b.tap(code); b.pas(31);   // un coup toutes les 0,57 s (au-delà de la règle anti-spam, 0,5 s)
    if (jeu.match.vies[1] < v - 1e-4) touches++;
    v = jeu.match.vies[1];
  }
  out.serie = touches + '/5';
  out.finDist = +(F[1].corps.position.x - F[0].corps.position.x).toFixed(2);
  b.pas(150);
  return JSON.stringify(out);
}
