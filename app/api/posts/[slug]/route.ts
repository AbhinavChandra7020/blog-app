// api/posts/[slug]/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/app/_lib/db';
import Post from '@/app/_lib/models/Post';
import slugify from '@/app/_utils/slugify';
import { generateMetaFields } from '@/app/_utils/metaGen';

// GET single post by slug OR search by keyword in slug
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    
    // NEXTJS 15 FIX: Await params before using
    const { slug } = await params;
    
    // First try to find exact slug match
    let post = await Post.findOne({ slug });
    
    // If no exact slug match, search by keyword in slug field
    if (!post) {
      const posts = await Post.find({
        slug: { $regex: slug, $options: 'i' } // Case-insensitive search in slug
      }).sort({ createdAt: -1 });
      
      if (posts.length > 0) {
        // Return all matching posts for keyword search
        return NextResponse.json({
          success: true,
          data: posts,
          searchResults: true // Flag to indicate this is a search result
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

// PUT - Update post by slug
export async function PUT(request: Request, { params }: { params: { slug: string }}) {
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
    
    // Build update object only with provided fields
    const updateData: any = {
      updatedAt: new Date()
    };
    
    // Determine final title and content for meta generation
    const finalTitle = title !== undefined ? title : existingPost.title;
    const finalContent = content !== undefined ? content : existingPost.content;
    
    // Only update title if provided
    if (title !== undefined) {
      updateData.title = title;
      
      // AUTOMATIC: Generate new slug when title changes
      const newSlug = slugify(title);
      
      // Check if new slug already exists (and it's not the current post)
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
    
    // Only update content if provided
    if (content !== undefined) {
      updateData.content = content;
    }
    
    // AUTOMATIC: Always regenerate meta fields when title OR content changes
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