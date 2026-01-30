"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Menu, BookOpen, ChevronDown } from "lucide-react";
import { useEffect, useState, Suspense, use } from "react";
import { getStory, type Story } from "@/lib/stories";
import Experience from "@/components/3d/Experience";
import AiChat from "@/components/chat/AiChat";
import RichTextEditor from "@/components/editor/RichTextEditor";
import Rating from "@/components/story/Rating";
import Comments from "@/components/story/Comments";
import Actions from "@/components/story/Actions";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

function StoryContent({ id }: { id: string }) {
  const [story, setStory] = useState<Story | null>(null);
  const [showChapters, setShowChapters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastReadIndex, setLastReadIndex] = useState<number | null>(null);
  const [isTocOpen, setIsTocOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get chapter index from URL or default to 0
  const chapterParam = searchParams.get('chapter');
  const currentChapterIndex = chapterParam ? parseInt(chapterParam) - 1 : 0;

  useEffect(() => {
    async function fetchStory() {
      const s = await getStory(id);
      setStory(s ?? null);
      setLoading(false);
      
      // Load last read chapter from local storage
      const savedIndex = localStorage.getItem(`last_read_${id}`);
      if (savedIndex !== null) {
        setLastReadIndex(parseInt(savedIndex));
      }
    }
    fetchStory();
  }, [id]);

  useEffect(() => {
    // Open sidebar by default on large screens
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      // Defer state update to avoid synchronous render warning
      setTimeout(() => {
        setShowChapters(prev => (!prev ? true : prev));
      }, 0);
    }
  }, []);

  useEffect(() => {
    if (!story) return;

    // Check if we are on the default view (no chapter param)
    const isDefaultView = !searchParams.get('chapter');
    
    // If we are on default view and have a saved progress, don't overwrite it
    // Just ensure state matches storage
    if (isDefaultView) {
      const savedIndex = localStorage.getItem(`last_read_${id}`);
      if (savedIndex !== null) {
        const parsedIndex = parseInt(savedIndex);
        if (lastReadIndex !== parsedIndex) {
          // Defer state update to avoid synchronous render warning
          setTimeout(() => setLastReadIndex(parsedIndex), 0);
        }
        return;
      }
    }

    // Otherwise (user navigated to specific chapter, or no history exists), save progress
    localStorage.setItem(`last_read_${id}`, currentChapterIndex.toString());
    if (lastReadIndex !== currentChapterIndex) {
      // Defer state update to avoid synchronous render warning
      setTimeout(() => setLastReadIndex(currentChapterIndex), 0);
    }
    
  }, [currentChapterIndex, id, story, searchParams, lastReadIndex]);

  const navigateToChapter = (index: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('chapter', (index + 1).toString());
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo(0, 0);
  };

  if (loading) return <div className="p-10 text-white">Loading story...</div>;
  if (!story) return <div className="p-10 text-white">Story not found.</div>;

  const currentChapter = story.chapters[currentChapterIndex];

  return (
    <div className="relative min-h-screen flex text-gray-200 font-serif">
      <div className="fixed inset-0 -z-10">
        <Experience />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto border-r border-white/10 bg-black/50 backdrop-blur-sm overflow-x-hidden">
        <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg transition-all duration-300">
          <div className="flex flex-col w-full">
            {/* Row 1: Nav + Title + Actions */}
            <div className="flex items-center justify-between p-2 pl-2 md:p-4 gap-2">
              {/* Left: Back + Title Context */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Link href="/" className="p-3 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="min-w-0 flex-1">
                  <h1 className="text-base md:text-xl font-bold text-white truncate leading-tight">
                    {story.title}
                  </h1>
                  <p className="text-xs text-purple-300 font-medium truncate">
                    By {story.author?.username || "Unknown Author"}
                  </p>
                </div>
              </div>

              {/* Right: Actions + Menu */}
              <div className="flex items-center gap-0.5 shrink-0">
                <Actions storyId={story.id} />
                <button
                  onClick={() => setShowChapters(!showChapters)}
                  className={`p-3 hover:bg-white/10 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${showChapters ? 'text-purple-400' : 'text-gray-400'}`}
                  title={showChapters ? "Hide Sidebar" : "Show Sidebar"}
                >
                  <Menu size={20} />
                </button>
              </div>
            </div>

            {/* Row 2: Genres + Rating (Compact) */}
            <div className="flex items-center justify-between px-4 pb-3 gap-4">
              <div className="flex items-center gap-2 overflow-x-auto flex-1 pb-1">
                {story.genres?.map((g, i) => (
                  <span key={i} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 whitespace-nowrap shrink-0">
                    {g}
                  </span>
                ))}
              </div>
              <div className="shrink-0 z-40">
                <Rating storyId={story.id} />
              </div>
            </div>
          </div>
        </header>

        <article className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          {/* Resume Banner */}
          {lastReadIndex !== null && lastReadIndex > currentChapterIndex && story.chapters[lastReadIndex] && (
             <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-between">
                <div className="min-w-0 mr-4">
                   <p className="text-sm text-blue-200 truncate">You left off at <span className="font-bold">{story.chapters[lastReadIndex].title}</span></p>
                </div>
                <button 
                  onClick={() => navigateToChapter(lastReadIndex)}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition shrink-0"
                >
                  Resume
                </button>
             </div>
          )}

          {story.chapters.length > 0 ? (
            currentChapter ? (
              <div className="prose prose-invert lg:prose-lg max-w-none">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">
                  {currentChapter.title}
                </h2>
                <RichTextEditor
                  key={currentChapter.id}
                  content={currentChapter.content}
                  onChange={() => { }}
                  editable={false}
                />
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-gray-400">Chapter not found.</p>
                <button
                  onClick={() => navigateToChapter(0)}
                  className="mt-4 text-purple-400 hover:underline"
                >
                  Go to first chapter
                </button>
              </div>
            )
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400 mb-4">{story.description}</p>
              <p className="text-sm text-gray-500 italic">No chapters published yet.</p>
            </div>
          )}

          {/* Navigation */}
          {story.chapters.length > 0 && (
            <div className="mt-16 pt-8 border-t border-white/10 flex justify-between font-sans">
              <button
                disabled={currentChapterIndex <= 0}
                onClick={() => navigateToChapter(currentChapterIndex - 1)}
                className="flex items-center gap-2 px-4 py-2 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={16} /> Previous
              </button>
              <button
                disabled={currentChapterIndex >= story.chapters.length - 1}
                onClick={() => navigateToChapter(currentChapterIndex + 1)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded disabled:opacity-30 disabled:bg-gray-700 disabled:cursor-not-allowed"
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          )}
          
          <Comments storyId={story.id} />
        </article>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showChapters && (
        <div 
          className="fixed inset-0 bg-black/80 z-20 lg:hidden"
          onClick={() => setShowChapters(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile) */}
      <div className={`
        fixed inset-y-0 right-0 z-30 w-80 bg-black/90 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 ease-in-out
        lg:sticky lg:top-0 lg:h-screen lg:bg-black/60 flex flex-col
        ${showChapters 
          ? 'translate-x-0 lg:w-96 lg:translate-x-0 opacity-100' 
          : 'translate-x-full lg:w-0 lg:translate-x-0 lg:border-none lg:opacity-0 pointer-events-none lg:pointer-events-none'
        }
      `}>
        {/* TOC Section */}
        <div className={`flex flex-col border-b border-white/10 transition-all duration-300 ease-in-out ${isTocOpen ? 'flex-1 min-h-0' : 'flex-none'}`}>
          <div 
            className="p-4 bg-purple-900/20 font-sans flex items-center justify-between cursor-pointer hover:bg-purple-900/30 transition select-none"
            onClick={() => setIsTocOpen(!isTocOpen)}
          >
            <div className="flex items-center gap-2">
              {isTocOpen ? <ChevronDown size={16} className="text-purple-300"/> : <ChevronRight size={16} className="text-purple-300"/>}
              <div className="whitespace-nowrap overflow-hidden">
                <h2 className="font-bold text-purple-300 text-sm">Table of Contents</h2>
                {isTocOpen && <p className="text-xs text-purple-200/60">{story.chapters.length} Chapters</p>}
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowChapters(false); }} 
              className="text-gray-400 p-2 hover:bg-white/10 rounded"
              title="Close Sidebar"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {isTocOpen && (
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {story.chapters.map((chapter, index) => {
                const isCurrent = index === currentChapterIndex;
                const isLastRead = index === lastReadIndex;
                
                return (
                <button
                  key={chapter.id}
                  onClick={() => {
                    navigateToChapter(index);
                    setShowChapters(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all relative group ${
                    isCurrent
                      ? "bg-purple-500/20 text-purple-200 border border-purple-500/30"
                      : isLastRead
                      ? "bg-blue-500/10 text-blue-200 border border-blue-500/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className={isCurrent || isLastRead ? "font-medium" : ""}>{chapter.title}</span>
                      {isLastRead && !isCurrent && (
                        <span className="text-[10px] text-blue-400 uppercase tracking-wider font-bold mt-0.5">Last Read</span>
                      )}
                      {isCurrent && isLastRead && (
                        <span className="text-[10px] text-purple-400 uppercase tracking-wider font-bold mt-0.5">Current & Last Read</span>
                      )}
                    </div>
                    {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                    {isLastRead && !isCurrent && <BookOpen size={12} className="text-blue-400" />}
                  </div>
                </button>
              )})}
            </div>
          )}
        </div>

        {/* Chat Section */}
        <div className={`flex flex-col border-t border-white/10 transition-all duration-300 ease-in-out ${isChatOpen ? 'flex-1 min-h-0' : 'flex-none'}`}>
          <div 
            className="p-4 bg-purple-900/10 border-b border-white/5 font-sans flex items-center justify-between cursor-pointer hover:bg-purple-900/20 transition select-none"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <div className="flex items-center gap-2">
              {isChatOpen ? <ChevronDown size={16} className="text-purple-300"/> : <ChevronRight size={16} className="text-purple-300"/>}
              <h3 className="font-bold text-purple-300 text-sm">Fan Chat (AI)</h3>
            </div>
          </div>
          {isChatOpen && (
            <div className="flex-1 overflow-hidden relative">
              <AiChat story={currentChapter ? `${currentChapter.title}\n\n${currentChapter.content}` : story.description} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading...</div>}>
      <StoryContent id={id} />
    </Suspense>
  );
}
