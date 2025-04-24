import { NextResponse } from 'next/server';
import { getTagsForPost, addTagToPost, removeTagFromPost } from '@/lib/db';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const postId = Number(params.id);
    
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }
    
    const tags = await getTagsForPost(postId);
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching post tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post tags' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    // Check authentication - temporarily disabled
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    const postId = Number(params.id);
    const { tagId } = await request.json();
    
    if (isNaN(postId) || !tagId) {
      return NextResponse.json(
        { error: 'Invalid post ID or tag ID' },
        { status: 400 }
      );
    }
    
    const success = await addTagToPost(postId, tagId);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to add tag to post' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error adding tag to post:', error);
    return NextResponse.json(
      { error: 'Failed to add tag to post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    // Check authentication - temporarily disabled
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    const postId = Number(params.id);
    const url = new URL(request.url);
    const tagId = Number(url.searchParams.get('tagId'));
    
    if (isNaN(postId) || isNaN(tagId)) {
      return NextResponse.json(
        { error: 'Invalid post ID or tag ID' },
        { status: 400 }
      );
    }
    
    const success = await removeTagFromPost(postId, tagId);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to remove tag from post' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error removing tag from post:', error);
    return NextResponse.json(
      { error: 'Failed to remove tag from post' },
      { status: 500 }
    );
  }
}
