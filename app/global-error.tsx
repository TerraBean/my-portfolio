'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-[#01182B]">
          <div className="text-center text-white p-8">
            <h1 className="text-6xl font-bold mb-4">500</h1>
            <h2 className="text-2xl mb-6">Something went wrong!</h2>
            <button
              onClick={() => reset()}
              className="bg-brand-red text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
