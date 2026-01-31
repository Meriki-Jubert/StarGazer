"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { updateProfile, getCurrentUserProfile, Profile } from "@/lib/stories";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Experience from "@/components/3d/Experience";
import Navbar from '@/components/layout/Navbar';
import ProfileEditor from "@/components/profile/ProfileEditor";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function fetchUserAndProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }

      const userProfile = await getCurrentUserProfile();
      if (userProfile) {
        setProfile(userProfile);
      } else {
        // If no profile exists yet, create a basic one in state
        // In a real app, you might want to force profile creation on signup
        setProfile({
          id: user.id,
          username: user.email?.split('@')[0] || 'user',
          created_at: new Date().toISOString(),
        });
      }
      setLoading(false);
    }
    fetchUserAndProfile();
  }, [router]);

  const handleSave = async (updatedProfile: Partial<Profile>) => {
    if (!updatedProfile.username) return;
    
    try {
      const finalProfile = { ...updatedProfile };
      const userId = profile?.id;

      if (!userId) throw new Error("User ID not found");

      // We pass the username as the first argument as required by updateProfile
      if (!finalProfile.username) throw new Error("Username is required");
      const success = await updateProfile(finalProfile.username, finalProfile);
      
      if (success) {
        // Update local state with the final profile
        setProfile(prev => prev ? ({ ...prev, ...finalProfile } as Profile) : null);
        router.refresh();
      } else {
          throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="relative min-h-screen text-gray-200 font-sans">
       <div className="fixed inset-0 -z-10">
        <Experience />
        <div className="absolute inset-0 bg-black/90" />
      </div>

      <Navbar />

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <header className="flex items-center gap-4 mb-8">
            <Link href={`/author/${profile.username}`} className="p-2 hover:bg-white/10 rounded-full transition text-gray-300 hover:text-white">
                <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
              <p className="text-gray-400 text-sm">Customize how your profile looks to others.</p>
            </div>
        </header>

        <ProfileEditor initialProfile={profile} onSave={handleSave} />
      </div>
    </div>
  );
}
