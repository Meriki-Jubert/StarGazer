"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProfile, getStoriesByUsername, type Profile, type Story } from "@/lib/stories";
import Experience from "@/components/3d/Experience";
import ProfileView from "@/components/profile/ProfileView";

export default function AuthorProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  useEffect(() => {
    async function fetchData() {
      // Decode username in case it has special characters
      const decodedUsername = decodeURIComponent(username);
      
      const [p, s] = await Promise.all([
        getProfile(decodedUsername),
        getStoriesByUsername(decodedUsername)
      ]);
      
      setProfile(p);
      setStories(s);
      setLoading(false);
    }
    fetchData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <div className="text-xl animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black flex-col gap-4">
        <div className="text-xl text-red-400">Author not found</div>
        <Link href="/" className="text-purple-400 hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-gray-200 font-sans">
      <div className="fixed inset-0 -z-10">
        <Experience />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <ProfileView 
        profile={profile} 
        stories={stories} 
        sortBy={sortBy} 
        onSortChange={setSortBy} 
      />
    </div>
  );
}
