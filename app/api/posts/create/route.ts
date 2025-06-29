import { NextResponse } from 'next/server';
import connectDB from '@/app/_lib/db';
import Post from '@/app/_lib/models/Post';
import slugify from '@/app/_utils/slugify';
import { generateMetaFields } from '@/app/_utils/metaGen';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, content } = body; // Only take title and content as per requirements
    
    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Title and content are required' 
        },
        { status: 400 }
      );
    }
    
    // Generate base slug from title
    const baseSlug = slugify(title);
    
    // Check if slug already exists and make it unique
    let uniqueSlug = baseSlug;
    let counter = 1;
    
    while (await Post.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    // Create new post with basic fields only
    const newPost = await Post.create({
      title,
      content,
      slug: uniqueSlug
    });
    
    // ✨ After successful creation, auto-generate meta fields
    if (newPost) {
      const metaFields = generateMetaFields(title, content);
      
      // Update the post with generated meta fields
      const updatedPost = await Post.findByIdAndUpdate(
        newPost._id,
        {
          metaTitle: metaFields.metaTitle,
          metaDescription: metaFields.metaDescription
        },
        { new: true } // Return updated document
      );
      
      return NextResponse.json({
        success: true,
        data: updatedPost, // Return the post with meta fields
        message: 'Post created successfully with auto-generated SEO fields'
      }, { status: 201 });
    }
    
    // Fallback (shouldn't reach here)
    return NextResponse.json({
      success: true,
      data: newPost,
      message: 'Post created successfully'
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating post:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { 
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        },
        { status: 400 }
      );
    }
    
    // Handle duplicate key error (shouldn't happen with our unique slug logic, but just in case)
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false,
          message: 'A post with this slug already exists'
        },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to create post', 
        error: error?.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}