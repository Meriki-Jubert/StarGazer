"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getStory, addChapter, updateChapter, updateStory, Story } from "@/lib/stories";
import Link from "next/link";
import { ArrowLeft, Plus, Save, Settings, FileText, ChevronRight, X } from "lucide-react";
import RichTextEditor from "@/components/editor/RichTextEditor";
import AiChat from "@/components/chat/AiChat";

export default function StoryEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [showAiChat, setShowAiChat] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Settings Modal State
  const [showSettings, setShowSettings] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editGenres, setEditGenres] = useState<string[]>([]);

  const GENRES = [
    "Fantasy", "Sci-Fi", "Mystery", "Romance", "Horror", "Adventure",
    "Thriller", "Historical Fiction", "Young Adult", "Dystopian",
    "Paranormal", "Cyberpunk", "Steampunk", "Space Opera", "High Fantasy",
    "Urban Fantasy", "Crime", "Comedy", "Drama", "Poetry"
  ];

  useEffect(() => {
    async function fetchStory() {
      const s = await getStory(id);
      if (!s) {
        router.push("/publish");
        return;
      }
      setStory(s);
      setLoading(false);
      
      // Initialize settings state
      setEditTitle(s.title);
      setEditDescription(s.description);
      setEditGenres(s.genres || []);

      // Initialize with first chapter if available
      if (s.chapters.length > 0) {
        const firstChapter = s.chapters[0];
        setActiveChapterId(firstChapter.id);
        setChapterTitle(firstChapter.title);
        setChapterContent(firstChapter.content);
      }
    }
    fetchStory();
  }, [id, router]);

  const handleSelectChapter = (chapterId: string) => {
    const chapter = story?.chapters.find(c => c.id === chapterId);
    if (chapter) {
      setActiveChapterId(chapterId);
      setChapterTitle(chapter.title);
      setChapterContent(chapter.content);
    }
  };

  const handleAddChapter = async () => {
    if (!story) return;
    const newOrder = story.chapters.length + 1;
    const newChapter = await addChapter(story.id, `Chapter ${newOrder}`, newOrder);
    
    if (newChapter) {
      setStory(prev => prev ? ({...prev, chapters: [...prev.chapters, newChapter]}) : null);
      setActiveChapterId(newChapter.id);
      setChapterTitle(newChapter.title);
      setChapterContent(newChapter.content);
    }
  };

  const handleSaveChapter = async () => {
    if (!story || !activeChapterId) return;
    setIsSaving(true);
    
    const updatedChapter = await updateChapter(activeChapterId, {
      title: chapterTitle,
      content: chapterContent
    });

    if (updatedChapter) {
      setStory(prev => {
        if (!prev) return null;
        return {
          ...prev,
          chapters: prev.chapters.map(c => c.id === activeChapterId ? {...c, ...updatedChapter} : c)
        };
      });
    }
    
    setTimeout(() => setIsSaving(false), 500);
  };

  const toggleGenre = (genre: string) => {
    setEditGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleUpdateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story) return;
    
    const updated = await updateStory(story.id, {
      title: editTitle,
      description: editDescription,
      genres: editGenres
    });

    if (updated) {
      setStory(prev => prev ? ({ ...prev, ...updated }) : null);
      setShowSettings(false);
    } else {
      alert("Failed to update story.");
    }
  };

  if (loading) return <div className="text-white p-10">Loading Editor...</div>;
  if (!story) return null;

  const activeChapter = story.chapters.find(c => c.id === activeChapterId);

  return (
    <div className="flex h-screen bg-[#111] text-gray-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 border-r border-white/10 bg-black/40 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <Link href="/" className="flex items-center text-sm text-gray-400 hover:text-white mb-4">
            <ArrowLeft size={14} className="mr-1" /> Back to Home
          </Link>
          <h1 className="font-bold text-lg truncate text-purple-200" title={story.title}>{story.title}</h1>
          <p className="text-xs text-gray-500 truncate">{story.chapters.length} Chapters</p>
        </div>

        <div className="p-4">
          <button 
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center justify-center gap-2 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-sm mb-6"
          >
            <Settings size={14} /> Story Settings
          </button>

          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Chapters</h3>
            <button 
              onClick={handleAddChapter}
              className="p-1 hover:bg-white/10 rounded text-purple-400"
              title="Add Chapter"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            {story.chapters.length === 0 && (
              <p className="text-sm text-gray-600 italic text-center py-4">No chapters yet.</p>
            )}
            {story.chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => handleSelectChapter(chapter.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  activeChapterId === chapter.id 
                    ? "bg-purple-900/30 text-purple-200 border border-purple-500/30" 
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
              >
                <FileText size={14} />
                <span className="truncate">{chapter.title}</span>
                {activeChapterId === chapter.id && <ChevronRight size={14} className="ml-auto opacity-50" />}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-white/10">
           <button 
             onClick={() => setShowAiChat(!showAiChat)}
             className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
               showAiChat ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
             }`}
           >
             {showAiChat ? 'Hide AI Assistant' : 'Open AI Assistant'}
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {activeChapter ? (
          <>
            {/* Toolbar */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/20">
              <input
                type="text"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                className="bg-transparent text-xl font-bold text-white focus:outline-none placeholder-gray-600 w-full max-w-lg"
                placeholder="Chapter Title"
              />
              
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 uppercase tracking-wider mr-2">
                  {isSaving ? "Saving..." : "Unsaved changes"}
                </span>
                <button 
                  onClick={handleSaveChapter}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-all text-sm"
                >
                  <Save size={16} /> Save
                </button>
              </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
              <RichTextEditor 
                key={activeChapterId}
                content={chapterContent} 
                onChange={setChapterContent} 
              />
              
              <div className="h-32" /> {/* Bottom padding */}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <div className="p-4 bg-white/5 rounded-full mb-4">
              <FileText size={48} className="opacity-20" />
            </div>
            <h2 className="text-xl font-medium mb-2">No Chapter Selected</h2>
            <p className="mb-6">Select a chapter from the sidebar or create a new one.</p>
            <button 
              onClick={handleAddChapter}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
            >
              Create First Chapter
            </button>
          </div>
        )}

        {/* AI Chat Overlay Sidebar */}
        {showAiChat && (
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-black/80 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-purple-900/20">
              <h3 className="font-bold text-purple-200">AI Writing Assistant</h3>
              <button onClick={() => setShowAiChat(false)} className="text-gray-400 hover:text-white">
                <ChevronRight />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AiChat story={activeChapter ? `${chapterTitle}\n\n${chapterContent}` : story.description} />
            </div>
          </div>
        )}
      </div>
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Story Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateStory} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 h-32 resize-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Genres</label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-white/5 rounded-lg">
                  {GENRES.map(genre => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1 rounded-full text-xs border transition-all ${
                        editGenres.includes(genre)
                          ? "bg-purple-600 border-purple-500 text-white"
                          : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition shadow-lg shadow-purple-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
