import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  isAdmin: boolean;
  wishlist: mongoose.Types.ObjectId[];
  addresses: Array<{
    _id: mongoose.Types.ObjectId;
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true, timestamps: false }
);

const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String },
  avatarUrl: { type: String },
  isAdmin: { type: Boolean, default: false },
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product', default: [] }],
  addresses: { type: [AddressSchema], default: [] },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);