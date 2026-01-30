-- Create Ratings Table
create table public.ratings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  story_id uuid references public.stories(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, story_id)
);

-- Create Comments Table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  story_id uuid references public.stories(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Bookmarks Table
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  story_id uuid references public.stories(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, story_id)
);

-- Enable RLS
alter table public.ratings enable row level security;
alter table public.comments enable row level security;
alter table public.bookmarks enable row level security;

-- Policies for Ratings
create policy "Ratings are viewable by everyone" on public.ratings for select using (true);
create policy "Users can insert their own ratings" on public.ratings for insert with check (auth.uid() = user_id);
create policy "Users can update their own ratings" on public.ratings for update using (auth.uid() = user_id);
create policy "Users can delete their own ratings" on public.ratings for delete using (auth.uid() = user_id);

-- Policies for Comments
create policy "Comments are viewable by everyone" on public.comments for select using (true);
create policy "Users can insert their own comments" on public.comments for insert with check (auth.uid() = user_id);
create policy "Users can delete their own comments" on public.comments for delete using (auth.uid() = user_id);

-- Policies for Bookmarks
create policy "Users can view their own bookmarks" on public.bookmarks for select using (auth.uid() = user_id);
create policy "Users can insert their own bookmarks" on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "Users can delete their own bookmarks" on public.bookmarks for delete using (auth.uid() = user_id);
