// app/500/page.tsx
export default function Custom500() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#01182B]">
      <div className="text-center text-white p-8">
        <h1 className="text-6xl font-bold mb-4">500</h1>
        <h2 className="text-2xl mb-6">Internal Server Error</h2>
        <a
          href="/"
          className="bg-brand-red text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
