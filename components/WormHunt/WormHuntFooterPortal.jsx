'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { WORM_HUNT_FOOTER_SLOT_ID } from '@/lib/wormHunt/placementTargets.mjs';

import WormHuntSpot from './WormHuntSpot';

export default function WormHuntFooterPortal({ clue }) {
  const [footerSlot, setFooterSlot] = useState(null);

  useEffect(() => {
    setFooterSlot(document.getElementById(WORM_HUNT_FOOTER_SLOT_ID));
  }, []);

  return footerSlot ? createPortal(<WormHuntSpot clue={clue} />, footerSlot) : null;
}
