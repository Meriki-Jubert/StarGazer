-- Create profiles table if it doesn't exist
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone" 
  on public.profiles for select 
  using (true);

create policy "Users can insert their own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- Add customization columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_sections JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{"show_stats": true}'::jsonb;

-- Storage Policies (Requires 'profiles' bucket to be created manually or via dashboard if not exists)
-- Attempting to create bucket via SQL (may fail if no permissions)
insert into storage.buckets (id, name, public)
values ('profiles', 'profiles', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'profiles' );

create policy "Anyone can upload an avatar"
  on storage.objects for insert
  with check ( bucket_id = 'profiles' and auth.role() = 'authenticated' );

create policy "Anyone can update their own avatar"
  on storage.objects for update
  using ( bucket_id = 'profiles' and auth.uid() = owner )
  with check ( bucket_id = 'profiles' and auth.uid() = owner );
