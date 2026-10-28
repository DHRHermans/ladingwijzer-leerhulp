# LadingWijzer — productzoeker 0.3

LadingWijzer is een onafhankelijke leer- en opzoekhulp. Geen officiële overheids- of ADN-toepassing en geen product van ADNkennis.

**Product invoeren → precieze variant kiezen → ADN-informatie per onderwerp bekijken → eventueel overnemen in reisdossier.**

Het product is nu het vertrekpunt. De gebruiker hoeft niet eerst zelf een UN-nummer uit de tabellen over te nemen om informatie te zien. Zoek op een naam zoals methanol, benzine, dieselolie of natronloog, of rechtstreeks op een UN-nummer. Kies tevens tankschip of droge lading.

## Bekijken

Open `LadingWijzer.html` in een browser. Dit bestand bevat de app, zoekgegevens en tekstindex; installatie en een server zijn niet nodig. Op sommige telefoons wordt een HTML-bijlage alleen als documentvoorbeeld geopend; gebruik dan een browser op een computer. De losse bestanden in `dist/` zijn dezelfde app voor GitHub Pages.

Bronlinks en links naar ADNkennis vereisen internet. De ingebouwde zoekgegevens werken offline. Er is geen account, AI-API, tracking of verzending van dossiergegevens. Lokaal bewaren gebeurt op verzoek. Bewaar ook een JSON-back-up als je een dossier wilt behouden wanneer je browser of bestandlocatie verandert.

## Productkaart

Na keuze van een bronrij zijn er negen onderdelen:

- Overzicht: klasse, gevarenvermelding met code-uitleg, verpakkingsgroep, uitrusting en tabelwaarde voor kegels/lichten.
- Schip en tanks: tabeltype, tankuitvoering, tanktype, tankuitrusting, monstername, vullingsgraad, openingsdruk en explosiegegevens.
- Uitrusting: herkende codes PP, EP, EX, TOX en A in woorden, met de algemene voorschriften en keuringsvoorwaarden.
- Laden en lossen: herkende productgebonden codes, officiële controlelijstbepalingen en verzamelde hoofdstukteksten voor de gekozen vervoersvorm.
- Tijdens de vaart: tabelwaarde seinvoering plus bedrijfsvoorschriften en voorwaarden.
- Documenten: algemene en vormspecifieke documenteneisen, vervoerpapieren, schriftelijke instructies en kennis/opleiding.
- Bijzondere eisen: herkende BP-codes uit tabel A of aantekeningen uit tabel C, inclusief hun tekst en expliciete doorverwijzingen.
- Incident: gekozen productgegevens voor een melding en de officiële instructieverwijzingen; geen berekend inzetadvies.
- Broncontrole: oorspronkelijke celtekst, tabel, PDF-pagina en link naar het origineel, plus voetnotencontext.

De gekozen variant kan naar het bestaande reisdossier worden overgenomen. Het tabeltype wordt niet als werkelijk scheepstype ingevuld: dat moet uit de scheepsdocumenten blijken. Eerdere controlepunten worden teruggezet bij wijziging van dossiergegevens.

## Inhoud en grenzen

De app toont **broninformatie en verzamelde voorschriften**, geen gecertificeerde juridische beoordeling. De tekstindex haalt relevante ingangen en expliciete verwijzingen op; algemene eisen zijn niet volledig conditioneel op alle mogelijke transportgevallen gefilterd. De app claimt daarom niet dat alle voorschriften voor een concrete reis volledig zijn bepaald.

- Meerdere varianten blijven afzonderlijk zichtbaar. Een mengsel wordt niet automatisch geclassificeerd op basis van een handelsnaam.
- Een ster (*) blijft onbekend en verwijst naar 3.2.3.3; er wordt geen willekeurige waarde uit een andere variant gebruikt.
- De kegelwaarde is die van de gekozen tabelrij. Geen complete berekening voor samenlading, hoeveelheden, vrijstellingen, leeg/ongereinigd of restlading.
- Een lege cel of ontbrekende zoektreffer betekent niet dat er geen voorschrift geldt, en ook niet automatisch dat vervoer verboden is.
- Ambigue of onherkende codes blijven als onopgeloste broninformatie zichtbaar.
- Schema's, complexe opmaak, tabellen binnen bepalingen en beschadigde PDF-tekens kunnen niet volledig door de tekstindex worden weergegeven. Raadpleeg daarvoor de aangegeven bronpagina.
- Geen automatische verwerking van wijzigingen na de aangeleverde broneditie, geen controle van certificaatinhoud, geen operationele scheepsgoedkeuring en geen stofspecifiek noodadvies.

## ADNkennis.nl

Op verzoek gebruikt als aanvullende kennisbron en inhoudelijke referentie voor de gebruikersroute. Er zijn gerichte links naar tabel A, tabel C, gevarenklassen, classificatiecodes, seinvoering, vervoersdocumenten en de ADN-controlelijst. De tabelgegevens en regelteksten in de app zijn zelfstandig uit de aangeleverde officiële Vlaamse publicatie geëxtraheerd. Artikelen en databases van ADNkennis zijn niet overgenomen. Er is geen samenwerking, goedkeuring of technische gegevenskoppeling met ADNkennis.

Bronnen:

- https://adnkennis.nl/kennis/
- https://adnkennis.nl/werken-met-het-adn/
- https://adnkennis.nl/tabel-a/
- https://adnkennis.nl/tabel-c-2/
- https://adnkennis.nl/classificatiecodes/
- https://adnkennis.nl/gevarenklassen/
- https://adnkennis.nl/blauwe-kegels-en-lichten/
- https://adnkennis.nl/vervoersdocument/
- https://adnkennis.nl/e-learning-adn-controlelijst/

## Officiële bron en herkomst

Door gebruiker aangeleverde Vlaamse bijlage (1330 PDF-pagina's):
https://assets.vlaanderen.be/image/upload/v1753357211/repositories-prd/VR_2025_1807_DOC.0759-3_Omzetting_Richtlijn_EU_2025149_luik_ADN_-_bijlage_xtsgqr.pdf

Versie ADN 2025. Verwerkingsdatum 28 oktober 2026. SHA-256 en tellingen per tabelpagina staan in `products-data.js`. Er zijn 2947 geëxtraheerde A-records en 677 C-records, waaronder drie naamloze vervolgfragmenten die geen zelfstandig zoekresultaat vormen. De zoekfunctie bevat 3621 records met een naam. Dit is een extractietelling, geen onafhankelijk bewijs van volledigheid.

Vijf records zijn gemarkeerd als onzekere extractie: twee KRILLMEEL-rijen en drie naamloze vervolgfragmenten. Voor gemarkeerde rijen wordt geen uitgewerkte kaart aangeboden. De eerste twee zijn wel als onzekere zoektreffer terug te vinden met bronverwijzing.

Het brondocument heeft beschadigde PDF-objecten. De eerste tekstextractie stopte daardoor voortijdig. Voor de tekstindex is een tweede parser gebruikt die alle PDF-pagina's kon lezen; dit onderstreept waarom de dataset nog integrale vakinhoudelijke verificatie nodig heeft.

Aanvullende officiële bronnen voor actualiteit en verificatie:

- https://unece.org/transport/dangerous-goods/adn-2025
- https://www.rijksoverheid.nl/documenten/2025/06/05/adn-2025
- https://www.ccr-zkr.org/13020300-nl.html
- https://www.rijkswaterstaat.nl/water/scheepvaart/scheepvaartverkeersbegeleiding/bics
- https://unece.org/ru/node/14319

BICS/BAS biedt al gedeeltelijke sectorondersteuning. Deze app vervangt BICS niet. De originele LinkedIn-reacties konden niet worden uitgelezen en zijn nog niet verwerkt.

## Privé bekijken en later naar GitHub Pages

Een privéversie via Sites maakt bekijken via een gewone weblink mogelijk. Er is niets op GitHub aangemaakt of gewijzigd.

Plaats later de inhoud van `dist/` in de gekozen publicatiemap. Voor een nieuwe repository kan dat de root zijn; stel dan Settings → Pages → Deploy from a branch → branch → /(root) in. Gebruik voor een bestaande site een aparte map en behoud de bestaande inrichting. Alle paden zijn relatief, zodat een repository-subpad wordt ondersteund. Er is geen Java- of Python-server nodig.

## Techniek en verificatie

- `product-engine.js`: zoeken, eenduidige BP-codeherkenning en codebetekenissen.
- `products.js`: productkaart, verzamelde voorschriften en overname naar dossier.
- `products-data.js`: A/C-bronrecords met oorspronkelijke celtekst en PDF-pagina.
- `regulations-data.js`: genummerde tekstonderdelen, BP-definities, handelingscodes en C-aantekeningen.
- `engine.js` en `app.js`: bestaande dossierfunctie.
- `scripts/extract_adn.py`: reproduceerbare geometrische tabelextractie met pdfplumber.
- `scripts/extract_rules.py`: tekstindex met PyMuPDF en pdfplumber.
- `scripts/build_single.py`: maakt één zelfstandig HTML-bestand.

Voer `npm test` uit met Node.js. De controles omvatten onder meer methanol, benzine, dieselolie, meerdere varianten, *-waarden, leidende nullen, BP 243/534 en 279/802, VE01/VE02, verkeerde invoer, onzekere extractie en het nooit automatisch goedkeuren van vervoer. In de browser zijn de zoekroute, productkaart, uitrusting, aantekening en overname naar het dossier gecontroleerd. Enkele tabelwaarden zijn naast de originele PDF-weergave gelegd. Dit is geen integrale inhoudelijke audit, apparaattest of certificering.

Voor herbouw van de zoekdata plaats je de originele PDF als `adn-bron.pdf` naast de projectmap en draai je de scripts vanaf die bovenliggende map. De PDF zelf wordt niet in het pakket gekopieerd. Het gebruik van de app vereist geen Python.

## Publicatie vanuit deze repository

De website staat in `dist/`, inclusief het gekozen logo: een binnenvaartschip boven een open boek. De workflow `.github/workflows/pages.yml` test en publiceert deze map bij een push naar `main`. Kies in GitHub onder Settings → Pages → Source voor **GitHub Actions**.

Lokaal starten: `python3 -m http.server 8000 --directory dist`. Tests: `npm test` (Node.js 24; geen npm-dependencies nodig). De zelfstandige offlineversie herbouw je met `python3 scripts/build_single.py`; het logo wordt daarin ingebed.
