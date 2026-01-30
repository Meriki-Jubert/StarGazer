"use client";

import { useEffect, useState } from "react";
import { getUserStories, deleteStory, Story } from "@/lib/stories";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2, Plus, BookOpen } from "lucide-react";
import Experience from "@/components/3d/Experience";
import { useRouter } from "next/navigation";
import Navbar from '@/components/layout/Navbar';

export default function DashboardPage() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndStories() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      const data = await getUserStories(user.id);
      setStories(data);
      setLoading(false);
    }
    fetchUserAndStories();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return;
    
    const success = await deleteStory(id);
    if (success) {
      setStories(stories.filter(s => s.id !== id));
    } else {
      alert("Failed to delete story.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white bg-black">Loading Dashboard...</div>;
  }

  return (
    <div className="relative min-h-screen text-gray-200 font-sans">
       <div className="fixed inset-0 -z-10">
        <Experience />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <header className="flex items-center justify-between mb-8 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-4">
                <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">
                    My Stories
                </h1>
            </div>
            <div className="flex items-center gap-4">
               <Link href="/publish" className="flex items-center gap-2 px-6 py-3 bg-purple-600 rounded-full hover:bg-purple-700 transition font-bold text-white shadow-lg shadow-purple-500/20">
                   <Plus size={20} /> Create New Story
               </Link>
            </div>
        </header>

        {stories.length === 0 ? (
           <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
             <BookOpen className="w-16 h-16 mx-auto text-gray-600 mb-4" />
             <h2 className="text-xl font-bold text-gray-300 mb-2">No stories yet</h2>
             <p className="text-gray-500 mb-6">Start your journey by creating your first story.</p>
             <Link href="/publish" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition">
                Create Story
             </Link>
           </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map(story => (
                    <div key={story.id} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col hover:border-purple-500/30 transition group hover:bg-black/50">
                        <div className="flex-1 mb-4">
                             <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-300 transition">{story.title}</h3>
                             <p className="text-gray-400 text-sm line-clamp-3 mb-4">{story.description || "No description provided."}</p>
                             <div className="flex flex-wrap gap-2">
                                {story.genres.slice(0, 3).map(g => (
                                    <span key={g} className="text-xs px-2 py-1 bg-purple-900/30 text-purple-200 rounded-full border border-purple-500/20">{g}</span>
                                ))}
                             </div>
                        </div>
                        
                        <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                            <span className="text-xs text-gray-500">
                                {story.chapters.length} Chapter{story.chapters.length !== 1 ? 's' : ''}
                            </span>
                            <div className="flex gap-2">
                                <Link href={`/publish/${story.id}`} className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition text-sm border border-blue-500/20">
                                    <Edit size={14} /> Edit
                                </Link>
                                <button onClick={() => handleDelete(story.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition text-sm border border-red-500/20">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
