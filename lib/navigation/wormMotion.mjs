export const WORM_PHASES = Object.freeze({
  RESTING: 'resting',
  DIVING: 'diving',
  UNDERGROUND: 'underground',
  EMERGING: 'emerging',
  SETTLING: 'settling',
});

export const WORM_UNDERGROUND_MIN_MS = 1000;
export const WORM_UNDERGROUND_MAX_MS = 2000;

export const WORM_PHASE_DURATION_MS = Object.freeze({
  [WORM_PHASES.DIVING]: 260,
  [WORM_PHASES.EMERGING]: 280,
  [WORM_PHASES.SETTLING]: 150,
});

function clampUnitInterval(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0.5;
  }

  return Math.min(1, Math.max(0, numericValue));
}

export function getBoundedUndergroundDuration(random = Math.random) {
  const sample = clampUnitInterval(random());
  const range = WORM_UNDERGROUND_MAX_MS - WORM_UNDERGROUND_MIN_MS;
  return Math.round(WORM_UNDERGROUND_MIN_MS + sample * range);
}

export function getBoundedPhaseOffset(durationMs, elapsedMs) {
  const duration = Number(durationMs);
  const elapsed = Number(elapsedMs);

  if (!Number.isFinite(duration) || duration <= 1 || !Number.isFinite(elapsed)) {
    return 0;
  }

  return Math.min(duration - 1, Math.max(0, elapsed));
}

export function createInitialWormState(activeId = null) {
  return {
    routeActiveId: activeId,
    originId: activeId,
    destinationId: activeId,
    phase: WORM_PHASES.RESTING,
    undergroundDurationMs: 0,
    token: 0,
    pendingNavigation: false,
  };
}

function beginTransition(state, action) {
  const destinationId = action.destinationId ?? null;

  if (!destinationId) {
    return state;
  }

  if (
    destinationId === state.routeActiveId ||
    (destinationId === state.destinationId && state.pendingNavigation)
  ) {
    return state;
  }

  const token = state.token + 1;

  if (action.reducedMotion) {
    return {
      ...state,
      originId: destinationId,
      destinationId,
      phase: WORM_PHASES.RESTING,
      undergroundDurationMs: 0,
      token,
      pendingNavigation: state.routeActiveId !== destinationId,
    };
  }

  if (state.phase === WORM_PHASES.UNDERGROUND) {
    return {
      ...state,
      destinationId,
      undergroundDurationMs: action.undergroundDurationMs,
      token,
      pendingNavigation: true,
    };
  }

  const originId =
    state.phase === WORM_PHASES.EMERGING || state.phase === WORM_PHASES.SETTLING
      ? state.destinationId
      : (state.originId ?? state.destinationId ?? state.routeActiveId);

  if (!originId) {
    return {
      ...state,
      originId: null,
      destinationId,
      phase: WORM_PHASES.UNDERGROUND,
      undergroundDurationMs: action.undergroundDurationMs,
      token,
      pendingNavigation: true,
    };
  }

  return {
    ...state,
    originId,
    destinationId,
    phase: WORM_PHASES.DIVING,
    undergroundDurationMs: action.undergroundDurationMs,
    token,
    pendingNavigation: true,
  };
}

function reconcileRoute(state, activeId) {
  if (activeId === state.destinationId && state.pendingNavigation) {
    return {
      ...state,
      routeActiveId: activeId,
      pendingNavigation:
        state.phase === WORM_PHASES.RESTING ? false : state.pendingNavigation,
    };
  }

  if (
    activeId === state.routeActiveId &&
    !state.pendingNavigation &&
    state.phase === WORM_PHASES.RESTING
  ) {
    return state;
  }

  return {
    ...createInitialWormState(activeId),
    token: state.token + 1,
  };
}

function finishAnimation(state, action) {
  if (action.token !== state.token || action.phase !== state.phase) {
    return state;
  }

  if (state.phase === WORM_PHASES.DIVING) {
    return { ...state, phase: WORM_PHASES.UNDERGROUND };
  }

  if (state.phase === WORM_PHASES.EMERGING) {
    return { ...state, phase: WORM_PHASES.SETTLING };
  }

  if (state.phase === WORM_PHASES.SETTLING) {
    return {
      ...state,
      originId: state.destinationId,
      phase: WORM_PHASES.RESTING,
      undergroundDurationMs: 0,
      pendingNavigation: state.routeActiveId !== state.destinationId,
    };
  }

  return state;
}

export function wormMotionReducer(state, action) {
  switch (action.type) {
    case 'START_TRANSITION':
      return beginTransition(state, action);

    case 'ROUTE_RECONCILED':
      return reconcileRoute(state, action.activeId ?? null);

    case 'ANIMATION_FINISHED':
      return finishAnimation(state, action);

    case 'UNDERGROUND_FINISHED':
      if (action.token !== state.token || state.phase !== WORM_PHASES.UNDERGROUND) {
        return state;
      }
      return { ...state, phase: WORM_PHASES.EMERGING };

    case 'REDUCED_MOTION_ENABLED':
      if (state.phase === WORM_PHASES.RESTING) {
        return state;
      }
      return {
        ...state,
        originId: state.destinationId,
        phase: WORM_PHASES.RESTING,
        undergroundDurationMs: 0,
        token: state.token + 1,
        pendingNavigation: state.routeActiveId !== state.destinationId,
      };

    default:
      return state;
  }
}

export function getWormPresentation(state, itemId) {
  if (!itemId) {
    return 'hidden';
  }

  if (state.phase === WORM_PHASES.DIVING) {
    return state.originId === itemId ? WORM_PHASES.DIVING : 'hidden';
  }

  if (state.phase === WORM_PHASES.UNDERGROUND) {
    return state.destinationId === itemId ? WORM_PHASES.UNDERGROUND : 'hidden';
  }

  return state.destinationId === itemId ? state.phase : 'hidden';
}
