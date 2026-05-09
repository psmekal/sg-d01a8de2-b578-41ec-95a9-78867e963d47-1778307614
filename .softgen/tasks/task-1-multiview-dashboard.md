---
title: Multiview & Program Dashboard
status: todo
priority: high
type: feature
tags: [dashboard, video, core]
---

## Notes
Hlavná obrazovka réžie. Rozdelená na dve kľúčové časti:
1. Horná časť: Veľký "Program" monitor, ktorý ukazuje aktuálny stream so všetkými vrstvami (skóre, logá).
2. Spodná/bočná časť: "Multiview" grid menších náhľadov z jednotlivých stanovíšť (Hala 1, Hala 2, atď.).

Dizajn musí vychádzať z tmavej témy (Control Room) s technickým, nerušivým UI, aby vynikol samotný video obsah. Pre túto fázu použijeme namiesto reálnych kamier zástupné (mock) streamy alebo statické obrázky s ikonou prehrávania.

## Checklist
- [x] Vytvoriť rozloženie obrazovky: Hlavný monitor (Program Out) a sekcia s náhľadmi (Multiview).
- [x] Implementovať Multiview grid obsahujúci 4-6 kariet reprezentujúcich jednotlivé stanovištia (Názov, indikátor stavu, mock video náhľad).
- [x] Pridať možnosť kliknutím zvoliť jedno zo stanovíšť v Multiview gride a "poslať" ho do hlavného Program monitora.
- [x] Zabezpečiť vizuálne odlíšenie aktívneho stanovišťa (napr. červený rámik, status "LIVE").

## Acceptance
- Režisér vidí zoznam dostupných stanovíšť v prehľadnej mriežke.
- Kliknutím na stanovište sa jeho obsah prepne do hlavného veľkého prehrávača.
- Aktívne stanovište je v zozname jasne vizuálne označené.