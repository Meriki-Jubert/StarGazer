"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { updateProfile, getProfile } from "@/lib/stories";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, User } from "lucide-react";
import Experience from "@/components/3d/Experience";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function fetchUserAndProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }

      const profile = await getProfile();
      if (profile) {
        setUsername(profile.username || "");
      }
      setLoading(false);
    }
    fetchUserAndProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || username.length < 3) {
      setMessage({ type: 'error', text: "Username must be at least 3 characters long." });
      return;
    }

    setSaving(true);
    setMessage(null);

    const success = await updateProfile(username);
    
    if (success) {
      setMessage({ type: 'success', text: "Profile updated successfully!" });
    } else {
      setMessage({ type: 'error', text: "Failed to update profile. Username might be taken." });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white bg-black">Loading Profile...</div>;
  }

  return (
    <div className="relative min-h-screen text-gray-200 font-sans">
       <div className="fixed inset-0 -z-10">
        <Experience />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="max-w-xl mx-auto p-6 pt-20">
        <header className="flex items-center gap-4 mb-8">
            <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition">
                <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
        </header>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8">
            <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-purple-600/20 rounded-full flex items-center justify-center border-2 border-purple-500/30">
                    <User className="w-10 h-10 text-purple-300" />
                </div>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg text-sm text-center ${message.type === 'success' ? 'bg-green-500/10 text-green-200 border border-green-500/20' : 'bg-red-500/10 text-red-200 border border-red-500/20'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-white placeholder-gray-600 transition"
                        placeholder="Enter your username"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        This username will be displayed on your stories and comments.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {saving ? "Saving..." : <><Save size={18} /> Save Changes</>}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
