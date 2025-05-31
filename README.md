# virtualPetGame

Tato webová aplikace umožňuje uživatelům vybrat si svého mazlíčka, starat se o něj, krmit ho, hladit a ukládat ke spánku. Úroveň hladu, štěstí a spánku se průběžně mění podle aktivity uživatele. Aplikace využívá localStorage pro uchování stavu již existujících mazlíčků.

 ## Funkce
Výběr mazlíčka: 🐶 pes, 🐱 kočka, 🐰 králík

Krmení: Hra s padajícím jídlem ovládaná šipkami nebo dotykem prstu

Hraní si: Interaktivní hlazení pomocí myši nebo dotyku

Spaní: Spustí se ukolébavka a mazlíček regeneruje energii

Ukládání stavu: Stav mazlíčka se ukládá do localStorage při změně statů


## Herní Mechaniky

Stavy mazlíčka
default: čekání na aktivitu

eating: spuštěná hra s jídlem

playing: mazlení

sleeping: spánek

## Ukládání a Načítání
Při načtení stránky se automaticky obnoví stav mazlíčka na základě uložených dat.

Pokud je uživatel dlouho neaktivní, hodnoty se postupně snižují.

## Ovládání
Šipky vlevo/vpravo: pohyb mazlíčka při chytání jídla

Dotyk/pohyb myši: mazlení

Tlačítka: Krmení, mazlení, spánek

## Zvuky
každý mazlíček má vlastní zvuk  pro jezení a všem se spustí ukolébavka při ukožení ku spánku.


## Spuštění
Aplikaci lze spustit jednoduše v libovolném moderním prohlížeči otevřením webové stránky.

