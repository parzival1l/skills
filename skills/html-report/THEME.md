# Theme

Read this only when the user asks for different colors. Every color lives in two blocks at the top of `assets/report.css`. Change values, never names.

Dark is the default. The topbar switch sets `data-theme="light"` and saves the choice in `localStorage` under `report-theme`.

| Token | Dark (`:root`) | Light (`:root[data-theme=light]`) | Role |
|---|---|---|---|
| `--color-paper` | `#121316` | `#F8F7F4` | Page background |
| `--color-surface` | `#1B1D21` | `#FFFFFF` | Panels and tiles |
| `--color-ink` | `#F1F0F3` | `#17181C` | Body text and chapter rules |
| `--color-muted` | `#A9A7B2` | `#55576A` | Ledes, labels, captions |
| `--color-line` | `#2B2D33` | `#DEDDE3` | Hairlines |
| `--color-line-strong` | `#41434B` | `#C3C2CC` | Tags, borders, neutral diagram parts |
| `--color-accent` | `#4C8DFF` | `#2457E6` | The subject of a finding, selected items |
| `--color-accent-soft` | `#16233B` | `#E6EDFF` | Selected backgrounds |
| `--color-secondary` | `#F2B45A` | `#B86E00` | Engine B, held parts |
| `--color-track` | `#24262B` | `#EFEEF2` | Bar tracks and tab wells |
| `--color-warn` | `#FF6B5B` | `#C2412D` | Rejected or wrong |
| `--color-success` | `#5FD39A` | `#1F7A4D` | Passed or saved |
| `--color-cat-1` to `-5` | dark, low-chroma fills | light pastel fills | Category fills in strips |

## Rules

- **One accent.** It marks what each finding is about. Nothing else.
- **Secondary is for engine B and held parts.** Never decoration.
- **No hex outside the two blocks.** Scanned page images keep a white background. That is the one exception.

## Other palettes

Swap these in only when asked. Each replaces the dark block's values.

| Palette | paper | surface | ink | accent | accent-soft | secondary |
|---|---|---|---|---|---|---|
| Ice | `#121316` | `#1B1D21` | `#F1F0F3` | `#8EC5FF` | `#172636` | `#C3C8D2` |
| Pink | `#121316` | `#1B1D21` | `#F1F0F3` | `#FF3D8B` | `#3A1627` | `#8EC5FF` |
| Aubergine | `#141217` | `#1E1A24` | `#EEE8F5` | `#B18BFF` | `#2A1F3D` | `#6F8FFF` |
