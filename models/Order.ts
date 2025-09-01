import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number; // in cents
  quantity: number;
  image: string;
}

export interface IOrder extends Document {
  userId: string; // Clerk user ID
  items: IOrderItem[];
  subtotal: number; // in cents
  shipping: number; // in cents
  tax: number; // in cents
  total: number; // in cents
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'fulfilled' | 'refunded';
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: true, index: true },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'fulfilled', 'refunded'], 
    default: 'pending' 
  },
  stripeSessionId: { type: String },
  stripePaymentIntentId: { type: String },
  trackingNumber: { type: String },
}, {
  timestamps: true,
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);