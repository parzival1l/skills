# Theme tokens

Every color in `assets/template.html` comes from these CSS custom properties. Change a theme by changing values only. Keep the names: they match the tokens in the Paper file **HTML Skill**.

## Nocturnal Cobalt (default)

| Token | Value | Role |
|---|---|---|
| `--color-paper` | `#121316` | Page background |
| `--color-surface` | `#1B1D21` | Panels, cards, tiles |
| `--color-ink` | `#F1F0F3` | Body text, chapter rules, inverted buttons |
| `--color-muted` | `#9C9AA5` | Ledes, labels, notes |
| `--color-line` | `#2B2D33` | Hairlines and panel borders |
| `--color-line-strong` | `#41434B` | Tags, scorecard borders, icons |
| `--color-accent` | `#4C8DFF` | Payoff word, eyebrows, engine A, selected state |
| `--color-accent-soft` | `#16233B` | Lead scorecard, detail box, spotlight |
| `--color-secondary` | `#F2B45A` | Engine B, the comparison baseline |
| `--color-track` | `#24262B` | Bar tracks, tab wells, gallery wells |
| `--color-warn` | `#FF6B5B` | Misses, flagged segments, "before" panels |
| `--color-success` | `#5FD39A` | Live pill, "after" panels, pass badges |
| `--color-signal` | `#F2B45A` | Small attention dots on tabs |
| `--color-cat-1` … `--color-cat-5` | `#2B2542` `#1C2B3D` `#3B2A16` `#183327` `#2A2B30` | Category fills for strips and keys |

## Cobalt Light (switch target)

`:root[data-theme=light]` overrides the same names. The topbar switch sets `data-theme` and saves it in `localStorage` under `report-theme`. Dark stays the default when nothing is saved.

| Token | Value |
|---|---|
| `--color-paper` | `#F8F7F4` |
| `--color-surface` | `#FFFFFF` |
| `--color-ink` | `#17181C` |
| `--color-muted` | `#5F6170` |
| `--color-line` / `--color-line-strong` | `#DEDDE3` / `#C3C2CC` |
| `--color-accent` / `--color-accent-soft` | `#2457E6` / `#E6EDFF` |
| `--color-secondary` | `#B86E00` |
| `--color-track` | `#EFEEF2` |
| `--color-warn` / `--color-success` / `--color-signal` | `#C2412D` / `#1F7A4D` / `#D9822B` |
| `--color-cat-1` … `--color-cat-5` | `#E7DDFA` `#DCE5FF` `#FBE6CD` `#D8EADF` `#EEE9DF` |

## Rules

- Use one accent. The accent marks engine A, the selected item, and the headline payoff word. Nothing else.
- The secondary color exists only to separate engine B from engine A. Never decorate with it.
- Text on `--color-accent` uses `--color-paper`.
- Category fills stay dark and low-chroma. Text on them uses `--color-ink`.
- Never write a raw hex outside the two theme blocks. Exception: page images keep a white background, because scanned pages are white.

## Explored alternatives

The Paper file keeps these as side-by-side artboards. Swap them in only when asked.

| Theme | paper | surface | ink | accent | accent-soft | secondary |
|---|---|---|---|---|---|---|
| Nocturnal Ice | `#121316` | `#1B1D21` | `#F1F0F3` | `#8EC5FF` | `#172636` | `#C3C8D2` |
| Nocturnal (pink) | `#121316` | `#1B1D21` | `#F1F0F3` | `#FF3D8B` | `#3A1627` | `#8EC5FF` |
| Aubergine | `#141217` | `#1E1A24` | `#EEE8F5` | `#B18BFF` | `#2A1F3D` | `#6F8FFF` |
| Light (docjev original) | `#F8F7F4` | `#FFFFFF` | `#21182D` | `#6718F7` | `#EEE5FF` | `#4B72FE` |

To use the original docjev purple in light mode, replace the light accent pair with `#6718F7` / `#EEE5FF` and the light secondary with `#4B72FE`.
