"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getStoryRating, getUserRating, rateStory } from "@/lib/stories";

export default function Rating({ storyId }: { storyId: string }) {
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    async function loadRatings() {
      const { average, count } = await getStoryRating(storyId);
      setRating(average);
      setCount(count);

      const userR = await getUserRating(storyId);
      setUserRating(userR);
    }
    loadRatings();
  }, [storyId]);

  useEffect(() => {
    if (isExpanded) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsExpanded(false);
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [isExpanded]);

  const handleRate = async (value: number) => {
    setUserRating(value);
    const success = await rateStory(storyId, value);
    if (success) {
        // Refresh ratings
        const { average, count } = await getStoryRating(storyId);
        setRating(average);
        setCount(count);
    }
    setIsExpanded(false); // Collapse after rating
  };

  return (
    <>
      <button 
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition min-h-[32px] shrink-0"
        title="Rate this story"
      >
        <Star size={14} className="fill-yellow-400 text-yellow-400" />
        <span className="text-xs font-medium text-gray-200">{rating.toFixed(1)}</span>
        <span className="text-[10px] text-gray-500">({count})</span>
      </button>

      {isExpanded && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsExpanded(false)}
        >
          <div 
            className="flex flex-col gap-4 p-6 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl w-full max-w-xs transform transition-all scale-100 animate-in zoom-in-95 duration-200" 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Rate this story"
          >
            <div className="flex items-center justify-between">
               <span className="text-sm font-semibold text-gray-200">Rate Story</span>
               <button 
                 onClick={() => setIsExpanded(false)} 
                 className="text-xs font-medium text-gray-400 hover:text-white px-2 py-1 hover:bg-white/10 rounded transition"
               >
                 Close
               </button>
            </div>
            
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => handleRate(star)}
                  className="focus:outline-none transition-transform hover:scale-110 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    size={32}
                    className={`${
                      (hovered || userRating || 0) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-zinc-600"
                    } transition-colors duration-200`}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-white">{rating.toFixed(1)}</p>
              <p className="text-xs text-gray-500">{count} {count === 1 ? 'rating' : 'ratings'}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
