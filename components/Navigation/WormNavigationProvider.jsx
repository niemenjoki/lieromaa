'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import { usePathname } from 'next/navigation';

import {
  findActiveNavigationItem,
  findPrimaryNavigationIdForHref,
} from '@/lib/navigation/activeRoute.mjs';
import {
  WORM_PHASES,
  WORM_PHASE_DURATION_MS,
  createInitialWormState,
  getBoundedPhaseOffset,
  getBoundedUndergroundDuration,
  getWormPresentation,
  wormMotionReducer,
} from '@/lib/navigation/wormMotion.mjs';

const WormNavigationContext = createContext(null);

export default function WormNavigationProvider({ children, primaryItems = [] }) {
  const pathname = usePathname();
  const activeItem = useMemo(
    () => findActiveNavigationItem(primaryItems, pathname),
    [pathname, primaryItems]
  );
  const routeActiveId = activeItem?.id ?? null;
  const [state, dispatch] = useReducer(
    wormMotionReducer,
    routeActiveId,
    createInitialWormState
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const phaseClockRef = useRef({ durationMs: 0, phase: null, startedAt: 0, token: -1 });
  const [surfaceAnimation, setSurfaceAnimation] = useState({
    epoch: 0,
    offsetMs: 0,
    phase: null,
    token: -1,
  });
  const phaseDurationMs =
    state.phase === WORM_PHASES.UNDERGROUND
      ? state.undergroundDurationMs
      : (WORM_PHASE_DURATION_MS[state.phase] ?? 0);

  if (
    phaseClockRef.current.phase !== state.phase ||
    phaseClockRef.current.token !== state.token
  ) {
    phaseClockRef.current = {
      durationMs: phaseDurationMs,
      phase: state.phase,
      startedAt: globalThis.performance?.now?.() ?? Date.now(),
      token: state.token,
    };
  } else {
    phaseClockRef.current.durationMs = phaseDurationMs;
  }

  useEffect(() => {
    dispatch({ type: 'ROUTE_RECONCILED', activeId: routeActiveId });
  }, [routeActiveId]);

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');

    if (!mediaQuery) {
      return undefined;
    }

    const updatePreference = () => {
      const shouldReduce = mediaQuery.matches;
      setPrefersReducedMotion(shouldReduce);
      if (shouldReduce) {
        dispatch({ type: 'REDUCED_MOTION_ENABLED' });
      }
    };

    updatePreference();
    mediaQuery.addEventListener?.('change', updatePreference);
    return () => mediaQuery.removeEventListener?.('change', updatePreference);
  }, []);

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia?.('(min-width: 961px)');

    if (!mediaQuery) {
      return undefined;
    }

    const alignVisiblePhaseClock = () => {
      const clock = phaseClockRef.current;
      const now = globalThis.performance?.now?.() ?? Date.now();
      const elapsedMs = Math.max(0, now - clock.startedAt);
      const offsetMs = getBoundedPhaseOffset(clock.durationMs, elapsedMs);

      setSurfaceAnimation((current) => ({
        epoch: current.epoch + 1,
        offsetMs,
        phase: clock.phase,
        token: clock.token,
      }));
    };

    mediaQuery.addEventListener?.('change', alignVisiblePhaseClock);
    return () => mediaQuery.removeEventListener?.('change', alignVisiblePhaseClock);
  }, []);

  useEffect(() => {
    if (state.phase !== WORM_PHASES.UNDERGROUND) {
      return undefined;
    }

    const transitionToken = state.token;
    const timeoutId = globalThis.setTimeout(() => {
      dispatch({ type: 'UNDERGROUND_FINISHED', token: transitionToken });
    }, state.undergroundDurationMs);

    return () => globalThis.clearTimeout(timeoutId);
  }, [state.phase, state.token, state.undergroundDurationMs]);

  useEffect(() => {
    const phaseDuration = WORM_PHASE_DURATION_MS[state.phase];

    if (!phaseDuration) {
      return undefined;
    }

    const transitionToken = state.token;
    const fallbackId = globalThis.setTimeout(() => {
      dispatch({
        type: 'ANIMATION_FINISHED',
        phase: state.phase,
        token: transitionToken,
      });
    }, phaseDuration + 100);

    return () => globalThis.clearTimeout(fallbackId);
  }, [state.phase, state.token]);

  const beginTransition = useCallback(
    (destinationId) => {
      if (!destinationId) {
        return false;
      }

      if (destinationId === routeActiveId) {
        dispatch({ type: 'ROUTE_RECONCILED', activeId: routeActiveId });
        return false;
      }

      if (destinationId === state.destinationId && state.pendingNavigation) {
        return false;
      }

      dispatch({
        type: 'START_TRANSITION',
        destinationId,
        undergroundDurationMs: prefersReducedMotion ? 0 : getBoundedUndergroundDuration(),
        reducedMotion: prefersReducedMotion,
      });
      return true;
    },
    [prefersReducedMotion, routeActiveId, state.destinationId, state.pendingNavigation]
  );

  const finishAnimation = useCallback((phase, token) => {
    dispatch({ type: 'ANIMATION_FINISHED', phase, token });
  }, []);

  const getPresentation = useCallback(
    (itemId) => getWormPresentation(state, itemId),
    [state]
  );

  const getPrimaryIdForHref = useCallback(
    (href) => findPrimaryNavigationIdForHref(primaryItems, href),
    [primaryItems]
  );

  const animationOffsetMs =
    surfaceAnimation.phase === state.phase && surfaceAnimation.token === state.token
      ? surfaceAnimation.offsetMs
      : 0;

  const value = useMemo(
    () => ({
      ...state,
      animationEpoch: surfaceAnimation.epoch,
      animationOffsetMs,
      routeActiveId,
      prefersReducedMotion,
      beginTransition,
      finishAnimation,
      getPresentation,
      getPrimaryIdForHref,
    }),
    [
      state,
      surfaceAnimation.epoch,
      animationOffsetMs,
      routeActiveId,
      prefersReducedMotion,
      beginTransition,
      finishAnimation,
      getPresentation,
      getPrimaryIdForHref,
    ]
  );

  return (
    <WormNavigationContext.Provider value={value}>
      {children}
    </WormNavigationContext.Provider>
  );
}

export function useWormNavigation() {
  const context = useContext(WormNavigationContext);

  if (!context) {
    throw new Error('useWormNavigation must be used within WormNavigationProvider.');
  }

  return context;
}
