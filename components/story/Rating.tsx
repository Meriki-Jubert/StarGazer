"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getStoryRating, getUserRating, rateStory } from "@/lib/stories";

export default function Rating({ storyId }: { storyId: string }) {
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [hovered, setHovered] = useState(0);

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

  const handleRate = async (value: number) => {
    setUserRating(value);
    const success = await rateStory(storyId, value);
    if (success) {
        // Refresh ratings
        const { average, count } = await getStoryRating(storyId);
        setRating(average);
        setCount(count);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => handleRate(star)}
            className="focus:outline-none transition-colors"
          >
            <Star
              size={20}
              className={`${
                (hovered || userRating || 0) >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-600"
              }`}
            />
          </button>
        ))}
        <span className="text-sm text-gray-400 ml-2">
           ({count} {count === 1 ? "rating" : "ratings"})
        </span>
      </div>
      <div className="text-xs text-gray-500">
        Avg: {rating.toFixed(1)} / 5
      </div>
    </div>
  );
}
