import { createCollectHandler } from '@/lib/looku/next.js';

export const dynamic = 'force-dynamic';

// Looku's browser collector posts here only after analytics consent. The handler
// accepts same-origin requests and forwards the data to Looku without the IP
// address or user agent.
export const POST = createCollectHandler();
