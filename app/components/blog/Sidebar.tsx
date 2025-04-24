import Link from 'next/link';
import { getAllCategories, getAllTags } from '@/lib/db';

export default async function BlogSidebar() {
  const categories = await getAllCategories();
  const tags = await getAllTags();

  return (
    <div className="space-y-8">
      {/* Categories Section */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-white">Categories</h3>
        <div className="space-y-2">
          {categories.length === 0 ? (
            <p className="text-gray-400">No categories yet</p>
          ) : (
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/blog/category/${category.slug}`}
                    className="text-gray-300 hover:text-brand-blue transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Tags Section */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-white">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.length === 0 ? (
            <p className="text-gray-400">No tags yet</p>
          ) : (
            tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="px-2 py-1 bg-gray-700 text-gray-200 rounded-full text-xs hover:bg-gray-600 transition-colors"
              >
                #{tag.name}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
