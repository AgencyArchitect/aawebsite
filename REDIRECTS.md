# Agency Architect — oude → nieuwe slug 301-kaart

Status: 301 Permanente redirect. Aanmaken in Cloudflare Dashboard → Rules → Bulk Redirect Lists, of per-rule Redirect Rules. Alle oude slugs zijn per 18 aug 2026 verwijderd uit de site (re-slug onder /e-commerce-marketing/); zonder deze redirect geven ze nu een live 404 en verlies je de opgebouwde Google-autoriteit + zoekvolume.

| Bron (oud) | Doel (nieuw) |
|---|---|
| `/facebook-marketing/` | `/e-commerce-marketing/facebook-marketing/` |
| `/facebook-marketing/strategie/` | `/e-commerce-marketing/facebook-marketing/strategie/` |
| `/facebook-marketing/adverteren/` | `/e-commerce-marketing/facebook-marketing/adverteren/` |
| `/facebook-marketing/funnels/` | `/e-commerce-marketing/facebook-marketing/funnels/` |
| `/facebook-marketing/copywriting/` | `/e-commerce-marketing/facebook-marketing/copywriting/` |
| `/facebook-marketing/organisch/` | `/e-commerce-marketing/facebook-marketing/organisch/` |
| `/instagram-marketing/` | `/e-commerce-marketing/instagram-marketing/` |
| `/instagram-marketing/strategie/` | `/e-commerce-marketing/instagram-marketing/strategie/` |
| `/instagram-marketing/adverteren/` | `/e-commerce-marketing/instagram-marketing/adverteren/` |
| `/instagram-marketing/funnels/` | `/e-commerce-marketing/instagram-marketing/funnels/` |
| `/instagram-marketing/copywriting/` | `/e-commerce-marketing/instagram-marketing/copywriting/` |
| `/instagram-marketing/organisch/` | `/e-commerce-marketing/instagram-marketing/organisch/` |

## Cloudflare opties
- **Bulk Redirect**: maak één Bulk Redirect List met bovenstaande paren, status 301, 'Preserve query string' aan, en een Bulk Redirect Rule die ze toepast.
- **Catch-all prefix-rule** (als alle nests uniform zijn): één Dynamic Redirect `/*/facebook-marketing/*` of `/*/instagram-marketing/*` → backend met prefix-insert `{p1}/e-commerce-marketing/{p2}/{p3}`. De expliciete paartabel hierboven is veiliger/controleerbaar.

## Verificatie
```bash
for s in facebook-marketing instagram-marketing; do curl -s -o /dev/null -w "$s %{http_code} -> %{redirect_url}\n" https://agencyarchitect.nl/$s/; done
```
Verwacht overal `301` die naar de nieuwe URL wijst — géén 404.
