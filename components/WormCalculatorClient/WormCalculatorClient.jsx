'use client';

import { useState } from 'react';

import ContentRecommendations from '@/components/ContentRecommendations/ContentRecommendations';
import FinnishContentLinks from '@/components/FinnishContentLinks/FinnishContentLinks';
import SafeLink from '@/components/SafeLink/SafeLink';
import SocialShareButtons from '@/components/SocialShareButtons/SocialShareButtons';
import useDebounce from '@/hooks/useDebounce';
import { getMessage } from '@/lib/i18n/messages.mjs';
import {
  calculateWormRecommendation,
  normalizePersonCount,
} from '@/lib/wormCalculator/calculateWormRecommendation.mjs';

import classes from './WormCalculatorClient.module.css';

export default function WormCalculatorClient({ language = 'fi', recommendations = [] }) {
  const copy = getMessage(language, 'pages.wormCalculator');
  const [adults, setAdults] = useState('0');
  const [teens, setTeens] = useState('0');
  const [children, setChildren] = useState('0');
  const [toddlers, setToddlers] = useState('0');
  const [diet, setDiet] = useState('sekaruoka');
  const [result, setResult] = useState(null);

  function calculate() {
    setResult(calculateWormRecommendation({ adults, teens, children, toddlers, diet }));
  }

  useDebounce(calculate, 2000, [adults, teens, children, toddlers, diet]);

  const handlePersonCountChange = (setter) => (event) => {
    const nextValue = event.target.value;
    if (/^\d*$/.test(nextValue)) {
      setter(nextValue);
    }
  };

  const handlePersonCountBlur = (setter) => (event) => {
    setter(String(normalizePersonCount(event.target.value)));
  };

  return (
    <article className={classes.WormCalculatorClient}>
      <h1>{copy.title}</h1>
      <p>{copy.description}</p>

      <div className={classes.Content}>
        <h2>{copy.whyHeading}</h2>
        <p>{copy.whyBody}</p>
        {language === 'fi' ? (
          <p>
            {copy.productPrompt}{' '}
            <SafeLink href="/tuotteet/madot">{copy.productLinkLabel}</SafeLink>.
          </p>
        ) : (
          <p>
            {copy.productPrompt}{' '}
            <SafeLink href="/en/products/compost-worms">{copy.productLinkLabel}</SafeLink>
            .
          </p>
        )}

        <h2>{copy.calculatorHeading}</h2>
        <p>{copy.calculatorIntro}</p>

        <section className={classes.Card}>
          <div className={classes.CardHeader}>
            <h3>{copy.formHeading}</h3>
            <p>{copy.formHelp}</p>
          </div>

          <div className={classes.FormGrid}>
            <label className={classes.Field}>
              <span className={classes.Label}>{copy.fields.adults}</span>
              <input
                className={classes.Input}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={adults}
                onChange={handlePersonCountChange(setAdults)}
                onBlur={handlePersonCountBlur(setAdults)}
              />
            </label>

            <label className={classes.Field}>
              <span className={classes.Label}>{copy.fields.teens}</span>
              <input
                className={classes.Input}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={teens}
                onChange={handlePersonCountChange(setTeens)}
                onBlur={handlePersonCountBlur(setTeens)}
              />
            </label>

            <label className={classes.Field}>
              <span className={classes.Label}>{copy.fields.children}</span>
              <input
                className={classes.Input}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={children}
                onChange={handlePersonCountChange(setChildren)}
                onBlur={handlePersonCountBlur(setChildren)}
              />
            </label>

            <label className={classes.Field}>
              <span className={classes.Label}>{copy.fields.toddlers}</span>
              <input
                className={classes.Input}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={toddlers}
                onChange={handlePersonCountChange(setToddlers)}
                onBlur={handlePersonCountBlur(setToddlers)}
              />
            </label>

            <label className={`${classes.Field} ${classes.FieldWide}`}>
              <span className={classes.Label}>{copy.fields.diet}</span>
              <select
                className={classes.Select}
                value={diet}
                onChange={(event) => setDiet(event.target.value)}
              >
                <option value="sekaruoka">{copy.diets.omnivore}</option>
                <option value="kasvispainotteinen">{copy.diets.plantForward}</option>
                <option value="kasvis">{copy.diets.vegetarian}</option>
                <option value="vegaani">{copy.diets.vegan}</option>
              </select>
            </label>
          </div>
        </section>

        <section className={classes.Card} aria-live="polite">
          {result ? (
            <>
              <div className={classes.CardHeader}>
                <h3>{copy.resultsHeading}</h3>
                <p>
                  {copy.scrapsResult({ min: result.scraps[0], max: result.scraps[1] })}
                </p>
              </div>

              <p className={classes.ResultLead}>
                {copy.wormResultPrefix}{' '}
                <strong>
                  {result.wormWeightGrams} {copy.wormResultUnit}
                </strong>
                .
              </p>
              <p>{copy.resultExplanation}</p>

              <ul className={classes.ResultList}>
                <li>{copy.halfStart({ weight: result.options.halfStartWeightGrams })}</li>
                <li>
                  {copy.quarterStart({
                    weight: result.options.quarterStartWeightGrams,
                  })}
                </li>
                <li>
                  {copy.eighthStart({ weight: result.options.eighthStartWeightGrams })}
                </li>
              </ul>

              <p className={classes.FinePrint}>{copy.finePrint}</p>
            </>
          ) : (
            <div className={classes.CardHeader}>
              <h3>{copy.resultsHeading}</h3>
              <p>{copy.emptyResult}</p>
            </div>
          )}
        </section>

        <h2>{copy.tipsHeading}</h2>
        <ul>
          {copy.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>

      <SocialShareButtons
        title={copy.title}
        tags={[language === 'en' ? 'worm-composting' : 'matokomposti']}
        copy={copy.share}
      />
      {language === 'en' ? (
        <FinnishContentLinks compact />
      ) : (
        <ContentRecommendations
          recommendations={recommendations}
          title={copy.recommendationsHeading}
        />
      )}
    </article>
  );
}
