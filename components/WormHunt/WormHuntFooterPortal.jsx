'use client';

import { createPortal } from 'react-dom';

import useHydrated from '@/hooks/useHydrated';
import { WORM_HUNT_FOOTER_SLOT_ID } from '@/lib/wormHunt/placementTargets.mjs';

import WormHuntSpot from './WormHuntSpot';

export default function WormHuntFooterPortal({ clue }) {
  const isHydrated = useHydrated();
  const footerSlot = isHydrated
    ? document.getElementById(WORM_HUNT_FOOTER_SLOT_ID)
    : null;

  return footerSlot ? createPortal(<WormHuntSpot clue={clue} />, footerSlot) : null;
}
