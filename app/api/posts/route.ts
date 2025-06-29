// CHANGE 1: Added request parameter to enable search functionality
import { NextResponse } from 'next/server';
import connectDB from '@/app/_lib/db';
import Post from '@/app/_lib/models/Post';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // CHANGE 2: Extract search parameter from URL query string
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    // CHANGE 3: Build filter object for search functionality
    let filter = {};
    
    // CHANGE 4: If search query exists, search in title and content
    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: 'i' } }, // Case-insensitive search in title
          { content: { $regex: search, $options: 'i' } } // Case-insensitive search in content
        ]
      };
    }
    
    // CHANGE 5: Apply filter to find query (was Post.find() before)
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .select('title slug createdAt updatedAt'); // Basic info for list view
    
    return NextResponse.json({
      success: true,
      data: posts
    });
    
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