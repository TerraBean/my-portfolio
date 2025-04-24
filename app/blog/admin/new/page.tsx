'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BlogEditor from '@/app/components/blog/BlogEditor';
import CategoryTagSelector from '@/app/components/blog/CategoryTagSelector';
import slugify from 'slugify';
import { useToast } from '@/app/components/ui/toast';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

export default function NewBlogPost() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const router = useRouter();
  const { showToast } = useToast();

  const generateSlug = () => {
    if (title) {
      const generatedSlug = slugify(title, { lower: true, strict: true });
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!title || !content) {
      setError('Title and content are required');
      setIsSubmitting(false);
      return;
    }

    try {
      // Create the post
      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          slug: slug || slugify(title, { lower: true, strict: true }),
          content,
          excerpt: excerpt || content.substring(0, 150).replace(/<[^>]*>/g, '') + '...',
          published: isPublished,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create post');
      }

      const newPost = await response.json();
      
      // Add categories and tags to the post
      if (newPost.id) {
        // Add categories
        await Promise.all(
          selectedCategories.map(category => 
            fetch(`/api/blog/posts/${newPost.id}/categories`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ categoryId: category.id }),
            })
          )
        );
        
        // Add tags
        await Promise.all(
          selectedTags.map(tag => 
            fetch(`/api/blog/posts/${newPost.id}/tags`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ tagId: tag.id }),
            })
          )
        );
      }

      // Redirect to admin dashboard on success
      showToast('Post created successfully', 'success');
      router.push('/blog/admin');
      router.refresh();
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while creating the post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
          <Link
            href="/blog/admin"
            className="text-gray-300 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-white px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-gray-300 mb-2">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={generateSlug}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
                required
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-gray-300 mb-2">
                Slug (URL-friendly version of title)
              </label>
              <div className="flex">
                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="bg-gray-700 px-4 py-2 rounded-r-md hover:bg-gray-600 transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-gray-300 mb-2">
                Excerpt (short summary)
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red h-24"
                placeholder="Brief description of your post (optional)"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Content *
              </label>
              <BlogEditor content={content} onChange={setContent} />
            </div>

            {/* Categories and Tags Selector */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Categories and Tags</h2>
              <CategoryTagSelector 
                onCategoriesChange={setSelectedCategories}
                onTagsChange={setSelectedTags}
              />
            </div>

            <div className="flex items-center">
              <input
                id="published"
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-5 w-5 text-brand-red bg-gray-800 border-gray-700 rounded focus:ring-brand-red focus:ring-opacity-25"
              />
              <label htmlFor="published" className="ml-2 text-gray-300">
                Publish immediately
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/blog/admin"
                className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-brand-red hover:bg-opacity-90 text-white rounded-md transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
