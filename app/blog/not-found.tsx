import Link from 'next/link';

export default function BlogNotFound() {
  return (
    <main className="min-h-screen bg-brand-dark text-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Post Not Found</h1>
          <p className="text-xl text-gray-300 mb-8">
            Sorry, the blog post you&apos;re looking for doesn&apos;t exist or may have been removed.
          </p>
          <Link 
            href="/blog" 
            className="inline-flex items-center px-6 py-3 bg-brand-red text-white font-medium rounded-md hover:bg-opacity-90 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    </main>
  );
}
