import Link from 'next/link';

interface CategoryBadgeProps {
  name: string;
  slug: string;
  className?: string;
}

export default function CategoryBadge({ name, slug, className = '' }: CategoryBadgeProps) {
  return (
    <Link 
      href={`/blog/category/${slug}`}
      className={`inline-block px-3 py-1 rounded-full bg-brand-blue/20 text-brand-blue hover:bg-brand-blue/30 transition-colors text-sm font-medium ${className}`}
    >
      {name}
    </Link>
  );
}
