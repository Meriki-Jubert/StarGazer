"use client";

export type Chapter = {
  id: string;
  title: string;
  content: string; // HTML content
  order: number;
  published: boolean;
};

export type Story = {
  id: string;
  title: string;
  description: string;
  genre: string;
  tags?: string[];
  coverImage?: string;
  chapters: Chapter[];
  createdAt: number;
  updatedAt: number;
};

const KEY = "stargazer:stories_v2";

export function getStories(): Story[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  try {
    return raw ? (JSON.parse(raw) as Story[]) : [];
  } catch {
    return [];
  }
}

export function saveStory(story: Partial<Story> & { title: string }): Story {
  const all = getStories();
  const existingIndex = all.findIndex(s => s.id === story.id);
  
  if (existingIndex >= 0) {
    // Update existing
    const updated = { 
      ...all[existingIndex], 
      ...story, 
      updatedAt: Date.now() 
    };
    all[existingIndex] = updated;
    localStorage.setItem(KEY, JSON.stringify(all));
    return updated;
  } else {
    // Create new
    const newStory: Story = {
      id: crypto.randomUUID(),
      title: story.title,
      description: story.description || "",
      genre: story.genre || "Other",
      tags: story.tags || [],
      chapters: story.chapters || [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    localStorage.setItem(KEY, JSON.stringify([newStory, ...all]));
    return newStory;
  }
}

export function getStory(id: string): Story | undefined {
  return getStories().find((s) => s.id === id);
}

export function addChapter(storyId: string, title: string): Story | undefined {
  const story = getStory(storyId);
  if (!story) return undefined;

  const newChapter: Chapter = {
    id: crypto.randomUUID(),
    title,
    content: "",
    order: story.chapters.length + 1,
    published: false
  };

  story.chapters.push(newChapter);
  return saveStory(story);
}

export function updateChapter(storyId: string, chapterId: string, updates: Partial<Chapter>): Story | undefined {
  const story = getStory(storyId);
  if (!story) return undefined;

  const chIndex = story.chapters.findIndex(c => c.id === chapterId);
  if (chIndex === -1) return undefined;

  story.chapters[chIndex] = { ...story.chapters[chIndex], ...updates };
  return saveStory(story);
}
