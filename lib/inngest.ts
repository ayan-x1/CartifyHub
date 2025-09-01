import { Inngest } from 'inngest';

export const inngest = new Inngest({ 
  id: 'cartifyhub',
  eventKey: process.env.INNGEST_EVENT_KEY
});

// Event types
export type OrderCreatedEvent = {
  name: 'order.created';
  data: {
    orderId: string;
    userId: string;
    total: number;
  };
};

export type OrderPaidEvent = {
  name: 'order.paid';
  data: {
    orderId: string;
    stripeSessionId: string;
  };
};

export type OrderFulfilledEvent = {
  name: 'order.fulfilled';
  data: {
    orderId: string;
    trackingNumber?: string;
  };
};

export type AppEvents = OrderCreatedEvent | OrderPaidEvent | OrderFulfilledEvent;