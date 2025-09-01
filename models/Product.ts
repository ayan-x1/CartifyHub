import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  images: string[];
  price: number; // in cents
  discountPrice?: number; // in cents
  rating: number;
  reviewsCount: number;
  stock: number;
  categories: string[];
  attributes: Record<string, any>;
  model3d?: string; // URL to 3D model
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    images: [{ type: String }],
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    categories: [{ type: String }],
    attributes: { type: Schema.Types.Mixed, default: {} },
    model3d: { type: String },
  },
  {
    timestamps: true,
  }
);

// ✅ Generate slug automatically before validation
ProductSchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.models.Product ||
  mongoose.model<IProduct>('Product', ProductSchema);
