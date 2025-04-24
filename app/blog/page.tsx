import Link from 'next/link';
import { format } from 'date-fns';
import { getAllPosts, getTagsForPost, getCategoriesForPost } from '@/lib/db';
import { Metadata } from 'next';
import BlogSidebar from '@/app/components/blog/Sidebar';
import CategoryBadge from '@/app/components/blog/CategoryBadge';
import TagBadge from '@/app/components/blog/TagBadge';

export const metadata: Metadata = {
  title: 'Blog | Adams Mujahid',
  description: 'Read the latest articles and insights from Adams Mujahid',
};

export const revalidate = 60; // Revalidate this page every 60 seconds

export default async function BlogPage() {
  // Fetch all published posts
  const posts = await getAllPosts(false);
  
  return (
    <div className="min-h-screen bg-brand-dark text-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Blog</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Thoughts, insights, and updates on web development, mobile apps, and technology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <h2 className="text-2xl font-semibold mb-4">No posts yet</h2>
                <p className="text-gray-400">Check back soon for new content!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map(async (post) => {
                  // Fetch categories and tags for each post
                  const categories = await getCategoriesForPost(post.id);
                  const tags = await getTagsForPost(post.id);
                  
                  return (
                    <div key={post.id} className="bg-brand-blue rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                      <Link 
                        href={`/blog/${post.slug}`} 
                        className="block p-6"
                      >
                        <h2 className="text-xl font-bold mb-3 text-white">{post.title}</h2>
                        
                        <p className="text-gray-300 mb-4 line-clamp-3">
                          {post.excerpt || post.content.substring(0, 150).replace(/<[^>]*>/g, '')}...
                        </p>
                        
                        <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                          <span>{post.author_name}</span>
                          <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                        </div>
                        
                        {/* Categories */}
                        {categories.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {categories.map((category) => (
                              <CategoryBadge 
                                key={category.id} 
                                name={category.name} 
                                slug={category.slug} 
                              />
                            ))}
                          </div>
                        )}
                        
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
                      </Link>
                    </div>
                  );
                })}
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
