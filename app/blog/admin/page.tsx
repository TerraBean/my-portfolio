'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

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
  const { data: session } = useSession();
  const router = useRouter();

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
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('An error occurred while deleting the post');
    }
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    try {
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
      } else {
        alert('Failed to update post status');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('An error occurred while updating the post');
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
                            className="text-gray-300 hover:text-white"
                            title={post.published ? 'Unpublish' : 'Publish'}
                          >
                            {post.published ? 'Unpublish' : 'Publish'}
                          </button>
                          <Link
                            href={`/blog/admin/edit/${post.id}`}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-400 hover:text-red-300"
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
