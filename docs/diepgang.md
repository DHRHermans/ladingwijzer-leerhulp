# Diepgang en water — ontwikkelnotities

Open `index.html#diepgang` via een statische server. GitHub Pages blijft `main` → `/(root)` gebruiken.

## Brongegevens

`meetbrief.pdf` is de door de gebruiker aangeleverde PDF. Pagina 1 bevat 252 opeenvolgende tabelrijen (cm, m³), opgeslagen in `meetbrief-data.js` met SHA-256 van de PDF. Extractie: `pdftotext -raw docs/meetbrief.pdf`; alleen paren op dezelfde regel van pagina 1 zijn overgenomen. De waarden zijn strikt stijgend; er ontbreken geen centimeters. De oefening op pagina 2 is intern tegenstrijdig en niet als rekenreferentie gebruikt.

## Model

Archimedes: verplaatst volume = totale massa / waterdichtheid, met ton en kg/m³ correct omgerekend. De lege oefenmassa is het tabelvolume van een zelf gekozen lege inzinking, vermenigvuldigd met 1 ton/m³. Productmassa komt daar bovenop. Lineaire interpolatie in de meetbrieftabel bepaalt inzinking. Buiten het bronbereik volgt een foutmelding, geen extrapolatie.

Omdat het referentievlak en de echte lege toestand niet uit de PDF blijken, stelt alleen dit onderwijsmodel inzinking gelijk aan diepgang. 40 cm leeg is een oefenaanname. De werkelijke hydrostatische gegevens, toegestane inzinking en scheepsmassa zijn niet vastgesteld. De laatste tabelrij is geen toegestane laadgrens.

Voorbeelden: methanol 790, benzine 740 en dieselolie 840 kg/m³ zijn afgeronde onderwijswaarden. Niet afkomstig uit ADN-tabelkolom 12. Overname van een productkaart vereist daarom expliciete invoer van productdichtheid. Zoet, brak en zee gebruiken onderwijswaarden 1000, 1010 en 1025 kg/m³. Er wordt geen lokale dichtheid of temperatuur-/zoutmodel gesuggereerd.

## Verificatie

- `node tests/draft.cjs`: zes rekentests met bronwaarden, interpolatie, Archimedes, lading, kielspeling en ongeldige/buitenbereik-invoer.
- `node tests/legacy.cjs`: bestaande dossiercontroles.
- `node tests/products.cjs`: bestaande productcontroles.
- Browsercontrole: directe route, navigatie, waterkeuze, bewegende kiel, volumevergelijking, ondiep water, foutafhandeling, overname product en mobiele breedte van 390 px.

UI: `draft.js`; herbruikbare rekenkern: `draft-engine.js`. Er zijn geen externe runtime-dependencies.
