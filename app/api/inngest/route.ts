import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest';
import { orderPaidHandler, orderFulfilledHandler } from '@/inngest/functions';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    orderPaidHandler,
    orderFulfilledHandler,
  ],
});