'use client';

import SafeImage from '@/components/SafeImage/SafeImage';
import { formatPrice } from '@/lib/pricing/catalog';

import classes from './ProductPage.module.css';

const preparedBinShippingDelay =
  'Valmisteluaika on noin kaksi viikkoa. Käyttövalmis kompostori lähetetään kolmantena tilauksen jälkeisenä maanantaina, jotta petimateriaalin mikrobitoiminta ehtii käynnistyä ja madot kotiutua ennen kuljetusta.';

function closePreparedBinDetails(event) {
  const details = event.currentTarget.closest('details');
  details?.removeAttribute('open');
  details?.querySelector('summary')?.focus();
}

export default function PreparedWormBinSelector({
  addOn,
  selected,
  onChange,
  alreadyInCart,
}) {
  return (
    <div className={classes.FormSubsection}>
      <div className={classes.FormSubsectionHeader}>
        <h4 className={classes.FormSubsectionTitle}>Valitse aloitustapa</h4>
        <p className={classes.HelperText}>
          Tilaa pelkät madot omaan kompostoriisi tai valitse käyttövalmis 14 litran
          matokompostori, joka on valmisteltu ja käynnistetty puolestasi.
        </p>
      </div>

      <div className={classes.PreparedBinProductIntro}>
        <SafeImage
          src={addOn.image.src}
          alt=""
          width={72}
          height={54}
          sizes="72px"
          className={classes.AddOnImage}
        />
        <span className={classes.OptionContent}>
          <span className={classes.PreparedBinTitleStack}>
            <span className={classes.PreparedBinNewBadge}>Uusi</span>
            <span className={classes.OptionTitle}>Valmis matokompostori</span>
          </span>
        </span>

        <details className={classes.PreparedBinDetails}>
          <summary
            className={classes.PreparedBinDetailsSummary}
            aria-label="Lisätietoa käyttövalmiista matokompostorista"
            title="Lisätietoa käyttövalmiista matokompostorista"
          >
            <span aria-hidden="true">i</span>
          </summary>
          <div
            className={classes.PreparedBinPopover}
            role="dialog"
            aria-modal="true"
            aria-labelledby="prepared-bin-dialog-title"
          >
            <div className={classes.PreparedBinModalHeader}>
              <h5 id="prepared-bin-dialog-title">Valmis matokompostori</h5>
              <button
                type="button"
                className={classes.PreparedBinModalClose}
                onClick={closePreparedBinDetails}
                aria-label="Sulje lisätiedot"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className={classes.PreparedBinModalIntro}>
              <SafeImage
                src={addOn.image.src}
                alt={addOn.image.alt}
                width={addOn.image.width}
                height={addOn.image.height}
                sizes="(max-width: 36rem) 100vw, 160px"
                className={classes.PreparedBinImage}
              />
              <div className={classes.PreparedBinPopoverText}>
                <strong className={classes.PreparedBinPromise}>
                  Osta, vastaanota ja aloita ruokinta – matokompostoinnin aloittaminen ei
                  juuri helpommaksi muutu.
                </strong>
                <p>
                  Saat valitsemasi määrän kompostimatoja valmiiksi käynnistetyssä 14
                  litran kompostorissa. Erillistä kokoamista, petimateriaalin valmistelua
                  tai käyttöönottoa ei tarvita.
                </p>
              </div>
            </div>

            <div className={classes.PreparedBinModalBody}>
              <section>
                <h6>Mitä kompostori sisältää?</h6>
                <p>Kompostoriin kuuluu:</p>
                <ul>
                  <li>ilmanvaihtoaukoilla varustettu 14 litran muovilaatikko</li>
                  <li>valitsemasi määrä kompostimatoja</li>
                  <li>sopivan kosteaksi valmisteltu petimateriaali</li>
                  <li>
                    pieni määrä aiemmin käytössä ollutta, hyvin toimivaa petimateriaalia
                  </li>
                  <li>ensimmäinen maltillinen ruokinta</li>
                </ul>
              </section>

              <section>
                <h6>Miten kompostori käynnistetään?</h6>
                <p>
                  Valmistelen petimateriaalin sopivan kosteaksi ja sekoitan siihen pienen
                  määrän aiemmin toiminnassa ollutta petimateriaalia. Se tuo uuteen
                  kompostoriin valmiin mikrobikannan ja auttaa hajotustoimintaa
                  käynnistymään nopeammin.
                </p>
                <p>
                  Tämän jälkeen lisään valitsemasi madot ja ensimmäisen pienen
                  ruoka-annoksen. Kompostori saa toimia noin kaksi viikkoa ennen
                  lähetystä, jotta madot ehtivät kotiutua ja petimateriaalin
                  mikrobitoiminta käynnistyä.
                </p>
              </section>

              <section>
                <h6>Kun kompostori saapuu</h6>
                <p>
                  Kompostori on saapuessaan valmis käytettäväksi sellaisenaan. Valitse
                  sille sopiva paikka ja aloita jatkoruokinta varovasti. Ruokamäärää voi
                  kasvattaa vähitellen matojen lisääntyessä ja kompostorin toiminnan
                  vakiintuessa.
                </p>
                <p>
                  Kompostoria ei tarvitse koota, eikä petimateriaalia tarvitse erikseen
                  kostuttaa tai valmistella.
                </p>
              </section>

              <section>
                <h6>Toimitusaika</h6>
                <p>
                  Käyttövalmis kompostori lähetetään kolmantena tilauksen jälkeisenä
                  maanantaina.
                </p>
                <p>
                  Noin kahden viikon valmisteluaika tarvitaan siihen, että madot ehtivät
                  kotiutua uuteen ympäristöönsä ja kompostorin mikrobitoiminta käynnistyä
                  ennen kuljetusta.
                </p>
              </section>

              <section>
                <h6>Millainen kompostori on?</h6>
                <p>
                  Kompostori on kestävä, elintarvikekelpoisesta muovista valmistettu 14
                  litran laatikko, jonka ulkomitat ovat 40 × 30 × 19 cm. Tarvittavat
                  ilmanvaihtoaukot on tehty valmiiksi. Kompostori soveltuu pieneen
                  sisätiloissa tapahtuvaan matokompostointiin.
                </p>
              </section>
            </div>
          </div>
        </details>
      </div>

      <div className={classes.PreparedBinChoice}>
        <fieldset className={classes.FormFieldset}>
          <legend className={classes.ScreenReaderOnly}>
            Valitse matokompostoinnin aloitustapa
          </legend>
          <div className={classes.ChoiceList}>
            <label className={classes.FormOption}>
              <input
                type="radio"
                name="worms-starting-option"
                value=""
                checked={!selected}
                onChange={() => onChange('')}
                className={classes.ChoiceInput}
              />
              <span className={classes.OptionHeader}>
                <span className={classes.OptionMarker} aria-hidden="true">
                  {!selected ? '[x]' : '[ ]'}
                </span>
                <span className={classes.OptionTitle}>Pelkät madot</span>
              </span>
            </label>

            <label className={classes.FormOption}>
              <input
                type="radio"
                name="worms-starting-option"
                value={addOn.sku}
                checked={selected}
                onChange={() => onChange(addOn.sku)}
                className={classes.ChoiceInput}
              />
              <span className={classes.OptionHeader}>
                <span className={classes.OptionMarker} aria-hidden="true">
                  {selected ? '[x]' : '[ ]'}
                </span>
                <span className={classes.PreparedBinOptionSummary}>
                  <span className={classes.OptionTitle}>Valmis 14L kompostori</span>
                  <span className={classes.PreparedBinOptionPrice}>
                    +{formatPrice(addOn.price)} €
                  </span>
                </span>
              </span>
            </label>
          </div>
        </fieldset>

        {selected ? (
          <p className={classes.PreparedBinShippingDelay}>{preparedBinShippingDelay}</p>
        ) : null}

        {alreadyInCart ? (
          <p className={classes.PreparedBinCartStatus}>
            Käyttövalmis matokompostori on jo ostoskorissa. Voit poistaa sen ostoskorissa.
          </p>
        ) : null}
      </div>
    </div>
  );
}
