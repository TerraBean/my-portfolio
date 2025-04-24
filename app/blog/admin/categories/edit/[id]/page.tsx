import { getAllCategories, updateCategory } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: EditCategoryPageProps): Promise<Metadata> {
  const categories = await getAllCategories();
  const category = categories.find(cat => cat.id === Number(params.id));
  
  if (!category) {
    return {
      title: 'Category Not Found | Admin Dashboard',
    };
  }
  
  return {
    title: `Edit ${category.name} | Admin Dashboard`,
    description: 'Edit blog category',
  };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const categories = await getAllCategories();
  const category = categories.find(cat => cat.id === Number(params.id));
  
  if (!category) {
    notFound();
  }

  async function handleUpdateCategory(formData: FormData): Promise<void> {
    'use server';
    
    const id = Number(params.id);
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    
    if (!id || !name || !slug) {
      throw new Error('ID, name, and slug are required');
    }
    
    await updateCategory(id, {
      name,
      slug,
      description: description || undefined,
    });
    
    revalidatePath('/blog/admin/categories');
    redirect('/blog/admin/categories');
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Category</h1>
        <Link 
          href="/blog/admin/categories" 
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Back to Categories
        </Link>
      </div>
      
      {/* Edit Category Form */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Edit {category.name}</h2>
        <form action={handleUpdateCategory} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={category.name}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-1">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              defaultValue={category.slug}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={category.description || ''}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-brand-blue text-white rounded hover:bg-opacity-90 transition-colors"
            >
              Update Category
            </button>
            
            <Link
              href="/blog/admin/categories"
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
