'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useToast } from '@/app/components/ui/toast';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [publishingPosts, setPublishingPosts] = useState<number[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog/posts?includeUnpublished=true');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDeletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== id));
        showToast('Post deleted successfully', 'success');
      } else {
        showToast('Failed to delete post', 'error');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      showToast('An error occurred while deleting the post', 'error');
    }
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    try {
      // Add post ID to the publishing array to show loading state
      setPublishingPosts(prev => [...prev, id]);
      
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          published: !currentStatus,
        }),
      });

      if (response.ok) {
        setPosts(
          posts.map(post =>
            post.id === id ? { ...post, published: !currentStatus } : post
          )
        );
        
        // Show success toast
        showToast(
          `Post ${!currentStatus ? 'published' : 'unpublished'} successfully`, 
          'success'
        );
        
        // Refresh the page to update the cache
        router.refresh();
      } else {
        showToast('Failed to update post status', 'error');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      showToast('An error occurred while updating the post', 'error');
    } finally {
      // Remove post ID from publishing array when done
      setPublishingPosts(prev => prev.filter(postId => postId !== id));
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Blog Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              className="text-gray-300 hover:text-white transition-colors"
            >
              View Blog
            </Link>
            <Link
              href="/blog/admin/new"
              className="bg-brand-red hover:bg-opacity-90 text-white px-4 py-2 rounded-md transition-colors"
            >
              Create New Post
            </Link>
          </div>
        </div>

        {/* Admin Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link 
            href="/blog/admin/categories"
            className="bg-brand-blue/80 hover:bg-brand-blue rounded-lg p-6 transition-colors shadow-lg"
          >
            <h2 className="text-xl font-bold mb-2">Manage Categories</h2>
            <p className="text-gray-300">Create, edit, and delete blog post categories</p>
          </Link>
          
          <Link 
            href="/blog/admin/tags"
            className="bg-brand-blue/80 hover:bg-brand-blue rounded-lg p-6 transition-colors shadow-lg"
          >
            <h2 className="text-xl font-bold mb-2">Manage Tags</h2>
            <p className="text-gray-300">Create, edit, and delete blog post tags</p>
          </Link>
          
          <Link 
            href="/blog/admin/news"
            className="bg-emerald-600/80 hover:bg-emerald-600 rounded-lg p-6 transition-colors shadow-lg"
          >
            <h2 className="text-xl font-bold mb-2">News Scraping</h2>
            <p className="text-gray-300">Scrape Ghana news and enhance with AI</p>
          </Link>
          
          <Link 
            href="/blog/admin/new"
            className="bg-brand-blue/80 hover:bg-brand-blue rounded-lg p-6 transition-colors shadow-lg"
          >
            <h2 className="text-xl font-bold mb-2">Create New Post</h2>
            <p className="text-gray-300">Write and publish a new blog post</p>
          </Link>
        </div>

        <div className="bg-brand-blue rounded-lg shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-xl font-semibold mb-4">No posts yet</p>
              <p className="text-gray-400 mb-6">Create your first blog post to get started</p>
              <Link
                href="/blog/admin/new"
                className="bg-brand-red hover:bg-opacity-90 text-white px-4 py-2 rounded-md transition-colors"
              >
                Create New Post
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800 text-left">
                  <tr>
                    <th className="px-6 py-3 text-gray-300">Title</th>
                    <th className="px-6 py-3 text-gray-300">Status</th>
                    <th className="px-6 py-3 text-gray-300">Created</th>
                    <th className="px-6 py-3 text-gray-300">Updated</th>
                    <th className="px-6 py-3 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-brand-red hover:underline"
                          target="_blank"
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.published
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-yellow-900/30 text-yellow-400'
                          }`}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {format(new Date(post.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {format(new Date(post.updated_at), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleTogglePublish(post.id, post.published)}
                            className={`px-3 py-1 rounded text-sm ${
                              post.published 
                                ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50' 
                                : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                            } transition-colors`}
                            disabled={publishingPosts.includes(post.id)}
                          >
                            {publishingPosts.includes(post.id) ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {post.published ? 'Unpublishing...' : 'Publishing...'}
                              </span>
                            ) : (
                              <span>{post.published ? 'Unpublish' : 'Publish'}</span>
                            )}
                          </button>
                          <Link
                            href={`/blog/admin/edit/${post.id}`}
                            className="px-3 py-1 rounded text-sm bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="px-3 py-1 rounded text-sm bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
