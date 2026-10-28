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
