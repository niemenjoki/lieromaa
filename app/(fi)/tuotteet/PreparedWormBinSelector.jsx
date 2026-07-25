'use client';

import SafeImage from '@/components/SafeImage/SafeImage';
import { getProductMessages } from '@/lib/i18n/messages.mjs';
import { formatCurrency } from '@/lib/pricing/catalog';

import classes from './ProductPage.module.css';

function closePreparedBinDetails(event) {
  const details = event.currentTarget.closest('details');
  details?.removeAttribute('open');
  details?.querySelector('summary')?.focus();
}

export default function PreparedWormBinSelector({
  addOn,
  selected,
  onChange,
  alreadyInCartCount,
  language,
}) {
  const copy = getProductMessages(language).preparedBin;

  return (
    <div className={classes.FormSubsection}>
      <div className={classes.FormSubsectionHeader}>
        <h4 className={classes.FormSubsectionTitle}>{copy.heading}</h4>
        <p className={classes.HelperText}>{copy.description}</p>
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
            <span className={classes.PreparedBinNewBadge}>{copy.newBadge}</span>
            <span className={classes.OptionTitle}>{copy.shortTitle}</span>
          </span>
        </span>

        <details className={classes.PreparedBinDetails}>
          <summary
            className={classes.PreparedBinDetailsSummary}
            aria-label={copy.infoLabel}
            title={copy.infoLabel}
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
              <h5 id="prepared-bin-dialog-title">{copy.shortTitle}</h5>
              <button
                type="button"
                className={classes.PreparedBinModalClose}
                onClick={closePreparedBinDetails}
                aria-label={copy.closeLabel}
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
                <strong className={classes.PreparedBinPromise}>{copy.promise}</strong>
                <p>{copy.intro}</p>
              </div>
            </div>

            <div className={classes.PreparedBinModalBody}>
              {copy.sections.map((section) => (
                <section key={section.heading}>
                  <h6>{section.heading}</h6>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.bullets.length ? (
                    <ul>
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
          </div>
        </details>
      </div>

      <div className={classes.PreparedBinChoice}>
        <fieldset className={classes.FormFieldset}>
          <legend className={classes.ScreenReaderOnly}>{copy.legend}</legend>
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
                <span className={classes.OptionTitle}>{copy.wormsOnly}</span>
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
                  <span className={classes.OptionTitle}>{copy.optionTitle}</span>
                  <span className={classes.PreparedBinOptionPrice}>
                    +{formatCurrency(addOn.price, language)}
                  </span>
                </span>
              </span>
            </label>
          </div>
        </fieldset>

        {selected ? (
          <p className={classes.PreparedBinShippingDelay}>{copy.shippingDelay}</p>
        ) : null}

        {alreadyInCartCount ? (
          <p className={classes.PreparedBinCartStatus}>
            {copy.alreadyInCart({ count: alreadyInCartCount })}
          </p>
        ) : null}
      </div>
    </div>
  );
}
