"use client";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Experience from '@/components/3d/Experience'; 
import { getBookmarkedStories, Story } from "@/lib/stories";
import { useEffect, useState } from "react";
import AuthModal from '@/components/auth/AuthModal';

export default function BookmarksPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookmarks() {
      const data = await getBookmarkedStories();
      setStories(data);
      setLoading(false);
    }
    fetchBookmarks();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col text-gray-200 font-sans">
       <div className="fixed inset-0 -z-10">
          <Experience /> 
          <div className="absolute inset-0 bg-black/80" />
       </div>

      <header className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">My Bookmarks</h1>
            <p className="text-sm text-gray-400">Your saved stories</p>
          </div>
        </div>
        <AuthModal />
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8">
        {loading ? (
           <p className="text-gray-400">Loading bookmarks...</p>
        ) : !stories.length ? (
           <p className="text-gray-400">You have not bookmarked any stories yet.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stories.map((s) => (
                <Link key={s.id} href={`/stories/${s.id}`} className="block p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-purple-500/50 transition">
                  <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-3">{s.description || "No description."}</p>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {s.genres?.slice(0, 2).map((g, i) => (
                      <span key={`g-${i}`} className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                        {g}
                      </span>
                    ))}
                    {s.tags?.slice(0, 2).map((t, i) => (
                      <span key={`t-${i}`} className="px-2 py-1 text-xs rounded-full bg-white/5 border border-white/10">
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
        )}
      </main>
    </div>
  );
}
