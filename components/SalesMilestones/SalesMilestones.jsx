import { readSalesMilestonesSnapshot } from '@/lib/commerce/salesMilestones.server.mjs';
import { formatNumber } from '@/lib/i18n/formatters.mjs';
import { getProductMessages } from '@/lib/i18n/messages.mjs';

import classes from './SalesMilestones.module.css';

export default function SalesMilestones({ language }) {
  const snapshot = readSalesMilestonesSnapshot();
  const estimatedWormsSold = snapshot?.milestones?.estimatedWormsSold;
  const completedOrders = snapshot?.milestones?.completedOrders;

  if (
    !snapshot?.available ||
    !Number.isSafeInteger(estimatedWormsSold) ||
    estimatedWormsSold <= 0 ||
    !Number.isSafeInteger(completedOrders) ||
    completedOrders <= 0
  ) {
    return null;
  }

  const copy = getProductMessages(language).salesMilestones;
  const milestones = [
    {
      key: 'worms',
      count: estimatedWormsSold,
      label: copy.wormsSoldLabel,
    },
    {
      key: 'orders',
      count: completedOrders,
      label: copy.completedOrdersLabel,
    },
  ];

  return (
    <dl className={classes.Milestones} aria-label={copy.ariaLabel}>
      {milestones.map((milestone) => {
        const formattedCount = formatNumber(milestone.count, language);

        return (
          <div key={milestone.key} className={classes.Item}>
            <dt className={classes.Label}>{milestone.label}</dt>
            <dd
              className={classes.Value}
              aria-label={`${copy.approximately} ${formattedCount}`}
            >
              <span aria-hidden="true">~</span>
              {formattedCount}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
