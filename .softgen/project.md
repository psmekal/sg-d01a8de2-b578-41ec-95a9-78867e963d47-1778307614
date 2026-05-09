---
title: Tournament Video Hub
created_by: softgen
---

## Vision
Centrálna aplikácia pre správu a spracovanie videa z turnajov. Umožňuje jednému tímu alebo operátorovi monitorovať a spravovať video záznamy z viacerých stanovíšť (kurtov/ihrísk) súčasne.

## Design
Smerovanie: Profesionálny analytický/riadiaci dashboard ("Control Room"). Tmavý režim pre lepšiu viditeľnosť videa a zníženie únavy očí počas dlhých turnajov. Technický a spoľahlivý vzhľad.

Tokens:
- `--background`: 224 71% 4% (Deep dark slate)
- `--foreground`: 213 31% 91% (Light cool gray)
- `--primary`: 217 91% 60% (Electric blue)
- `--accent`: 346 87% 60% (Recording red - for live status/alerts)
- `--muted`: 223 47% 11% (Elevated dark slate for cards/panels)

Fonts:
- Headings: IBM Plex Sans
- Body: Rubik
- Data/Timecodes: IBM Plex Mono

Style: Kompaktný grid, funkčné farby znižujúce vizuálny šum. Použitie tabular-nums pre akékoľvek časové kódy. Zvýraznenie stavov (nahráva sa / spracováva sa) pomocou farby `--accent`.

## Features
- **Multiview Dashboard (Náhľady):** Grid surových streamov z jednotlivých stanovíšť s možnosťou výberu hlavného streamu (Program).
- **Production Switcher (Réžia):** 
  - Frontend pre ovládanie skóre (Tím A, Tím B, body, sety/polčasy).
  - Vrstvy (Overlays) pre sponzorské logá a informačnú grafiku.
  - Spúšťanie predelov (VOD videá, reklamy, slučky) v čase prerušenia hry.
- **Media Library:** Knižnica pre upload a správu VOD obsahu (reklamy, zvučky) a statickej grafiky (logá partnerov).
- **Program Out Preview:** Náhľad výsledného obrazu (kompozícia surový stream + grafika + skóre), ktorý reprezentuje výstup na YouTube.
