# TODO: repoint the Plausible script when analytics moves off sitemgt.io

`public/index.html` hardcodes:

```html
<script defer data-domain="wifipass.pp.ua"
        src="https://analytics.sitemgt.io/js/script.outbound-links.js"></script>
```

`sitemgt.io` is being allowed to lapse (renewal unaffordable, 2026-08). Analytics is
moving to **`analytics.vantagrid.com`** on sa-prd-dkr (`/mnt/data/dockerdata/plausible-ce`).

**Do not change this before that migration lands** — vantagrid.com had no A record as of
2026-08-01, so repointing early swaps one dead host for another.

**Why this needs its own note:** the migration plan says "update the Plausible WP plugin
setting on ~7 sites". wifipass is NOT WordPress — it is a static `<script>` tag in
`public/index.html`, so that step will miss it. Same applies to any other non-WordPress app
carrying the tag.

Related: Plausible ingestion has been dead across ALL sites since 2026-07-23 (the API
returns 200 and silently drops events), so nothing is being lost in the meantime — but that
defect should be fixed during the migration, or a broken instance just gets moved.
