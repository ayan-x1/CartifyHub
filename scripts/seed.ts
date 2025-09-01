import { connectDB } from '../lib/mongodb';
import Product from '../models/Product';
import User from '../models/User';
import 'dotenv/config';

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
    price: 15999, // $159.99
    discountPrice: 12999, // $129.99
    rating: 4.5,
    reviewsCount: 127,
    stock: 25,
    categories: ['electronics', 'audio'],
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
    ],
    attributes: {
      color: 'Black',
      battery: '30 hours',
      connectivity: 'Bluetooth 5.0',
    },
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitoring and GPS.',
    price: 29999, // $299.99
    rating: 4.7,
    reviewsCount: 89,
    stock: 15,
    categories: ['electronics', 'fitness'],
    images: [
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
      'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg',
    ],
    attributes: {
      display: 'AMOLED',
      waterproof: 'Yes',
      battery: '7 days',
    },
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Premium ergonomic office chair with lumbar support and adjustable height.',
    price: 34999, // $349.99
    discountPrice: 27999, // $279.99
    rating: 4.3,
    reviewsCount: 203,
    stock: 8,
    categories: ['furniture', 'office'],
    images: [
      'https://images.pexels.com/photos/586740/pexels-photo-586740.jpeg',
      'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
    ],
    attributes: {
      material: 'Mesh',
      adjustable: 'Yes',
      warranty: '5 years',
    },
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with blue switches.',
    price: 12999, // $129.99
    rating: 4.8,
    reviewsCount: 156,
    stock: 32,
    categories: ['electronics', 'gaming'],
    images: [
      'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg',
      'https://images.pexels.com/photos/7915257/pexels-photo-7915257.jpeg',
    ],
    attributes: {
      switches: 'Blue',
      backlight: 'RGB',
      layout: 'Full-size',
    },
  },
  {
    name: 'Premium Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe and 12-cup capacity.',
    price: 8999, // $89.99
    discountPrice: 6999, // $69.99
    rating: 4.4,
    reviewsCount: 234,
    stock: 18,
    categories: ['home', 'kitchen'],
    images: [
      'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg',
      'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg',
    ],
    attributes: {
      capacity: '12 cups',
      programmable: 'Yes',
      thermal: 'Yes',
    },
  },
  {
    name: 'Wireless Gaming Mouse',
    description: 'High-precision wireless gaming mouse with 25K DPI sensor.',
    price: 7999, // $79.99
    rating: 4.6,
    reviewsCount: 98,
    stock: 45,
    categories: ['electronics', 'gaming'],
    images: [
      'https://images.pexels.com/photos/7915257/pexels-photo-7915257.jpeg',
      'https://images.pexels.com/photos/7915257/pexels-photo-7915257.jpeg',
    ],
    attributes: {
      dpi: '25K',
      battery: '70 hours',
      weight: '95g',
    },
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat with alignment lines and carrying strap.',
    price: 3999, // $39.99
    discountPrice: 2999, // $29.99
    rating: 4.2,
    reviewsCount: 167,
    stock: 60,
    categories: ['fitness', 'wellness'],
    images: [
      'https://images.pexels.com/photos/4056530/pexels-photo-4056530.jpeg',
      'https://images.pexels.com/photos/4056530/pexels-photo-4056530.jpeg',
    ],
    attributes: {
      thickness: '6mm',
      material: 'TPE',
      size: '72" x 24"',
    },
  },
  {
    name: 'Smart LED Strip Lights',
    description: 'WiFi-enabled LED strip lights with 16 million colors and voice control.',
    price: 4999, // $49.99
    rating: 4.3,
    reviewsCount: 189,
    stock: 75,
    categories: ['electronics', 'home'],
    images: [
      'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg',
      'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg',
    ],
    attributes: {
      length: '16.4ft',
      colors: '16M',
      wifi: 'Yes',
    },
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with 360-degree sound and 20-hour battery.',
    price: 6999, // $69.99
    discountPrice: 5499, // $54.99
    rating: 4.5,
    reviewsCount: 143,
    stock: 28,
    categories: ['electronics', 'audio'],
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
    ],
    attributes: {
      waterproof: 'IPX7',
      battery: '20 hours',
      weight: '1.1kg',
    },
  },
  {
    name: 'Standing Desk Converter',
    description: 'Adjustable standing desk converter with memory presets.',
    price: 19999, // $199.99
    rating: 4.1,
    reviewsCount: 76,
    stock: 12,
    categories: ['furniture', 'office'],
    images: [
      'https://images.pexels.com/photos/586740/pexels-photo-586740.jpeg',
      'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
    ],
    attributes: {
      height: '17.5"',
      weight: '35lbs',
      memory: 'Yes',
    },
  },
  {
    name: 'Smart Home Security Camera',
    description: '1080p security camera with night vision and two-way audio.',
    price: 8999, // $89.99
    rating: 4.4,
    reviewsCount: 198,
    stock: 22,
    categories: ['electronics', 'security'],
    images: [
      'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg',
      'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg',
    ],
    attributes: {
      resolution: '1080p',
      nightVision: 'Yes',
      audio: 'Two-way',
    },
  },
  {
    name: 'Premium Wireless Earbuds',
    description: 'True wireless earbuds with active noise cancellation and wireless charging.',
    price: 19999, // $199.99
    discountPrice: 15999, // $159.99
    rating: 4.7,
    reviewsCount: 267,
    stock: 35,
    categories: ['electronics', 'audio'],
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
    ],
    attributes: {
      anc: 'Yes',
      battery: '6 hours',
      charging: 'Wireless',
    },
  },
  {
    name: 'Gaming Headset with Mic',
    description: 'Surround sound gaming headset with detachable microphone and RGB lighting.',
    price: 9999, // $99.99
    rating: 4.3,
    reviewsCount: 134,
    stock: 40,
    categories: ['electronics', 'gaming'],
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
    ],
    attributes: {
      sound: '7.1 Surround',
      mic: 'Detachable',
      lighting: 'RGB',
    },
  },
  {
    name: 'Smartphone Tripod Stand',
    description: 'Adjustable smartphone tripod with Bluetooth remote and phone holder.',
    price: 2999, // $29.99
    discountPrice: 1999, // $19.99
    rating: 4.0,
    reviewsCount: 89,
    stock: 85,
    categories: ['electronics', 'accessories'],
    images: [
      'https://images.pexels.com/photos/7915257/pexels-photo-7915257.jpeg',
      'https://images.pexels.com/photos/7915257/pexels-photo-7915257.jpeg',
    ],
    attributes: {
      height: '50"',
      remote: 'Bluetooth',
      weight: '1.2kg',
    },
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 3999, // $39.99
    rating: 4.2,
    reviewsCount: 156,
    stock: 65,
    categories: ['electronics', 'accessories'],
    images: [
      'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg',
      'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg',
    ],
    attributes: {
      power: '15W',
      compatibility: 'Qi',
      led: 'Yes',
    },
  },
  {
    name: 'Smart Water Bottle',
    description: 'Hydration tracking water bottle with reminder notifications.',
    price: 5999, // $59.99
    rating: 4.1,
    reviewsCount: 78,
    stock: 30,
    categories: ['fitness', 'wellness'],
    images: [
      'https://images.pexels.com/photos/4056530/pexels-photo-4056530.jpeg',
      'https://images.pexels.com/photos/4056530/pexels-photo-4056530.jpeg',
    ],
    attributes: {
      capacity: '32oz',
      tracking: 'Yes',
      material: 'Stainless Steel',
    },
  },
  {
    name: 'Portable Power Bank',
    description: '20000mAh power bank with fast charging and multiple USB ports.',
    price: 3999, // $39.99
    discountPrice: 2999, // $29.99
    rating: 4.4,
    reviewsCount: 234,
    stock: 55,
    categories: ['electronics', 'accessories'],
    images: [
      'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg',
      'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg',
    ],
    attributes: {
      capacity: '20000mAh',
      ports: '3 USB',
      fastCharge: 'Yes',
    },
  },
  {
    name: 'Smart Door Lock',
    description: 'WiFi-enabled smart door lock with fingerprint and keypad access.',
    price: 29999, // $299.99
    rating: 4.3,
    reviewsCount: 67,
    stock: 8,
    categories: ['electronics', 'security'],
    images: [
      'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg',
      'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg',
    ],
    attributes: {
      wifi: 'Yes',
      fingerprint: 'Yes',
      battery: '1 year',
    },
  },
  {
    name: 'Bluetooth Car Adapter',
    description: 'Wireless Bluetooth adapter for cars with aux input and hands-free calling.',
    price: 1999, // $19.99
    rating: 4.0,
    reviewsCount: 145,
    stock: 90,
    categories: ['electronics', 'automotive'],
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
    ],
    attributes: {
      range: '10m',
      battery: '8 hours',
      calling: 'Hands-free',
    },
  },
  {
    name: 'Smart Plant Pot',
    description: 'Self-watering smart plant pot with moisture sensors and app control.',
    price: 7999, // $79.99
    rating: 4.2,
    reviewsCount: 56,
    stock: 25,
    categories: ['home', 'garden'],
    images: [
      'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg',
      'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg',
    ],
    attributes: {
      capacity: '2L',
      sensors: 'Moisture',
      app: 'Yes',
    },
  },
];

async function seedDatabase() {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});

    // ✅ Seed products with middleware (slug auto-generated)
    await Product.create(sampleProducts);
    console.log('Products seeded successfully');

    // Create admin user
    await User.create({
      clerkId: 'admin_clerk_id_here', // Replace with actual Clerk ID
      email: 'admin@cartifyhub.com',
      name: 'Admin User',
      isAdmin: true,
    });
    console.log('Admin user created');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();
