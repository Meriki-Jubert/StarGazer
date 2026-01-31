import { supabase } from './supabase';

export type Chapter = {
  id: string;
  story_id: string;
  title: string;
  content: string;
  order: number;
  published: boolean;
  created_at?: string;
};

export type Story = {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  genres: string[];
  tags?: string[];
  chapters: Chapter[];
  created_at: string;
  updated_at: string;
  author?: { username: string };
};

export type Rating = {
  id: string;
  user_id: string;
  story_id: string;
  rating: number;
  created_at: string;
};

export type Comment = {
  id: string;
  user_id: string;
  story_id: string;
  content: string;
  created_at: string;
  author?: { username: string };
};

export type Bookmark = {
  id: string;
  user_id: string;
  story_id: string;
  created_at: string;
};

export type Profile = {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  banner_url?: string;
  website?: string;
  bio?: string;
  social_links?: { platform: string; url: string; is_public?: boolean }[];
  custom_sections?: { id: string; title: string; content: string; order: number; is_public?: boolean }[];
  privacy_settings?: {
    show_stats: boolean;
  };
  created_at: string;
};

// --- READ Operations ---

export async function getProfile(username: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
  return data;
}

export async function getStoriesByUsername(username: string): Promise<Story[]> {
  // First get the user ID from the username
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (profileError || !profile) {
    console.error("Error fetching user for stories:", profileError);
    return [];
  }

  const { data: stories, error } = await supabase
    .from('stories')
    .select('*, chapters(*), author:profiles(username)')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching author stories:", error);
    return [];
  }

  return stories.map(s => ({
    ...s,
    chapters: (s.chapters || []).sort((a: Chapter, b: Chapter) => a.order - b.order)
  }));
}

export interface GetStoriesOptions {
  limit?: number;
  genres?: string[];
  search?: string;
}

export async function getStories(options: number | GetStoriesOptions = 20): Promise<Story[]> {
  const limit = typeof options === 'number' ? options : (options.limit || 20);
  const { genres, search } = typeof options === 'object' ? options : { genres: undefined, search: undefined };

  let query = supabase
    .from('stories')
    .select('*, chapters(*), author:profiles(username)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (genres && genres.length > 0) {
    query = query.overlaps('genres', genres);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data: stories, error } = await query;

  if (error) {
    console.error("Error fetching stories:", error);
    return [];
  }

  // Sort chapters by order for each story
  return stories.map(s => ({
    ...s,
    chapters: (s.chapters || []).sort((a: Chapter, b: Chapter) => a.order - b.order)
  }));
}

export async function getStory(id: string): Promise<Story | null> {
  const { data: story, error } = await supabase
    .from('stories')
    .select('*, chapters(*), author:profiles(username)')
    .eq('id', id)
    .single();

  if (error || !story) {
    console.error("Error fetching story:", error);
    return null;
  }

  // Sort chapters
  story.chapters.sort((a: Chapter, b: Chapter) => a.order - b.order);
  return story;
}

// --- WRITE Operations ---

export async function createStory(story: { title: string; description: string; genres: string[] }): Promise<Story | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not authenticated");
    return null;
  }

  const { data, error } = await supabase
    .from('stories')
    .insert([{
      user_id: user.id,
      title: story.title,
      description: story.description,
      genres: story.genres,
      tags: [],
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating story:", JSON.stringify(error, null, 2));
    return null;
  }

  return { ...data, chapters: [] };
}

export async function addChapter(storyId: string, title: string, order: number): Promise<Chapter | null> {
  const { data, error } = await supabase
    .from('chapters')
    .insert([{
      story_id: storyId,
      title,
      content: '',
      "order": order,
      published: false
    }])
    .select()
    .single();

  if (error) {
    console.error("Error adding chapter:", error);
    return null;
  }

  return data;
}

export async function updateChapter(chapterId: string, updates: Partial<Chapter>): Promise<Chapter | null> {
  const { data, error } = await supabase
    .from('chapters')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', chapterId)
    .select()
    .single();

  if (error) {
    console.error("Error updating chapter:", error);
    return null;
  }

  return data;
}

export async function updateStory(storyId: string, updates: Partial<Story>): Promise<Story | null> {
  const { data, error } = await supabase
    .from('stories')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', storyId)
    .select()
    .single();

  if (error) {
    console.error("Error updating story:", error);
    return null;
  }
  return data;
}

export async function getUserStories(userId: string): Promise<Story[]> {
  const { data: stories, error } = await supabase
    .from('stories')
    .select('*, chapters(*), author:profiles(username)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching user stories:", error);
    return [];
  }

  return stories.map(s => ({
    ...s,
    chapters: (s.chapters || []).sort((a: Chapter, b: Chapter) => a.order - b.order)
  }));
}

export async function deleteStory(storyId: string): Promise<boolean> {
  const { error } = await supabase
    .from('stories')
    .delete()
    .eq('id', storyId);

  if (error) {
    console.error("Error deleting story:", error);
    return false;
  }
  return true;
}

// --- Ratings ---

export async function getStoryRating(storyId: string): Promise<{ average: number; count: number }> {
  const { data, error } = await supabase
    .from('ratings')
    .select('rating')
    .eq('story_id', storyId);

  if (error) {
    console.error("Error fetching ratings:", error);
    return { average: 0, count: 0 };
  }

  if (!data || data.length === 0) return { average: 0, count: 0 };

  const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
  return { average: sum / data.length, count: data.length };
}

export async function getUserRating(storyId: string): Promise<number | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('ratings')
    .select('rating')
    .eq('story_id', storyId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user rating:", error);
  }

  return data ? data.rating : null;
}

export async function rateStory(storyId: string, rating: number): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('ratings')
    .upsert({ story_id: storyId, user_id: user.id, rating }, { onConflict: 'user_id, story_id' });

  if (error) {
    console.error("Error rating story:", error);
    return false;
  }
  return true;
}

// --- Comments ---

export async function getComments(storyId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*, author:profiles(username)')
    .eq('story_id', storyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
  return data || [];
}

export async function addComment(storyId: string, content: string): Promise<Comment | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('comments')
    .insert([{ story_id: storyId, user_id: user.id, content }])
    .select()
    .single();

  if (error) {
    console.error("Error adding comment:", error);
    return null;
  }
  return data;
}

// --- Bookmarks ---

export async function isBookmarked(storyId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('story_id', storyId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) return false;
  return !!data;
}

export async function toggleBookmark(storyId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const isAlreadyBookmarked = await isBookmarked(storyId);

  if (isAlreadyBookmarked) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('story_id', storyId)
      .eq('user_id', user.id);
    return !error ? false : true; // Return false (not bookmarked) if success
  } else {
    const { error } = await supabase
      .from('bookmarks')
      .insert([{ story_id: storyId, user_id: user.id }]);
    return !error ? true : false; // Return true (bookmarked) if success
  }
}

export async function getBookmarkedStories(): Promise<Story[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('story_id')
    .eq('user_id', user.id);

  if (error || !bookmarks) return [];

  const storyIds = bookmarks.map(b => b.story_id);
  
  if (storyIds.length === 0) return [];

  const { data: stories, error: storiesError } = await supabase
    .from('stories')
    .select('*, chapters(*), author:profiles(username)')
    .in('id', storyIds);

  if (storiesError) {
    console.error("Error fetching bookmarked stories:", storiesError);
    return [];
  }

  return (stories || []).map(s => ({
    ...s,
    chapters: (s.chapters || []).sort((a: Chapter, b: Chapter) => a.order - b.order)
  }));
}

// --- Profiles ---

export async function updateProfile(username: string, updates?: Partial<Profile>): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('profiles')
    .upsert({ 
      id: user.id, 
      username, 
      ...updates,
      updated_at: new Date().toISOString() 
    });

  if (error) {
    console.error("Error updating profile:", error);
    return false;
  }
  return true;
}

export async function getCurrentUserProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
    
  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
  
  return data;
}
