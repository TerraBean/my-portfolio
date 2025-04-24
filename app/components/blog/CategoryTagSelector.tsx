'use client';

import { useState, useEffect } from 'react';
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

interface CategoryTagSelectorProps {
  postId?: number;
  onCategoriesChange?: (categories: Category[]) => void;
  onTagsChange?: (tags: Tag[]) => void;
  initialCategories?: Category[];
  initialTags?: Tag[];
}

export default function CategoryTagSelector({
  postId,
  onCategoriesChange,
  onTagsChange,
  initialCategories = [],
  initialTags = [],
}: CategoryTagSelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(initialCategories);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(initialTags);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // Fetch all categories and tags
  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          fetch('/api/blog/categories'),
          fetch('/api/blog/tags')
        ]);

        if (categoriesResponse.ok && tagsResponse.ok) {
          const [categoriesData, tagsData] = await Promise.all([
            categoriesResponse.json(),
            tagsResponse.json()
          ]);
          
          setCategories(categoriesData);
          setTags(tagsData);
        }
      } catch (error) {
        console.error('Error fetching categories and tags:', error);
        showToast('Failed to load categories and tags', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesAndTags();
  }, [showToast]);

  // Fetch post categories and tags if postId is provided
  useEffect(() => {
    if (postId) {
      const fetchPostCategoriesAndTags = async () => {
        try {
          const [categoriesResponse, tagsResponse] = await Promise.all([
            fetch(`/api/blog/posts/${postId}/categories`),
            fetch(`/api/blog/posts/${postId}/tags`)
          ]);

          if (categoriesResponse.ok && tagsResponse.ok) {
            const [categoriesData, tagsData] = await Promise.all([
              categoriesResponse.json(),
              tagsResponse.json()
            ]);
            
            setSelectedCategories(categoriesData);
            setSelectedTags(tagsData);
            
            // Call the change handlers with initial data
            if (onCategoriesChange) onCategoriesChange(categoriesData);
            if (onTagsChange) onTagsChange(tagsData);
          }
        } catch (error) {
          console.error('Error fetching post categories and tags:', error);
        }
      };

      fetchPostCategoriesAndTags();
    } else if (initialCategories.length > 0 || initialTags.length > 0) {
      // Use initial values if provided
      setSelectedCategories(initialCategories);
      setSelectedTags(initialTags);
      
      // Call the change handlers with initial data
      if (onCategoriesChange) onCategoriesChange(initialCategories);
      if (onTagsChange) onTagsChange(initialTags);
    }
  }, [postId, onCategoriesChange, onTagsChange, initialCategories, initialTags]);

  const handleCategoryChange = (category: Category, isChecked: boolean) => {
    let updatedCategories: Category[];
    
    if (isChecked) {
      updatedCategories = [...selectedCategories, category];
    } else {
      updatedCategories = selectedCategories.filter(c => c.id !== category.id);
    }
    
    setSelectedCategories(updatedCategories);
    if (onCategoriesChange) onCategoriesChange(updatedCategories);
    
    // If we have a postId, update the server
    if (postId) {
      updatePostCategory(category.id, isChecked);
    }
  };

  const handleTagChange = (tag: Tag, isChecked: boolean) => {
    let updatedTags: Tag[];
    
    if (isChecked) {
      updatedTags = [...selectedTags, tag];
    } else {
      updatedTags = selectedTags.filter(t => t.id !== tag.id);
    }
    
    setSelectedTags(updatedTags);
    if (onTagsChange) onTagsChange(updatedTags);
    
    // If we have a postId, update the server
    if (postId) {
      updatePostTag(tag.id, isChecked);
    }
  };

  const updatePostCategory = async (categoryId: number, isAdding: boolean) => {
    try {
      if (isAdding) {
        await fetch(`/api/blog/posts/${postId}/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ categoryId }),
        });
      } else {
        await fetch(`/api/blog/posts/${postId}/categories?categoryId=${categoryId}`, {
          method: 'DELETE',
        });
      }
    } catch (error) {
      console.error('Error updating post category:', error);
      showToast('Failed to update category', 'error');
    }
  };

  const updatePostTag = async (tagId: number, isAdding: boolean) => {
    try {
      if (isAdding) {
        await fetch(`/api/blog/posts/${postId}/tags`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tagId }),
        });
      } else {
        await fetch(`/api/blog/posts/${postId}/tags?tagId=${tagId}`, {
          method: 'DELETE',
        });
      }
    } catch (error) {
      console.error('Error updating post tag:', error);
      showToast('Failed to update tag', 'error');
    }
  };

  if (isLoading) {
    return <div className="text-gray-400">Loading categories and tags...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div>
        <h3 className="text-lg font-medium text-white mb-3">Categories</h3>
        {categories.length === 0 ? (
          <p className="text-gray-400">No categories available. Create some in the admin panel.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  checked={selectedCategories.some(c => c.id === category.id)}
                  onChange={(e) => handleCategoryChange(category, e.target.checked)}
                  className="h-4 w-4 text-brand-red bg-gray-800 border-gray-700 rounded focus:ring-brand-red focus:ring-opacity-25"
                />
                <label htmlFor={`category-${category.id}`} className="ml-2 text-gray-300">
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tags Section */}
      <div>
        <h3 className="text-lg font-medium text-white mb-3">Tags</h3>
        {tags.length === 0 ? (
          <p className="text-gray-400">No tags available. Create some in the admin panel.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div key={tag.id} className="inline-flex items-center bg-gray-800 rounded-full px-3 py-1">
                <input
                  type="checkbox"
                  id={`tag-${tag.id}`}
                  checked={selectedTags.some(t => t.id === tag.id)}
                  onChange={(e) => handleTagChange(tag, e.target.checked)}
                  className="h-4 w-4 text-brand-red bg-gray-800 border-gray-700 rounded focus:ring-brand-red focus:ring-opacity-25"
                />
                <label htmlFor={`tag-${tag.id}`} className="ml-2 text-gray-300">
                  #{tag.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
