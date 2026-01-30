"use client";

import { useState, useEffect, useCallback } from "react";
import { getComments, addComment, type Comment } from "@/lib/stories";
import { Send } from "lucide-react";

export default function Comments({ storyId }: { storyId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const loadComments = useCallback(async () => {
    const data = await getComments(storyId);
    setComments(data);
  }, [storyId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    const added = await addComment(storyId, newComment);
    if (added) {
      setNewComment("");
      await loadComments();
    }
    setLoading(false);
  };

  return (
    <div className="mt-12 border-t border-white/10 pt-8">
      <h3 className="text-xl font-bold text-white mb-6">Comments</h3>
      
      <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition"
        />
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send size={16} /> Post
        </button>
      </form>

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-purple-300 font-bold">
                  {comment.author?.username || `User ${comment.user_id.slice(0, 8)}`}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-center">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
}
