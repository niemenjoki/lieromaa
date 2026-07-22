import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  WORM_PHASES,
  WORM_PHASE_DURATION_MS,
  WORM_UNDERGROUND_MAX_MS,
  WORM_UNDERGROUND_MIN_MS,
  createInitialWormState,
  getBoundedPhaseOffset,
  getBoundedUndergroundDuration,
  getWormPresentation,
  wormMotionReducer,
} from '@/lib/navigation/wormMotion.mjs';

function startTransition(state, destinationId, undergroundDurationMs = 240) {
  return wormMotionReducer(state, {
    type: 'START_TRANSITION',
    destinationId,
    undergroundDurationMs,
    reducedMotion: false,
  });
}

describe('worm navigation motion', () => {
  test('keeps the random underground pause inside strict bounds', () => {
    assert.equal(
      getBoundedUndergroundDuration(() => 0),
      WORM_UNDERGROUND_MIN_MS
    );
    assert.equal(
      getBoundedUndergroundDuration(() => 1),
      WORM_UNDERGROUND_MAX_MS
    );
    assert.equal(
      getBoundedUndergroundDuration(() => Number.NaN),
      Math.round((WORM_UNDERGROUND_MIN_MS + WORM_UNDERGROUND_MAX_MS) / 2)
    );
  });

  test('keeps the complete decorative journey within the tuned duration', () => {
    const fixedPhaseDuration =
      WORM_PHASE_DURATION_MS[WORM_PHASES.DIVING] +
      WORM_PHASE_DURATION_MS[WORM_PHASES.EMERGING] +
      WORM_PHASE_DURATION_MS[WORM_PHASES.SETTLING];

    assert.equal(fixedPhaseDuration + WORM_UNDERGROUND_MIN_MS, 890);
    assert.equal(fixedPhaseDuration + WORM_UNDERGROUND_MAX_MS, 1070);
  });

  test('rebases resized animations without extending their phase clock', () => {
    assert.equal(getBoundedPhaseOffset(380, 120), 120);
    assert.equal(getBoundedPhaseOffset(380, 999), 379);
    assert.equal(getBoundedPhaseOffset(380, -50), 0);
    assert.equal(getBoundedPhaseOffset(0, 50), 0);
  });

  test('dives from the current item and ignores stale animation events', () => {
    const diving = startTransition(createInitialWormState('home'), 'guides');

    assert.equal(diving.phase, WORM_PHASES.DIVING);
    assert.equal(getWormPresentation(diving, 'home'), WORM_PHASES.DIVING);
    assert.equal(getWormPresentation(diving, 'guides'), 'hidden');

    const unchanged = wormMotionReducer(diving, {
      type: 'ANIMATION_FINISHED',
      phase: WORM_PHASES.DIVING,
      token: diving.token - 1,
    });
    assert.equal(unchanged, diving);
  });

  test('starts underground when a support page has no primary origin', () => {
    const underground = startTransition(createInitialWormState(null), 'guides', 180);

    assert.equal(underground.originId, null);
    assert.equal(underground.destinationId, 'guides');
    assert.equal(underground.phase, WORM_PHASES.UNDERGROUND);
    assert.equal(getWormPresentation(underground, 'guides'), WORM_PHASES.UNDERGROUND);

    const emerging = wormMotionReducer(underground, {
      type: 'UNDERGROUND_FINISHED',
      token: underground.token,
    });
    assert.equal(emerging.phase, WORM_PHASES.EMERGING);
  });

  test('retargets one in-flight journey without queuing the old destination', () => {
    const diving = startTransition(createInitialWormState('home'), 'guides');
    const underground = wormMotionReducer(diving, {
      type: 'ANIMATION_FINISHED',
      phase: WORM_PHASES.DIVING,
      token: diving.token,
    });
    const retargeted = startTransition(underground, 'blog', 360);

    assert.equal(retargeted.phase, WORM_PHASES.UNDERGROUND);
    assert.equal(retargeted.destinationId, 'blog');
    assert.equal(retargeted.undergroundDurationMs, 360);
    assert.equal(getWormPresentation(retargeted, 'guides'), 'hidden');
    assert.equal(getWormPresentation(retargeted, 'blog'), WORM_PHASES.UNDERGROUND);
  });

  test('cancels an unfinished journey when the active route is selected again', () => {
    const diving = startTransition(createInitialWormState('home'), 'guides');
    const cancelled = wormMotionReducer(diving, {
      type: 'ROUTE_RECONCILED',
      activeId: 'home',
    });

    assert.equal(cancelled.phase, WORM_PHASES.RESTING);
    assert.equal(cancelled.destinationId, 'home');
    assert.equal(cancelled.pendingNavigation, false);
    assert.equal(getWormPresentation(cancelled, 'home'), WORM_PHASES.RESTING);

    const retried = startTransition(cancelled, 'guides');
    assert.equal(retried.phase, WORM_PHASES.DIVING);
    assert.equal(retried.destinationId, 'guides');
  });

  test('reconciles history navigation immediately and skips motion when reduced', () => {
    const resting = createInitialWormState('home');
    const historyState = wormMotionReducer(resting, {
      type: 'ROUTE_RECONCILED',
      activeId: 'blog',
    });

    assert.equal(historyState.phase, WORM_PHASES.RESTING);
    assert.equal(historyState.destinationId, 'blog');

    const reduced = wormMotionReducer(historyState, {
      type: 'START_TRANSITION',
      destinationId: 'worms',
      undergroundDurationMs: 400,
      reducedMotion: true,
    });
    assert.equal(reduced.phase, WORM_PHASES.RESTING);
    assert.equal(reduced.destinationId, 'worms');
    assert.equal(reduced.undergroundDurationMs, 0);
  });
});
