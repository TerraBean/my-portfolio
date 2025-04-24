import { getTagById, updateTag } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Tag | Admin Dashboard',
  description: 'Edit blog tag',
};

export default async function EditTagPage({ params }: { params: { id: string } }) {
  const tagId = parseInt(params.id);
  const tag = await getTagById(tagId);
  
  if (!tag) {
    redirect('/blog/admin/tags');
  }
  
  async function handleUpdateTag(formData: FormData) {
    'use server';
    
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    
    if (!name || !slug) {
      return;
    }
    
    try {
      await updateTag({
        id: tagId,
        name,
        slug,
      });
    } catch (error) {
      console.error('Error updating tag:', error);
      return;
    }
    
    revalidatePath('/blog/admin/tags');
    redirect('/blog/admin/tags');
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-brand-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Edit Tag</h1>
            <p className="text-gray-400 mt-1">Update tag details</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              className="text-gray-300 hover:text-white transition-colors"
            >
              View Blog
            </Link>
            <Link
              href="/blog/admin/tags"
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Back to Tags
            </Link>
          </div>
        </div>
        
        {/* Edit Tag Form */}
        <div className="bg-brand-blue/20 rounded-lg shadow-lg overflow-hidden mb-8 border border-brand-blue/30">
          <div className="px-6 py-4 bg-brand-blue/30 border-b border-brand-blue/30">
            <h2 className="text-xl font-semibold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Edit Tag: <span className="text-brand-blue ml-1">#{tag.name}</span>
            </h2>
          </div>
          <div className="p-6">
            <form action={handleUpdateTag} className="space-y-4">
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
                    defaultValue={tag.name}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-300"
                    placeholder="e.g. NextJS"
                  />
                  <p className="mt-1 text-xs text-gray-400">Display name for the tag</p>
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
                    defaultValue={tag.slug}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-300"
                    placeholder="e.g. nextjs"
                  />
                  <p className="mt-1 text-xs text-gray-400">URL-friendly version (lowercase, no spaces)</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Link
                  href="/blog/admin/tags"
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-50"
                >
                  Update Tag
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Preview */}
        <div className="bg-brand-blue rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
            <h2 className="text-xl font-semibold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Tag Preview
            </h2>
          </div>
          <div className="p-6 bg-gray-900/50">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-400">Tag Display:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300">
                  #{tag.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-400">URL Path:</span>
                <span className="text-gray-300 font-mono text-sm">
                  /blog/tag/{tag.slug}
                </span>
              </div>
              <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">
                  This tag will be available for selection when creating or editing blog posts. 
                  Visitors can click on this tag to see all posts tagged with <span className="text-white">#{tag.name}</span>.
                </p>
              </div>
            </div>
          </div>
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
