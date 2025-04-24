import { NextResponse } from 'next/server';
import { getCategoriesForPost, addCategoryToPost, removeCategoryFromPost } from '@/lib/db';
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
    
    const categories = await getCategoriesForPost(postId);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching post categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post categories' },
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
    const { categoryId } = await request.json();
    
    if (isNaN(postId) || !categoryId) {
      return NextResponse.json(
        { error: 'Invalid post ID or category ID' },
        { status: 400 }
      );
    }
    
    const success = await addCategoryToPost(postId, categoryId);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to add category to post' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error adding category to post:', error);
    return NextResponse.json(
      { error: 'Failed to add category to post' },
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
    const categoryId = Number(url.searchParams.get('categoryId'));
    
    if (isNaN(postId) || isNaN(categoryId)) {
      return NextResponse.json(
        { error: 'Invalid post ID or category ID' },
        { status: 400 }
      );
    }
    
    const success = await removeCategoryFromPost(postId, categoryId);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to remove category from post' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error removing category from post:', error);
    return NextResponse.json(
      { error: 'Failed to remove category from post' },
      { status: 500 }
    );
  }
}
