/**
 * Injecte un bloc de données structurées JSON-LD (schema.org).
 *
 * Encodage des caractères pouvant « sortir » du contexte <script> : `<` (le seul
 * vrai vecteur — breakout via `</script>`), plus `>` et `&` par prudence. Les
 * `\uXXXX` restent du JSON valide, redécodés à l'identique par le parser : aucune
 * valeur n'est altérée. (U+2028/U+2029 inutiles ici : `application/ld+json` n'est
 * pas exécuté comme du JavaScript.)
 *
 * Les données proviennent exclusivement de nos fichiers de contenu (aucun input
 * utilisateur) → risque XSS déjà nul, l'encodage est une ceinture+bretelles.
 */
const SCRIPT_ESCAPES: Record<string, string> = {
  '<': '\\u003c',
  '>': '\\u003e',
  '&': '\\u0026',
};

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/[<>&]/g, (c) => SCRIPT_ESCAPES[c]);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
