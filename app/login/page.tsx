'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import { useToast } from '../components/ui/toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/blog/admin';
  const { showToast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  // Check for error or success messages in URL
  useEffect(() => {
    const errorParam = searchParams?.get('error');
    if (errorParam) {
      if (errorParam === 'CredentialsSignin') {
        setError('Invalid email or password');
      } else {
        setError('An error occurred during login');
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate inputs before proceeding
      if (!email || !password) {
        setError('Email and password are required');
        return;
      }
      
      // Set loading state
      setIsLoading(true);
      setError('');
      
      console.log('Attempting to sign in with:', { email, password: '***' });
      
      // Attempt to sign in
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });
      
      console.log('Sign in result:', result);
      
      // Handle error case
      if (!result || result.error) {
        console.error('Sign in error:', result?.error);
        setError('Invalid email or password');
        try {
          showToast('Login failed. Please check your credentials.', 'error');
        } catch (toastError) {
          console.error('Toast error:', toastError);
        }
        return;
      }
      
      // Handle success case
      if (result.ok) {
        try {
          showToast('Login successful! Redirecting...', 'success');
        } catch (toastError) {
          console.error('Toast error:', toastError);
        }
        
        // Short delay before redirect to ensure toast is shown
        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh();
        }, 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
      try {
        showToast('Login failed. Please try again later.', 'error');
      } catch (toastError) {
        console.error('Toast error:', toastError);
      }
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-brand-dark text-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-brand-blue rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-gray-400 mt-2">Sign in to manage your blog</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/50 border border-red-500 text-white px-4 py-3 rounded mb-4 flex items-center">
                  <FaLock className="mr-2" />
                  <span>{error}</span>
                </div>
              )}

              <div className="relative">
                <label htmlFor="email" className="block text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-400"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-red hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/blog" className="text-gray-400 hover:text-white">
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
