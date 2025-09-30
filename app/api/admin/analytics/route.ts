import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import Analytics from '@/models/Analytics';

function getRangeDays(range: string | null): number {
  switch (range) {
    case '7d':
      return 7;
    case '90d':
      return 90;
    case '1y':
      return 365;
    case '30d':
    default:
      return 30;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const rangeParam = searchParams.get('range');
    const days = getRangeDays(rangeParam);

    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);

    // Only include paid or fulfilled orders for revenue metrics
    const revenueMatch = {
      status: { $in: ['paid', 'fulfilled'] },
      createdAt: { $gte: startDate, $lte: now },
    } as any;

    // Total revenue for period
    const revenueAgg = await Order.aggregate([
      { $match: revenueMatch },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
    ]);
    const periodRevenue = revenueAgg[0]?.total || 0;
    const periodOrders = revenueAgg[0]?.count || 0;

    // Previous period for change percentage
    const prevStart = new Date(startDate);
    prevStart.setDate(prevStart.getDate() - days);
    const prevAgg = await Order.aggregate([
      { $match: { ...revenueMatch, createdAt: { $gte: prevStart, $lt: startDate } } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
    ]);
    const prevRevenue = prevAgg[0]?.total || 0;
    const prevOrders = prevAgg[0]?.count || 0;

    const revenueChange = prevRevenue === 0 ? 100 : ((periodRevenue - prevRevenue) / prevRevenue) * 100;
    const ordersChange = prevOrders === 0 ? 100 : ((periodOrders - prevOrders) / prevOrders) * 100;

    // Customers: total users and change over period based on users created
    const totalCustomers = await User.countDocuments({});
    const customersThisPeriod = await User.countDocuments({ createdAt: { $gte: startDate, $lte: now } });
    const customersPrevPeriod = await User.countDocuments({ createdAt: { $gte: prevStart, $lt: startDate } });
    const customersChange = customersPrevPeriod === 0 ? 100 : ((customersThisPeriod - customersPrevPeriod) / customersPrevPeriod) * 100;

    // Products count and change (created in period)
    const totalProducts = await Product.countDocuments({});
    const productsThisPeriod = await Product.countDocuments({ createdAt: { $gte: startDate, $lte: now } });
    const productsPrevPeriod = await Product.countDocuments({ createdAt: { $gte: prevStart, $lt: startDate } });
    const productsChange = productsPrevPeriod === 0 ? 100 : ((productsThisPeriod - productsPrevPeriod) / productsPrevPeriod) * 100;

    // Revenue by day for charts
    const revenueByDay = await Order.aggregate([
      { $match: revenueMatch },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' } } },
      { $sort: { _id: 1 } },
    ]);
    // Orders count by day
    const ordersByDay = await Order.aggregate([
      { $match: revenueMatch },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    // Fill missing days with 0
    const revenueData: Array<{ date: string; revenue: number }> = [];
    const ordersCountByDate = new Map<string, number>();
    for (const ob of ordersByDay) {
      ordersCountByDate.set(ob._id as string, ob.count as number);
    }
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i + 1);
      const key = d.toISOString().slice(0, 10);
      const found = revenueByDay.find((r) => r._id === key);
      revenueData.push({ date: key, revenue: found ? found.revenue : 0 });
      // Persist daily snapshot into Analytics collection (upsert)
      try {
        await Analytics.findOneAndUpdate(
          { date: new Date(key) },
          {
            $set: {
              revenueCents: found ? (found.revenue as number) : 0,
              ordersCount: ordersCountByDate.get(key) || 0,
            },
          },
          { upsert: true, new: true }
        );
      } catch (e) {
        // Non-fatal; continue returning analytics
      }
    }

    // Top products by quantity sold
    const topProductsAgg = await Order.aggregate([
      { $match: revenueMatch },
      { $unwind: '$items' },
      { $group: { _id: '$items.name', sold: { $sum: '$items.quantity' } } },
      { $sort: { sold: -1 } },
      { $limit: 10 },
    ]);
    const topProducts = topProductsAgg.map((p) => ({ name: p._id as string, sold: p.sold as number }));
    // Also store top products for the latest day snapshot
    try {
      const latestDay = revenueData[revenueData.length - 1]?.date;
      if (latestDay) {
        // Map product names to IDs if possible
        const productDocs = await Product.find({ name: { $in: topProducts.map((t) => t.name) } }, { _id: 1, name: 1 });
        const nameToId = new Map(productDocs.map((p) => [p.name, p._id] as const));
        await Analytics.findOneAndUpdate(
          { date: new Date(latestDay) },
          {
            $set: {
              topProducts: topProducts.map((t) => ({ productId: nameToId.get(t.name), sold: t.sold })),
            },
          },
          { upsert: true }
        );
      }
    } catch {}

    // Category distribution from products
    const categoryAgg = await Product.aggregate([
      { $unwind: { path: '$categories', preserveNullAndEmptyArrays: false } },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 12 },
    ]);
    const categoryDistribution = categoryAgg.map((c) => ({ category: c._id as string, count: c.count as number }));

    return NextResponse.json({
      revenue: periodRevenue,
      orders: periodOrders,
      customers: totalCustomers,
      products: totalProducts,
      revenueChange,
      ordersChange,
      customersChange,
      productsChange,
      revenueData,
      topProducts,
      categoryDistribution,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}


