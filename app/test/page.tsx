import TestImportsComponent from '../components/TestImportsComponent';
import { Toaster } from 'sonner';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Test Page</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Testing all newly installed dependencies.
          </p>
        </div>
        
        <div className="flex justify-center">
          <TestImportsComponent />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
