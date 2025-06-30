import { NextResponse } from 'next/server';
import connectDB from '@/app/_lib/db';
import Post from '@/app/_lib/models/Post';

export async function GET(request: Request) {
  try {
    await connectDB();
    

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    let filter = {};
    
    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: 'i' } }, 
          { content: { $regex: search, $options: 'i' } } 
        ]
      };
    }
    

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .select('title slug createdAt updatedAt'); // Basic info for list view
    
    return NextResponse.json({
      success: true,
      data: posts
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch posts', 
        error: error?.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}