import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import slugify from 'slugify';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';
    
    // Check if user is authorized to see unpublished posts
    if (includeUnpublished) {
      const session = await getServerSession(authOptions);
      
      if (!session?.user.isAdmin) {
        return NextResponse.json(
          { error: 'Unauthorized to view unpublished posts' },
          { status: 403 }
        );
      }
    }
    
    const posts = await getAllPosts(includeUnpublished);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authorized
    const session = await getServerSession(authOptions);
    
    if (!session?.user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized to create posts' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    // Generate slug from title if not provided
    const slug = body.slug || slugify(body.title, { lower: true, strict: true });
    
    // Create the post
    const newPost = await createPost({
      title: body.title,
      slug,
      content: body.content,
      excerpt: body.excerpt,
      published: body.published ?? false,
      author_id: parseInt(session.user.id)
    });
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
