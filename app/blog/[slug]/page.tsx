import { format } from 'date-fns';
import { getPostBySlug, getTagsForPost, getCategoriesForPost } from '@/lib/db';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CategoryBadge from '@/app/components/blog/CategoryBadge';
import TagBadge from '@/app/components/blog/TagBadge';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
      return {
        title: 'Post Not Found',
      };
    }
    
    return {
      title: `${post.title} | Adams Mujahid Blog`,
      description: post.excerpt || post.content.substring(0, 160),
    };
  } catch (error) {
    return {
      title: 'Blog Post | Adams Mujahid',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
      notFound();
    }

    // Fetch categories and tags for this post
    const categories = await getCategoriesForPost(post.id);
    const tags = await getTagsForPost(post.id);

    return (
      <main className="min-h-screen bg-brand-dark text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-brand-red mb-8 hover:underline"
            >
              ← Back to all posts
            </Link>
            
            <article>
              <header className="mb-10">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>
                
                {/* Categories */}
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map((category) => (
                      <CategoryBadge 
                        key={category.id} 
                        name={category.name} 
                        slug={category.slug} 
                      />
                    ))}
                  </div>
                )}
                
                <div className="flex items-center text-gray-400 text-sm md:text-base mb-4">
                  <span>By {post.author_name}</span>
                  <span className="mx-2">•</span>
                  <time dateTime={post.created_at}>
                    {format(new Date(post.created_at), 'MMMM d, yyyy')}
                  </time>
                </div>
                
                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <TagBadge 
                        key={tag.id} 
                        name={tag.name} 
                        slug={tag.slug} 
                      />
                    ))}
                  </div>
                )}
              </header>
              
              <div 
                className="prose prose-lg prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen bg-brand-dark text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Error Loading Post</h1>
            <p className="text-xl text-gray-300 mb-8">
              There was a problem loading this blog post. Please try again later.
            </p>
            <Link 
              href="/blog" 
              className="inline-flex items-center px-6 py-3 bg-brand-red text-white font-medium rounded-md hover:bg-opacity-90 transition-colors"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </main>
    );
  }
}
