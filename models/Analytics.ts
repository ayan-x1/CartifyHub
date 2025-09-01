import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  date: Date;
  revenueCents: number;
  ordersCount: number;
  topProducts: Array<{
    productId: mongoose.Types.ObjectId;
    sold: number;
  }>;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  date: { type: Date, required: true, unique: true },
  revenueCents: { type: Number, default: 0 },
  ordersCount: { type: Number, default: 0 },
  topProducts: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    sold: { type: Number, default: 0 }
  }],
});

export default mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);