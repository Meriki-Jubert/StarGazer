"use client";
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import Experience from '@/components/3d/Experience'; 
import StoriesFeed from '@/components/stories/StoriesFeed';
import Navbar from '@/components/layout/Navbar';
import GenreFilter from '@/components/explore/GenreFilter';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense, useEffect } from 'react';

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const currentSearchParam = searchParams.get("q") || "";
  const currentGenresParam = searchParams.get("genres")?.split(",").filter(Boolean) || [];

  const [search, setSearch] = useState(currentSearchParam);

  // Sync local search state with URL params (e.g. on back/forward navigation)
  useEffect(() => {
    setSearch(currentSearchParam);
  }, [currentSearchParam]);

  const updateFilters = (newGenres: string[], newSearch: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.set("q", newSearch);
    if (newGenres.length > 0) params.set("genres", newGenres.join(","));
    
    router.push(`/read?${params.toString()}`);
  };

  const handleGenreChange = (genres: string[]) => {
    updateFilters(genres, search);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(currentGenresParam, search);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
         <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search stories..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white placeholder-gray-500"
            />
        </form>
        <GenreFilter selectedGenres={currentGenresParam} onChange={handleGenreChange} />
      </div>

      <StoriesFeed 
        limit={50} 
        filterOptions={{ 
            genres: currentGenresParam, 
            search: currentSearchParam 
        }} 
      />
    </>
  );
}

export default function ReadPage() {
  return (
    <div className="relative min-h-screen flex flex-col text-gray-200 font-sans">
       <div className="fixed inset-0 -z-10">
          <Experience /> 
          <div className="absolute inset-0 bg-black/80" />
       </div>

      <Navbar />

      <div className="max-w-7xl mx-auto w-full px-6 md:px-8 pt-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Book Archives</h1>
            <p className="text-sm text-gray-400">Explore the multiverse of stories</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-8 pb-8">
        <Suspense fallback={<p className="text-gray-400">Loading filters...</p>}>
           <ExploreContent />
        </Suspense>
      </main>
    </div>
  );
}
