import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import type { PipelineStage } from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const hasPagination = searchParams.has('page') || searchParams.has('limit');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    let query: any = {};
    
    if (category) {
      query.categories = { $in: [category] };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Use aggregation to deduplicate by slug and paginate unique products
    const matchStage: PipelineStage[] = Object.keys(query).length ? [{ $match: query }] : [];

    if (hasPagination) {
      const aggregation: PipelineStage[] = [
        ...matchStage,
        // Stable ordering strictly by creation time via ObjectId
        { $sort: { _id: 1 as 1 } },
        {
          $group: {
            _id: "$slug",
            doc: { $first: "$$ROOT" }
          }
        },
        { $replaceRoot: { newRoot: "$doc" } },
        // Re-sort after grouping for deterministic order
        { $sort: { _id: 1 as 1 } },
        {
          $facet: {
            data: [
              { $skip: skip },
              { $limit: limit }
            ],
            totalCount: [
              { $count: "count" }
            ]
          }
        }
      ];

      const result = await Product.aggregate(aggregation);
      const products = (result[0]?.data ?? []) as any[];
      const total = result[0]?.totalCount?.[0]?.count ?? 0;

      const res = NextResponse.json({
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / Math.max(limit, 1))
        }
      });
      // Cache for 30s, allow stale while revalidate for 5 minutes
      res.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300');
      return res;
    } else {
      const aggregation: PipelineStage[] = [
        ...matchStage,
        // Stable ordering strictly by creation time via ObjectId
        { $sort: { _id: 1 as 1 } },
        {
          $group: {
            _id: "$slug",
            doc: { $first: "$$ROOT" }
          }
        },
        { $replaceRoot: { newRoot: "$doc" } },
        { $sort: { _id: 1 as 1 } }
      ];
      const products = await Product.aggregate(aggregation);
      const res = NextResponse.json({ products });
      res.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300');
      return res;
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}