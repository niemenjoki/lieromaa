import {
  ANALYTICS_OPT_OUT_PATH,
  ANALYTICS_OPT_OUT_STORAGE_KEY,
  ANALYTICS_OPT_OUT_STORAGE_VALUE,
} from '@/lib/analytics/optOut.js';
import { ANALYTICS_EXCLUDED_PATHS } from '@/lib/analytics/pathPolicy.mjs';

// Looku settings shared by the proxy (page views) and the not-found pages (missing pages). The receiver address and
// keys come from the environment variables LOOKU_ENDPOINT, LOOKU_SITE_ID and LOOKU_SIGNING_KEY. Only production sends
// data.
export const LOOKU_OPTIONS = {
  excludePaths: [ANALYTICS_OPT_OUT_PATH, ...ANALYTICS_EXCLUDED_PATHS],
  optOutCookie: {
    name: ANALYTICS_OPT_OUT_STORAGE_KEY,
    value: ANALYTICS_OPT_OUT_STORAGE_VALUE,
  },
};
