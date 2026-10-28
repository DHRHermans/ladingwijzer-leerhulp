# Diepgang en water — ontwikkelnotities

Open `index.html#diepgang` via een statische server. GitHub Pages blijft `main` → `/(root)` gebruiken.

## Brongegevens

`meetbrief.pdf` is de door de gebruiker aangeleverde PDF. Pagina 1 bevat 252 opeenvolgende tabelrijen (cm, m³), opgeslagen in `meetbrief-data.js` met SHA-256 van de PDF. Extractie: `pdftotext -raw docs/meetbrief.pdf`; alleen paren op dezelfde regel van pagina 1 zijn overgenomen. De waarden zijn strikt stijgend; er ontbreken geen centimeters. Het niet-benodigde oefenblad (oorspronkelijke pagina 2) is op verzoek verwijderd; de gepubliceerde PDF bevat alleen de tabel. De SHA-256 van zowel de huidige PDF als de oorspronkelijke upload staat in de dataset.

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

## Leerhub en simulatorbediening

De standaardroute is de leerhub (`#start`), met ingangen voor ADN (`#adn`), diepgang (`#diepgang`) en ladingstechniek (`#ladingstechniek`). De productzoeker blijft via de ADN-ingang bereikbaar.

De simulator biedt schuiven voor hoeveelheid, waterdichtheid en waterdiepte, een afspeelbare overgang van zoet naar zee en een bewaarfunctie voor een vergelijkingskiel. De detailweergave vergroot het verschil tegenover zoetwater (8 pixels/cm, visueel begrensd; de cijfers zijn ongewijzigd). Een bewaarde vergelijking leeft alleen in de huidige browsersessie. De grafische laadblokken zijn schematisch en stellen geen tankplan voor.

De scheepsweergave heeft een vaste verticale schaal (60 pixels per modelmeter). Het aanpassen van de waterdiepte verplaatst alleen de bodem, niet het schip. Bij grote waterdiepte ligt de bodem buiten beeld en wordt dit gemeld.

## Eigen meetbrief

Open **Eigen meetbrief toevoegen** in de diepgangmodule. PDF, JPG, PNG en WebP tot 20 MB worden lokaal verwerkt. Kies één PDF-pagina (1–100); tekst-PDF’s gebruiken PDF.js, scans en foto’s Tesseract OCR. De benodigde assets staan in `vendor/` en worden pas bij import geladen. Er is geen externe OCR-dienst of documentupload.

De herkenning levert kandidaatrijen op, geen gevalideerde tabel. Vooral kolommen zoals ton per cm kunnen foutief als inzinking/volume worden herkend. De gebruiker controleert de preview, corrigeert de puntkomma-gescheiden tabel en bevestigt de betekenis van beide kolommen. Onvolledige, dubbele, aflopende en ongeldige rijen worden bij toepassen geweigerd. Alleen totale waterverplaatsing in m³ wordt ondersteund; geen automatische omzetting van laadvermogen. cm en m voor de eerste kolom zijn instelbaar. Tussen de ingevoerde punten blijft de berekening lineair.

Een toegepast document vervangt de tabel in het werkgeheugen, wist de vergelijkingskiel en zet de lading op nul en het water op 1000 kg/m³. De lege toestand wordt binnen het nieuwe tabelbereik gehouden en moet opnieuw worden beoordeeld. Documenten en eigen tabellen worden niet bewaard na herladen. De voorbeeldknoppen herstellen de meegeleverde meetbrief. Het oorspronkelijke document wordt niet aangepast.

Extra tests: `node tests/meetbrief.cjs`.
