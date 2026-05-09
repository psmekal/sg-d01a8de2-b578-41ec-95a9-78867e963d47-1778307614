---
title: Production Switcher & Scoreboard Controls
status: todo
priority: high
type: feature
tags: [controls, overlay, dashboard]
---

## Notes
Tento panel bude umiestnený vedľa hlavného "Program" monitora (z tasku 1). Umožňuje režisérovi ovládať grafické vrstvy, ktoré prekrývajú video, a spúšťať predely.

Kľúčové moduly pultu:
1. Ovládanie skóre (Scoreboard Controller).
2. Tlačidlá na spúšťanie predelov (reklamy/turnajové VOD).
3. Prepínače pre logá (Zapnúť/Vypnúť sponzora).

Tieto zmeny sa musia premietnuť priamo do overlay vrstvy (UI kompozície) nad hlavným video prehrávačom z tasku 1.

## Checklist
- [x] Vytvoriť panel "Skóre": Input polia pre mená tímov, tlačidlá pre +/- skóre a voľbu periody/setu.
- [x] Vytvoriť panel "Grafika & Logá": Prepínače (Toggle switches) na aktiváciu/deaktiváciu sponzorských sád (napr. "Generálny partner", "Lokálni partneri").
- [x] Vytvoriť panel "Predely": Rýchle tlačidlá (Quick-play buttons) na spustenie predpripravených VOD klipov (Reklama A, Reklama B, Turnajové intro).
- [x] Implementovať Overlay vrstvu do hlavného Program monitora, ktorá reaktívne zobrazuje skóre, logá alebo prekrýva video reklamou na základe stavu z kontrolného panela.

## Acceptance
- Zmena skóre v paneli sa okamžite prejaví v grafike nad videom.
- Prepnutie switchu pre logo zobrazí/skryje sponzorské logo v rohu videa.
- Kliknutie na "Spustiť reklamu" prekryje živý prenos VOD obsahom.