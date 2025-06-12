import { Metadata } from 'next';
import Link from 'next/link';
import NewsScrapingPanel from '@/components/admin/NewsScrapingPanel';

export const metadata: Metadata = {
  title: 'News Management | Admin Dashboard',
  description: 'Manage automated news scraping and AI enhancement',
};

export default function NewsAdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">News Management</h1>
            <p className="text-gray-400 mt-1">
              Scrape Ghana news articles and enhance them with AI for your blog
            </p>
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

        <NewsScrapingPanel />
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
