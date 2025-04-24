import Link from 'next/link';

interface TagBadgeProps {
  name: string;
  slug: string;
  className?: string;
}

export default function TagBadge({ name, slug, className = '' }: TagBadgeProps) {
  return (
    <Link 
      href={`/blog/tag/${slug}`}
      className={`inline-block px-2 py-1 rounded-full bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors text-xs ${className}`}
    >
      #{name}
    </Link>
  );
}
