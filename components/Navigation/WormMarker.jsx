'use client';

import classes from './WormMarker.module.css';
import { useWormNavigation } from './WormNavigationProvider';

export default function WormMarker({ itemId }) {
  const {
    animationEpoch,
    animationOffsetMs,
    destinationId,
    finishAnimation,
    getPresentation,
    originId,
    token,
    undergroundDurationMs,
  } = useWormNavigation();
  const presentation = getPresentation(itemId);
  const phaseClass = classes[presentation] ?? classes.hidden;

  const handleAnimationEnd = (event) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    finishAnimation(presentation, token);
  };

  return (
    <span
      className={`${classes.Marker} ${phaseClass}`}
      aria-hidden="true"
      data-worm-marker={itemId}
      data-worm-phase={presentation}
      data-worm-origin={originId ?? ''}
      data-worm-destination={destinationId ?? ''}
      data-worm-token={token}
      data-worm-animation-epoch={animationEpoch}
      data-worm-animation-offset-ms={animationOffsetMs}
      data-worm-underground-ms={undergroundDurationMs}
      style={{ '--worm-phase-offset': `${animationOffsetMs}ms` }}
    >
      <span className={classes.SoilSlit} />
      <span
        key={`clock-${token}-${animationEpoch}-${presentation}`}
        className={classes.PhaseClock}
        onAnimationEnd={handleAnimationEnd}
      />
      <svg
        key={`${token}-${animationEpoch}-${presentation}`}
        className={classes.WormGraphic}
        viewBox="0 0 58 26"
        focusable="false"
      >
        <g className={classes.TailGroup}>
          <path className={classes.WormBody} d="M4 19 C7.2 10.2, 11.2 5.8, 16 8.6" />
          <path className={classes.Segment} d="M11.8 8.5 14.3 10.5" />
        </g>
        <g className={classes.BodyGroup}>
          <path
            className={classes.WormBody}
            d="M14.7 8 C19.4 6.3, 23.2 9.1, 25.4 15.1 C27.8 21.2, 32.4 22.4, 37.6 19"
          />
          <path className={classes.Segment} d="M22.8 11.5 25.7 12.8M33.8 20l.5-3" />
        </g>
        <g className={classes.FrontGroup}>
          <path className={classes.WormBody} d="M36.7 19.5 C41.2 17.5, 44 11.2, 48.3 9" />
        </g>
        <g className={classes.HeadGroup}>
          <circle className={classes.WormHead} cx="49" cy="8.6" r="4.2" />
          <circle className={classes.Eye} cx="50.4" cy="7.5" r="0.75" />
        </g>
      </svg>
    </span>
  );
}
