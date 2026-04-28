'use client';

import { useState } from 'react';

import PostRecommendation from '@/components/PostRecommendation/PostRecommendation';
import SafeLink from '@/components/SafeLink/SafeLink';
import SocialShareButtons from '@/components/SocialShareButtons/SocialShareButtons';
import useDebounce from '@/hooks/useDebounce';

import classes from './WormCalculatorClient.module.css';

function normalizePersonCount(value) {
  const parsedValue = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
}

function formatWormWeightGrams(weightGrams) {
  return `${weightGrams} g`;
}

function formatWormWeightInstrumental(weightGrams) {
  return `${weightGrams} grammalla`;
}

export default function WormCalculatorClient({ recommendedPosts }) {
  const title = 'Matolaskuri';
  const description =
    'Syötä kotitaloutesi tiedot ja laskuri arvioi tuottamasi biojätteen määrän sekä tarvittavan matojen painon.';

  const [adults, setAdults] = useState(0);
  const [teens, setTeens] = useState(0);
  const [children, setChildren] = useState(0);
  const [toddlers, setToddlers] = useState(0);
  const [diet, setDiet] = useState('sekaruoka');
  const [result, setResult] = useState(null);

  const baseWaste = { adult: 250, teen: 300, child: 200, toddler: 120 };
  const dietFactors = {
    sekaruoka: 1.0,
    kasvispainotteinen: 1.1,
    kasvis: 1.2,
    vegaani: 1.3,
  };

  function calculate() {
    const householdSize = adults + teens + children + toddlers;
    if (householdSize <= 0) {
      setResult(null);
      return;
    }

    const factor = dietFactors[diet];
    const total =
      adults * baseWaste.adult +
      teens * baseWaste.teen +
      children * baseWaste.child +
      toddlers * baseWaste.toddler;
    const adjustedTotal = Math.round(total * factor);
    const min = Math.round(adjustedTotal * 0.8);
    const max = Math.round(adjustedTotal * 1.2);
    const wormsNeeded = adjustedTotal;
    const wormWeightGrams = Math.round(wormsNeeded * 0.5);
    const halfStart = Math.round(wormsNeeded / 2);
    const quarterStart = Math.round(wormsNeeded / 4);
    const eighthStart = Math.round(wormsNeeded / 8);
    setResult({
      scraps: [min, max],
      wormsNeeded,
      wormWeightGrams,
      options: {
        halfStart,
        halfStartWeightGrams: Math.round(halfStart * 0.5),
        quarterStart,
        quarterStartWeightGrams: Math.round(quarterStart * 0.5),
        eighthStart,
        eighthStartWeightGrams: Math.round(eighthStart * 0.5),
      },
    });
  }

  useDebounce(
    () => {
      calculate();
    },
    2000,
    [adults, teens, children, toddlers, diet]
  );

  return (
    <article className={classes.WormCalculatorClient}>
      <h1>{title}</h1>
      <p>{description}</p>

      <div className={classes.Content}>
        <h2>Miksi laskuri on hyödyllinen?</h2>
        <p>
          Kompostimatojen aloitusmäärän mitoittaminen oikein auttaa pitämään kompostorin
          tasapainossa. Liian pieni populaatio ei ehdi käsittelemään kaikkea jätettä, ja
          liian suuri populaatio taas kärsii ruoan puutteesta. Laskurin avulla saat
          karkean arvion siitä, kuinka paljon matoja kotitaloutesi tuottaman biojätteen
          käsittelyyn tarvitaan painona.
        </p>
        <p>
          Jos sinulla ei vielä ole matoja, voit ostaa niitä{' '}
          <SafeLink href="/tuotteet/madot">täältä</SafeLink>.
        </p>

        <h2>Laskuri</h2>
        <p>
          Arvio perustuu kotitalouden kokoon, ruokavalioon ja oletukseen, että
          matopopulaatio kaksinkertaistuu noin 3 kuukaudessa. Tulokset ovat
          suuntaa-antavia - käytännössä biojätteen määrä ja matojen syönti riippuvat mm.
          lämpötilasta, kosteudesta ja ruoan laadusta.
        </p>

        <section className={classes.Card}>
          <div className={classes.CardHeader}>
            <h3>Syötä kotitalouden tiedot</h3>
            <p>
              Laskurin tulos päivittyy automaattisesti, kun valitset talouden koon ja
              ruokavalion.
            </p>
          </div>

          <div className={classes.FormGrid}>
            <label className={classes.Field}>
              <span className={classes.Label}>Aikuiset</span>
              <input
                className={classes.Input}
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={adults}
                onChange={(event) => setAdults(normalizePersonCount(event.target.value))}
              />
            </label>

            <label className={classes.Field}>
              <span className={classes.Label}>Teinit (13-17 v.)</span>
              <input
                className={classes.Input}
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={teens}
                onChange={(event) => setTeens(normalizePersonCount(event.target.value))}
              />
            </label>

            <label className={classes.Field}>
              <span className={classes.Label}>Lapset (4-12 v.)</span>
              <input
                className={classes.Input}
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={children}
                onChange={(event) =>
                  setChildren(normalizePersonCount(event.target.value))
                }
              />
            </label>

            <label className={classes.Field}>
              <span className={classes.Label}>Taaperot (1-3 v.)</span>
              <input
                className={classes.Input}
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={toddlers}
                onChange={(event) =>
                  setToddlers(normalizePersonCount(event.target.value))
                }
              />
            </label>

            <label className={`${classes.Field} ${classes.FieldWide}`}>
              <span className={classes.Label}>Ruokavalio</span>
              <select
                className={classes.Select}
                value={diet}
                onChange={(event) => setDiet(event.target.value)}
              >
                <option value="sekaruoka">Sekaruokavalio</option>
                <option value="kasvispainotteinen">Kasvispainotteinen</option>
                <option value="kasvis">Kasvis</option>
                <option value="vegaani">Vegaani</option>
              </select>
            </label>
          </div>
        </section>

        <section className={classes.Card} aria-live="polite">
          {result ? (
            <>
              <div className={classes.CardHeader}>
                <h3>Tulokset</h3>
                <p>
                  Kotitaloutesi tuottaa arviolta {result.scraps[0]} - {result.scraps[1]} g
                  biojätettä viikossa.
                </p>
              </div>

              <p className={classes.ResultLead}>
                Sen käsittelemiseen tarvitaan noin{' '}
                <strong>{formatWormWeightGrams(result.wormWeightGrams)} matoja</strong>.
              </p>
              <p>
                Koko suositellun määrän hankkimalla kompostori toimii heti täydellä
                teholla. Toinen vaihtoehto on hankkia pienempi määrä matoja ja odottaa,
                että ne lisääntyvät.
              </p>

              <ul className={classes.ResultList}>
                <li>
                  {`Jos aloitat noin ${formatWormWeightInstrumental(
                    result.options.halfStartWeightGrams
                  )}, kestää noin 3 kuukautta, että sinulla on tarvittava määrä matoja.`}
                </li>
                <li>
                  {`Jos aloitat noin ${formatWormWeightInstrumental(
                    result.options.quarterStartWeightGrams
                  )}, aikaa kuluu noin 6 kuukautta.`}
                </li>
                <li>
                  {`Vähimmäisvaihtoehtona ${formatWormWeightInstrumental(
                    result.options.eighthStartWeightGrams
                  )} kompostori toimii täysillä noin vuoden kuluttua.`}
                </li>
              </ul>

              <p className={classes.FinePrint}>
                Laskelma perustuu oletukseen, että yksi mato painaa noin 0.5 g ja syö noin
                1 g biojätettä viikossa. Populaatio tuplaantuu keskimäärin 3 kuukauden
                välein.
              </p>
            </>
          ) : (
            <>
              <div className={classes.CardHeader}>
                <h3>Tulokset</h3>
                <p>
                  Täytä kotitalouden henkilömäärät, niin laskuri näyttää arvion syntyvän
                  biojätteen määrästä ja sopivasta matojen painosta.
                </p>
              </div>
            </>
          )}
        </section>

        <h2>Vinkkejä tulosten tulkintaan</h2>
        <ul>
          <li>
            Jos aloitat pienellä määrällä, anna populaation kasvaa rauhassa - vältä
            liiallista ruokintaa.
          </li>
          <li>
            Jos aloitat suurella määrällä, varmista että biojätettä riittää heti alusta
            asti.
          </li>
          <li>
            Muista, että matojen kasvu ja syönti vaihtelevat kompostorin olosuhteiden
            mukaan.
          </li>
        </ul>
      </div>

      <SocialShareButtons title={title} text={description} tags={['matokomposti']} />
      <PostRecommendation
        posts={recommendedPosts}
        customTitle="Aiheeseen liittyviä blogijulkaisuja"
      />
    </article>
  );
}
