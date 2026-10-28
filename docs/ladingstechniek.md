# Ladingstechniek: simulator en puzzels

De startpagina bevat alleen het logo en drie moduleknoppen. ADN opent een apart keuzemenu; Ladingstechniek opent de simulator, puzzel en basisuitleg.

## Rekenmodel

`cargo-engine.js` bevat het rekenmodel; `cargo.js` de gebruikersinterface. Vijf oefenconfiguraties: vaste stukgoederen, los stortgoed, vloeistoffen, containers en zware/projectlading. Iedere configuratie gebruikt zes gelijke modules op posities voor/midden/achter en bakboord/stuurboord. Per module geldt 200 ton en 300 m³; containers gebruiken maximaal 10 TEU en 30 m³ modelruimte per TEU. Dit zijn fictieve oefengrenzen, geen scheepsgegevens.

Voor massa-invoer wordt volume = ton × 1000 / dichtheid. Containers gebruiken een ingegeven gemiddelde massa per TEU. De massamiddelpuntstip is het gewogen gemiddelde van de posities van de lading, zonder lege scheepsmassa. Er worden geen hoeken van trim/slagzij, stabiliteit, tankcompatibiliteit, gascompressie of structurele krachten bepaald. Gedeeltelijk gevulde vloeistofmodules krijgen een kwalitatieve verwijzing naar vrije vloeistofoppervlakken.

## Puzzels

Er zijn drie opdrachten: stortgoed, vloeistoffen en containers. Alle acht partijen moeten worden geplaatst. Massa- en volumegrenzen en (voor containers) een TEU-grens gelden per module. Het massaverschil bakboord/stuurboord en voor/achter moet binnen de opgegeven tolerantie blijven. De middenmodules tellen niet als voor of achter. De containers hebben verschillende gewichten.

Bediening: een partij aanklikken en daarna een module kiezen, slepen of het toegankelijke keuzelijstje per partij gebruiken. De feedback noemt ontbrekende partijen, overbelasting en beide massaverschillen. Opnieuw beginnen en een oplossingshint zijn beschikbaar. Opgelost betekent uitsluitend dat aan de spelregels is voldaan.

## Controles

`node tests/cargo.cjs` controleert massa/volume, capaciteit, containereenheden, gedeeltelijk gevulde tanks, massamiddelpunt en een bekende oplossing voor elk van de drie opdrachten. De oplossingstoewijzing per partij is `[0,3,0,3,2,5,2,5]`.

De browsercontrole omvat ook PDF-import, lokale foto-OCR, correctie en activering van een eigen meettabel, de drie hubroutes, overbelasting, gelijk verdelen en de puzzels op mobiel. De bestaande product- en dossiertests blijven beschikbaar in `tests/`.

## Het schip zien bewegen

Het extra vak **Zie het gevolg van je laadplan** toont een zijaanzicht en een achteraanzicht van een binnenschip. Het is met een checkbox te verbergen; de bestaande simulator en puzzel blijven eronder beschikbaar. Beide werkvormen sturen hun actuele ladingmassa’s naar de weergave via `cargo-load`-events. Bij ongeldige invoer wordt de scheepsweergave verborgen.

`cargo-effects.js` bepaalt uitsluitend richting en visuele versterking uit de relatieve massaverdeling. Meer massa aan bakboord of stuurboord geeft een illustratieve helling naar die kant; meer massa voor of achter laat die kant in het zijaanzicht dieper liggen. De hoeken zijn bewust onbenoemd en vormen geen berekende werkelijke helling of trim. De lege scheepsmassa, ballast, scheepsvorm, GM, GZ, lengtetrimstijfheid en vloeistofmomenten zijn onbekend. De beperkte verticale verschuiving bij meer massa is eveneens alleen grafisch, zonder relatie met de meetbriefsimulator.

Rollen wordt apart als golfprikkel toegevoegd rond de statische scheefstand. De amplitude, periode en versterkingsfactoren voor hoog geplaatste lading en gedeeltelijk gevulde vloeistofmodules zijn illustratief gekozen. Dit model voorspelt geen stabiliteit, rolperiode, kapseizen of veiligheid. Bij uitgeschakelde golfprikkel blijft alleen de statische illustratie staan. De animatie kan worden gepauzeerd, stopt buiten de zichtbare module en respecteert een voorkeur voor minder beweging.

Voorbeelden: gelijk verdeeld, zwaar aan bakboord, zwaar vooraan, scheef én voorover en hoog gestapelde containers. De voorbeeldknoppen wijzigen de invoer van de simulator en zijn verborgen in de puzzel. In de puzzel volgt het schip de geplaatste partijen.

`node tests/effects.cjs` toetst balans, beide hellingsrichtingen, voor-/achtertrim, gecombineerde onbalans en ongeldige invoer. `tests/browser.cjs` controleert de SVG-bewegingen, golfprikkel, pauze, verbergen, scenario’s, voorkeur voor minder beweging en puzzelkoppeling. Hiervoor is Playwright met Chromium nodig; de overige tests hebben alleen Node.js nodig.
