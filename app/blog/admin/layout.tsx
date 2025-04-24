'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  
  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated or not an admin
  if (status === 'unauthenticated' || !session?.user.isAdmin) {
    redirect('/login');
  }
  
  return <>{children}</>;
}
