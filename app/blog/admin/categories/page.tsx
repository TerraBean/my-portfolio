import { getAllCategories, createCategory, deleteCategory } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Categories | Admin Dashboard',
  description: 'Manage blog categories',
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  async function handleCreateCategory(formData: FormData) {
    'use server';
    
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    
    if (!name || !slug) {
      return;
    }
    
    try {
      await createCategory({
        name,
        slug,
        description,
      });
    } catch (error) {
      console.error('Error creating category:', error);
      return;
    }
    
    revalidatePath('/blog/admin/categories');
    redirect('/blog/admin/categories');
  }
  
  async function handleDeleteCategory(formData: FormData) {
    'use server';
    
    const id = Number(formData.get('id'));
    
    if (!id) {
      return;
    }
    
    try {
      await deleteCategory(id);
    } catch (error) {
      console.error('Error deleting category:', error);
      return;
    }
    
    revalidatePath('/blog/admin/categories');
    redirect('/blog/admin/categories');
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Categories</h1>
            <p className="text-gray-400 mt-1">Create, edit, and organize your blog categories</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              className="text-gray-300 hover:text-white transition-colors"
            >
              View Blog
            </Link>
            <Link
              href="/blog/admin"
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
        
        {/* Create Category Form */}
        <div className="bg-brand-blue/20 rounded-lg shadow-lg overflow-hidden mb-8 border border-brand-blue/30">
          <div className="px-6 py-4 bg-brand-blue/30 border-b border-brand-blue/30">
            <h2 className="text-xl font-semibold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Category
            </h2>
          </div>
          <div className="p-6">
            <form action={handleCreateCategory} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-300">
                    Name <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-300"
                    placeholder="e.g. Web Development"
                  />
                  <p className="mt-1 text-xs text-gray-400">Display name for the category</p>
                </div>
                
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium mb-1 text-gray-300">
                    Slug <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-300"
                    placeholder="e.g. web-development"
                  />
                  <p className="mt-1 text-xs text-gray-400">URL-friendly version (lowercase, no spaces)</p>
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-300"
                  placeholder="Optional description of this category"
                ></textarea>
                <p className="mt-1 text-xs text-gray-400">Brief description of what this category includes (optional)</p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-50"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Categories List */}
        <div className="bg-brand-blue rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Existing Categories
            </h2>
            <span className="bg-brand-blue/40 text-white text-sm py-1 px-3 rounded-full">
              {categories.length} {categories.length === 1 ? 'category' : 'categories'}
            </span>
          </div>
          
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center p-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-400 text-lg mb-2">No categories yet</p>
              <p className="text-gray-500 max-w-md">Create your first category using the form above to organize your blog posts.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800 text-left">
                  <tr>
                    <th className="px-6 py-3 text-gray-300">Name</th>
                    <th className="px-6 py-3 text-gray-300">Slug</th>
                    <th className="px-6 py-3 text-gray-300">Description</th>
                    <th className="px-6 py-3 text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-800/50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-blue/20 text-brand-blue mr-2">
                            {category.name}
                          </span>
                          <span className="font-medium text-white">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 font-mono text-sm">{category.slug}</td>
                      <td className="px-6 py-4 text-gray-400 truncate max-w-xs">
                        {category.description || <span className="text-gray-500 italic">No description</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/blog/admin/categories/edit/${category.id}`}
                            className="px-3 py-1 bg-blue-900/30 text-blue-400 text-sm rounded hover:bg-blue-900/50 transition-colors duration-150 flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Edit
                          </Link>
                          <form action={handleDeleteCategory} className="inline">
                            <input type="hidden" name="id" value={category.id} />
                            <button
                              type="submit"
                              className="px-3 py-1 bg-red-900/30 text-red-400 text-sm rounded hover:bg-red-900/50 transition-colors duration-150 flex items-center"
                              onClick={(e) => {
                                if (!confirm(`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`)) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Delete
                            </button>
                          </form>
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
      
      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-6 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Your Portfolio. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                View Blog
              </Link>
              <Link href="/blog/admin" className="text-gray-400 hover:text-white transition-colors text-sm">
                Admin Dashboard
              </Link>
              <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                Back to Portfolio
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
