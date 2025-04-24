import Link from 'next/link';
import { format } from 'date-fns';
import { getPostsByTag, getAllTags } from '@/lib/db';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogSidebar from '@/app/components/blog/Sidebar';

interface TagPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tags = await getAllTags();
  const tag = tags.find(t => t.slug === params.slug);
  
  if (!tag) {
    return {
      title: 'Tag Not Found | Adams Mujahid Blog',
    };
  }
  
  return {
    title: `#${tag.name} | Adams Mujahid Blog`,
    description: `Browse all posts tagged with #${tag.name}`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const tags = await getAllTags();
  const tag = tags.find(t => t.slug === params.slug);
  
  if (!tag) {
    notFound();
  }
  
  const posts = await getPostsByTag(params.slug);
  
  return (
    <div className="min-h-screen bg-brand-dark text-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tag: #{tag.name}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Browse all posts tagged with #{tag.name}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <h2 className="text-2xl font-semibold mb-4">No posts with this tag</h2>
                <p className="text-gray-400 mb-8">Check back soon for new content!</p>
                <Link 
                  href="/blog" 
                  className="inline-flex items-center px-6 py-3 bg-brand-blue text-white font-medium rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Back to Blog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post) => (
                  <Link 
                    href={`/blog/${post.slug}`} 
                    key={post.id}
                    className="bg-brand-blue rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-3 text-white">{post.title}</h2>
                      
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {post.excerpt || post.content.substring(0, 150).replace(/<[^>]*>/g, '')}...
                      </p>
                      
                      <div className="flex justify-between items-center text-sm text-gray-400">
                        <span>{post.author_name}</span>
                        <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
