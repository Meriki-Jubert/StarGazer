"use client";

import { useState, useEffect } from "react";
import { Share2, Bookmark, Check } from "lucide-react";
import { isBookmarked, toggleBookmark } from "@/lib/stories";

export default function Actions({ storyId }: { storyId: string }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function checkBookmark() {
      const status = await isBookmarked(storyId);
      setBookmarked(status);
    }
    checkBookmark();
  }, [storyId]);

  const handleBookmark = async () => {
    // Optimistic update
    const newState = !bookmarked;
    setBookmarked(newState);
    
    const result = await toggleBookmark(storyId);
    // Ensure state matches result if it failed or returned something else
    setBookmarked(result);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleShare}
        className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition tooltip"
        title="Share link"
      >
        {copied ? <Check size={20} className="text-green-400" /> : <Share2 size={20} />}
      </button>
      <button
        onClick={handleBookmark}
        className={`p-2 hover:bg-white/10 rounded-full transition ${
          bookmarked ? "text-purple-400 fill-purple-400" : "text-gray-400 hover:text-white"
        }`}
        title={bookmarked ? "Remove Bookmark" : "Bookmark Story"}
      >
        <Bookmark size={20} className={bookmarked ? "fill-purple-400" : ""} />
      </button>
    </div>
  );
}
