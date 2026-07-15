'use client';

import SafeImage from '@/components/SafeImage/SafeImage';
import { formatPrice } from '@/lib/pricing/catalog';

import classes from './ProductPage.module.css';

const preparedBinShippingDelay =
  'Käyttövalmis kompostori lähetetään kolmantena tilauksen jälkeisenä maanantaina. Noin kahden viikon odotusaikana kompostorin mikrobitoiminta ehtii käynnistyä ja madot kotiutuvat uuteen ympäristöönsä, joten kompostori on saapuessaan heti käyttövalmis.';

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
          Tilaa pelkät madot omaan kompostoriisi tai valitse mahdollisimman helppo alku.
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
          <span className={classes.FinePrint}>
            Madot toimitetaan 14 litran muovilaatikossa, joka on heti valmis käyttöön
            sellaisenaan
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
          <div className={classes.PreparedBinPopover}>
            <SafeImage
              src={addOn.image.src}
              alt={addOn.image.alt}
              width={addOn.image.width}
              height={addOn.image.height}
              sizes="(max-width: 640px) 80vw, 160px"
              className={classes.PreparedBinImage}
            />
            <div className={classes.PreparedBinPopoverText}>
              <strong className={classes.PreparedBinPromise}>
                Osta, vastaanota ja aloita ruokinta – matokompostoinnin aloittaminen ei
                juuri helpommaksi muutu.
              </strong>
              <p className={classes.FinePrint}>
                Valmistelen petimateriaalin, lisään madot, annan ensimmäiset
                ruoka-annokset sekä valvon kompostorin käynnistymistä ennen lähetystä. Kun
                saat kompostorin, voit heti varovasti aloittaa ruokinnan. Erillistä
                kokoamista tai käyttöönottoa ei tarvita.
              </p>
            </div>
            <p className={classes.PreparedBinPopoverDelay}>{preparedBinShippingDelay}</p>
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
