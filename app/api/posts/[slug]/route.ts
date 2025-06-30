// api/posts/[slug]/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/app/_lib/db';
import Post from '@/app/_lib/models/Post';
import slugify from '@/app/_utils/slugify';
import { generateMetaFields } from '@/app/_utils/metaGen';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    
    const { slug } = await params;
    
    // eslint-disable-next-line prefer-const
    let post = await Post.findOne({ slug });
    
    // If no exact slug match, search by keyword in slug field
    if (!post) {
      const posts = await Post.find({
        slug: { $regex: slug, $options: 'i' } 
      }).sort({ createdAt: -1 });
      
      if (posts.length > 0) {

        return NextResponse.json({
          success: true,
          data: posts,
          searchResults: true 
        });
      }
    }
    
    // If exact slug match found, return single post
    if (post) {
      return NextResponse.json({
        success: true,
        data: {
          title: post.title,
          content: post.content,
          createdAt: post.createdAt,
          slug: post.slug,
          updatedAt: post.updatedAt,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription
        }
      });
    }
    
    // No matches found
    return NextResponse.json(
      { success: false, message: 'Post not found' },
      { status: 404 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch post', 
        error: error?.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    
    const { slug } = await params;
    const body = await request.json();
    const { title, content } = body; // Only title and content as per requirements
    
    // Get existing post for reference
    const existingPost = await Post.findOne({ slug });
    if (!existingPost) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      updatedAt: new Date()
    };
    
    const finalTitle = title !== undefined ? title : existingPost.title;
    const finalContent = content !== undefined ? content : existingPost.content;
    
    // Only update title if provided
    if (title !== undefined) {
      updateData.title = title;
      
      const newSlug = slugify(title);
      
      if (newSlug !== slug) {
        const existingSlugPost = await Post.findOne({ slug: newSlug });
        if (existingSlugPost) {
          return NextResponse.json(
            { success: false, message: 'A post with this title already exists' },
            { status: 409 }
          );
        }
        updateData.slug = newSlug;
      }
    }
    
    if (content !== undefined) {
      updateData.content = content;
    }
    
    if (title !== undefined || content !== undefined) {
      const metaFields = generateMetaFields(finalTitle, finalContent);
      updateData.metaTitle = metaFields.metaTitle;
      updateData.metaDescription = metaFields.metaDescription;
    }
    
    // Update post in MongoDB
    const updatedPost = await Post.findOneAndUpdate(
      { slug },
      updateData,
      { new: true, runValidators: true }
    );
    
    // Return updated post data
    return NextResponse.json({
      success: true,
      data: updatedPost,
      message: 'Post updated successfully'
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to update post', 
        error: error?.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// DELETE post by slug
export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    
    // NEXTJS 15 FIX: Await params before using
    const { slug } = await params;
    
    // Delete post from MongoDB
    const deletedPost = await Post.findOneAndDelete({ slug });
    
    if (!deletedPost) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Return success indication
    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to delete post', 
        error: error?.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}