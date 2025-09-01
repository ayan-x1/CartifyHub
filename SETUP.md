# CartifyHub Setup Guide

## Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Clerk account for authentication
- Stripe account for payments

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/cartifyhub

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Inngest (Background Jobs)
INNGEST_DEV_URL=http://localhost:8288
INNGEST_EVENT_KEY=your_inngest_event_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your publishable key and secret key
4. Add them to your `.env.local` file

### 3. Set up Stripe

1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your publishable key and secret key from the dashboard
3. Add them to your `.env.local` file
4. Set up webhook endpoints (optional for development)

### 4. Set up MongoDB

1. Install MongoDB locally or use MongoDB Atlas
2. Update the `MONGODB_URI` in your `.env.local` file

### 5. Seed the Database

```bash
npm run seed
```

**Note**: Update the `admin_clerk_id_here` in `scripts/seed.ts` with your actual Clerk user ID.

### 6. Run the Development Server

```bash
npm run dev
```

## Features Implemented

✅ **Core E-commerce**
- Product catalog with search and filtering
- Shopping cart with persistent storage
- User authentication with Clerk
- Stripe checkout integration
- Order management

✅ **Admin Dashboard**
- Product management (CRUD operations)
- Order management and status updates
- Analytics dashboard with charts
- User management

✅ **Advanced Features**
- 3D product previews with Three.js
- Responsive design with Tailwind CSS
- Real-time cart updates
- Order tracking

✅ **UI Components**
- Complete shadcn/ui component library
- Modern, responsive design
- Loading states and error handling
- Toast notifications

## Project Structure

```
├── app/                    # Next.js 13+ App Router
│   ├── admin/            # Admin dashboard pages
│   ├── api/              # API routes
│   ├── checkout/         # Checkout flow
│   ├── products/         # Product pages
│   └── sign-in/          # Authentication pages
├── components/            # React components
│   ├── admin/            # Admin dashboard components
│   └── ui/               # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── models/                # MongoDB schemas
└── scripts/               # Database seeding
```

## API Endpoints

### Public APIs
- `GET /api/products` - Fetch products with filtering
- `GET /api/products/[slug]` - Get product by slug

### Protected APIs
- `POST /api/create-checkout-session` - Create Stripe checkout
- `GET /api/orders/session/[sessionId]` - Get order by session

### Admin APIs
- `GET /api/admin/products` - Fetch all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `GET /api/admin/orders` - Fetch all orders
- `PATCH /api/admin/orders/[id]` - Update order status

## Customization

### Adding New Product Categories
Update the seed script and Product model to include new categories.

### Styling
The app uses Tailwind CSS. Customize colors and styles in `tailwind.config.ts`.

### 3D Models
Add 3D model URLs to products for enhanced previews.

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- Ensure MongoDB connection is accessible
- Set up environment variables
- Configure Clerk and Stripe for production

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your MongoDB URI
   - Ensure MongoDB is running
   - Check network access for Atlas

2. **Clerk Authentication Issues**
   - Verify your Clerk keys
   - Check domain configuration in Clerk dashboard

3. **Stripe Checkout Errors**
   - Verify Stripe keys
   - Check webhook configuration
   - Ensure proper currency setup

4. **3D Model Loading Issues**
   - Check model URL accessibility
   - Ensure GLB/GLTF format
   - Verify CORS settings

## Support

For issues and questions:
- Check the console for error messages
- Review the API responses
- Ensure all environment variables are set correctly

## License

This project is open source and available under the MIT License.
