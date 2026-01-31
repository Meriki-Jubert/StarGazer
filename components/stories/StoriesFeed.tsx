"use client";
import Link from "next/link";
import { getStories, Story, GetStoriesOptions } from "@/lib/stories";
import { useEffect, useState } from "react";

export default function StoriesFeed({ limit, filterOptions }: { limit?: number; filterOptions?: Omit<GetStoriesOptions, 'limit'> }) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      setLoading(true);
      const options: GetStoriesOptions = {
        limit: limit ?? 10,
        ...filterOptions
      };
      const data = await getStories(options);
      setStories(data);
      setLoading(false);
    }
    fetchStories();
  }, [limit, filterOptions?.genres, filterOptions?.search]); // Deep comparison for primitives, array ref change triggers update

  if (loading) {
    return <p className="text-gray-400">Loading stories...</p>;
  }

  if (!stories.length) {
    return <p className="text-gray-400">No stories yet. Be the first to <Link href="/publish" className="underline">publish</Link>!</p>;
  }

  return (
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
  );
}
