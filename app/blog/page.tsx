import Link from 'next/link';
import { format } from 'date-fns';
import { getAllPosts } from '@/lib/db';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Adams Mujahid',
  description: 'Read the latest articles and insights from Adams Mujahid',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Blog</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Thoughts, insights, and updates on web development, mobile apps, and technology
          </p>
        </div>

        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-4">No posts yet</h2>
          <p className="text-gray-400">Check back soon for new content!</p>
        </div>
      </div>
    </div>
  );
}
