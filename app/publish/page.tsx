"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createStory } from "@/lib/stories";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import Experience from "@/components/3d/Experience";

export default function CreateStoryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const GENRES = [
    "Fantasy", "Sci-Fi", "Mystery", "Romance", "Horror", "Adventure",
    "Thriller", "Historical Fiction", "Young Adult", "Dystopian",
    "Paranormal", "Cyberpunk", "Steampunk", "Space Opera", "High Fantasy",
    "Urban Fantasy", "Crime", "Comedy", "Drama", "Poetry"
  ];

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    if (selectedGenres.length === 0) {
      alert("Please select at least one genre.");
      return;
    }
    setLoading(true);

    const newStory = await createStory({
      title,
      description,
      genres: selectedGenres,
    });

    if (newStory) {
      router.push(`/publish/${newStory.id}`);
    } else {
      setLoading(false);
      alert("Failed to create story. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <Experience />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="w-full max-w-2xl bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl my-10">
        <Link href="/" className="inline-flex items-center text-purple-300 hover:text-purple-200 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
            <BookOpen className="text-purple-300" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">
            Create New Story
          </h1>
        </div>

        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Story Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              placeholder="The Chronicles of Starlight..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all h-32 resize-none"
              placeholder="What is your story about?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Genres (Select multiple)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-white/5 rounded-lg border border-white/10">
              {GENRES.map(genre => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-2 rounded text-sm text-left transition-all ${selectedGenres.includes(genre)
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50"
                      : "text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-bold shadow-lg shadow-purple-900/20 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Workspace..." : "Create Story Workspace"}
          </button>
        </form>
      </div>
    </div>
  );
}
