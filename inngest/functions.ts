import { inngest } from '@/lib/inngest';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Analytics from '@/models/Analytics';

export const orderPaidHandler = inngest.createFunction(
  { id: 'order-paid', name: 'Process Paid Order' },
  { event: 'order.paid' },
  async ({ event, step }) => {
    const { orderId } = event.data;

    await connectDB();

    // Step 1: Get order details
    const order = await step.run('get-order', async () => {
      const orderDoc = await Order.findById(orderId).populate('items.productId');
      if (!orderDoc) {
        throw new Error('Order not found');
      }
      return orderDoc;
    });

    // Step 2: Update product stock
    await step.run('update-stock', async () => {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        );
      }
    });

    // Step 3: Update analytics
    await step.run('update-analytics', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const analytics = await Analytics.findOneAndUpdate(
        { date: today },
        {
          $inc: {
            revenueCents: order.total,
            ordersCount: 1,
          },
          $push: {
            topProducts: {
              $each: order.items.map((item: any) => ({
                productId: item.productId,
                sold: item.quantity,
              }))
            }
          }
        },
        { upsert: true, new: true }
      );

      return analytics;
    });

    // Step 4: Send confirmation email (simulated)
    await step.run('send-confirmation-email', async () => {
      console.log(`📧 Sending order confirmation email for order ${orderId}`);
      console.log(`   Customer: ${order.userId}`);
      console.log(`   Total: $${(order.total / 100).toFixed(2)}`);
      console.log(`   Items: ${order.items.length}`);
      
      // In production, integrate with SendGrid, Postmark, or similar
      return { emailSent: true };
    });

    return { success: true, orderId };
  }
);

export const orderFulfilledHandler = inngest.createFunction(
  { id: 'order-fulfilled', name: 'Process Fulfilled Order' },
  { event: 'order.fulfilled' },
  async ({ event, step }) => {
    const { orderId, trackingNumber } = event.data;

    await connectDB();

    // Step 1: Update order status
    const order = await step.run('update-order', async () => {
      return await Order.findByIdAndUpdate(
        orderId,
        { 
          status: 'fulfilled',
          trackingNumber: trackingNumber || undefined
        },
        { new: true }
      );
    });

    // Step 2: Send shipping notification (simulated)
    await step.run('send-shipping-email', async () => {
      console.log(`📦 Sending shipping notification for order ${orderId}`);
      console.log(`   Customer: ${order?.userId}`);
      console.log(`   Tracking: ${trackingNumber || 'N/A'}`);
      
      return { emailSent: true };
    });

    return { success: true, orderId };
  }
);