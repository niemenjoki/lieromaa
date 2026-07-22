'use client';

import { useEffect, useRef, useState } from 'react';

import { WORM_PHASES } from '@/lib/navigation/wormMotion.mjs';

import classes from './WormBurrowTrail.module.css';
import { useWormNavigation } from './WormNavigationProvider';

function findPrimaryLink(container, itemId) {
  if (!container || !itemId) {
    return null;
  }

  return Array.from(container.querySelectorAll('[data-primary-navigation-id]')).find(
    (node) => node.dataset.primaryNavigationId === itemId
  );
}

function getLinkCenter(containerRect, link) {
  if (!link) {
    return null;
  }

  const linkRect = link.getBoundingClientRect();
  return linkRect.left - containerRect.left + linkRect.width / 2;
}

export default function WormBurrowTrail({ containerRef, surface }) {
  const {
    animationEpoch,
    animationOffsetMs,
    destinationId,
    originId,
    phase,
    prefersReducedMotion,
    token,
    undergroundDurationMs,
  } = useWormNavigation();
  const [positions, setPositions] = useState({
    animationEpoch: 0,
    animationOffsetMs: 0,
    durationMs: 0,
    from: 0,
    ready: false,
    to: 0,
    token: null,
  });
  const positionsRef = useRef(positions);
  const wakeRef = useRef(null);
  positionsRef.current = positions;

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !destinationId) {
      setPositions({
        animationEpoch,
        animationOffsetMs,
        durationMs: undergroundDurationMs,
        from: 0,
        ready: false,
        to: 0,
        token,
      });
      return undefined;
    }

    let cancelled = false;
    const measure = () => {
      if (cancelled || !container.isConnected) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const destinationLink = findPrimaryLink(container, destinationId);
      const originLink = findPrimaryLink(container, originId) ?? destinationLink;
      const to = getLinkCenter(containerRect, destinationLink);
      let from = getLinkCenter(containerRect, originLink);
      const previousPositions = positionsRef.current;
      const isUndergroundRetarget =
        phase === WORM_PHASES.UNDERGROUND &&
        previousPositions.ready &&
        previousPositions.token !== token &&
        wakeRef.current;

      if (isUndergroundRetarget) {
        const wakeRect = wakeRef.current.getBoundingClientRect();
        if (wakeRect.width > 0) {
          from = wakeRect.left - containerRect.left + wakeRect.width / 2;
        }
      }

      if (from == null || to == null || containerRect.width === 0) {
        setPositions({
          animationEpoch,
          animationOffsetMs,
          durationMs: undergroundDurationMs,
          from: 0,
          ready: false,
          to: 0,
          token,
        });
        return;
      }

      setPositions((current) => {
        if (
          current.ready &&
          current.from === from &&
          current.to === to &&
          current.token === token &&
          current.durationMs === undergroundDurationMs &&
          current.animationEpoch === animationEpoch &&
          current.animationOffsetMs === animationOffsetMs
        ) {
          return current;
        }

        const nextPositions = {
          animationEpoch,
          animationOffsetMs,
          durationMs: undergroundDurationMs,
          from,
          ready: true,
          to,
          token,
        };
        positionsRef.current = nextPositions;
        return nextPositions;
      });
    };

    measure();

    const resizeObserver = globalThis.ResizeObserver ? new ResizeObserver(measure) : null;
    resizeObserver?.observe(container);

    const destinationLink = findPrimaryLink(container, destinationId);
    const originLink = findPrimaryLink(container, originId);
    if (destinationLink) resizeObserver?.observe(destinationLink);
    if (originLink) resizeObserver?.observe(originLink);

    globalThis.addEventListener?.('resize', measure);
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      globalThis.removeEventListener?.('resize', measure);
    };
  }, [
    animationEpoch,
    animationOffsetMs,
    containerRef,
    destinationId,
    originId,
    phase,
    token,
    undergroundDurationMs,
  ]);

  const isActive =
    positions.ready && phase === WORM_PHASES.UNDERGROUND && !prefersReducedMotion;

  return (
    <span
      className={`${classes.Layer} ${classes[surface]} ${isActive ? classes.active : ''}`}
      aria-hidden="true"
      data-worm-burrow-surface={surface}
      data-worm-burrow-active={isActive ? 'true' : 'false'}
      data-worm-burrow-origin={originId ?? ''}
      data-worm-burrow-destination={destinationId ?? ''}
      style={{
        '--worm-origin-x': `${positions.from}px`,
        '--worm-destination-x': `${positions.to}px`,
        '--worm-underground-ms': `${positions.durationMs}ms`,
        '--worm-animation-offset': `${positions.animationOffsetMs}ms`,
      }}
    >
      {isActive ? (
        <span
          ref={wakeRef}
          key={`${positions.token ?? token}-${positions.animationEpoch}`}
          className={classes.Wake}
        >
          <span className={classes.Mound} />
          <span className={`${classes.Particle} ${classes.ParticleStart}`} />
          <span className={`${classes.Particle} ${classes.ParticleEnd}`} />
        </span>
      ) : null}
    </span>
  );
}
