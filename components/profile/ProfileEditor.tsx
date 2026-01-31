"use client";

import { useState, useEffect } from "react";
import { Profile } from "@/lib/stories";
import { User, Save, AlertCircle, X, RotateCcw, Eye, Layers } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import ProfileView from "./ProfileView";

interface ProfileEditorProps {
  initialProfile: Profile;
  onSave: (updatedProfile: Partial<Profile>) => Promise<void>;
}

export default function ProfileEditor({ initialProfile, onSave }: ProfileEditorProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProfile(initialProfile);
    setDirty(false);
  }, [initialProfile]);

  // Handle Input Changes
  const handleChange = (field: keyof Profile, value: unknown) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    setError(null);
    
    // Validation
    if (!profile.username || profile.username.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(profile.username)) {
      setError("Username can only contain letters, numbers, underscores, and hyphens.");
      return;
    }

    if (profile.full_name && profile.full_name.length > 50) {
      setError("Full name must be 50 characters or less.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(profile);
      setDirty(false);
    } catch (error) {
      console.error("Failed to save profile", error);
      setError("Failed to save profile. Username might be taken or check your connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevert = () => {
    if (confirm("Are you sure you want to discard all unsaved changes?")) {
      setProfile(initialProfile);
      setDirty(false);
      setError(null);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[80vh] bg-[#0a0a0a] text-gray-200 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="text-purple-500" /> Edit Profile
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              isPreviewMode ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            <Eye size={16} /> {isPreviewMode ? 'Edit Mode' : 'Preview'}
          </button>
          {dirty && (
            <button
              onClick={handleRevert}
              disabled={isSaving}
              className="px-4 py-2 bg-white/5 hover:bg-red-500/20 hover:text-red-300 text-gray-300 rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              <RotateCcw size={16} /> Revert
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!dirty || isSaving}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold transition flex items-center gap-2"
          >
            {isSaving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {error && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-xl border border-red-400 backdrop-blur-md flex items-center gap-3">
            <AlertCircle size={20} />
            {error}
            <button onClick={() => setError(null)} className="ml-2 hover:bg-white/20 p-1 rounded-full"><X size={14} /></button>
          </div>
        )}
        
        {isPreviewMode ? (
          <div className="w-full h-full overflow-y-auto bg-black">
             {/* Pass a dummy stories array or empty for preview */}
            <ProfileView profile={profile} stories={[]} />
          </div>
        ) : (
          /* Main Content Area - Simplified (No Sidebar) */
          <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-black to-gray-900/50 flex justify-center">
            <div className="w-full max-w-2xl space-y-6">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="p-3 bg-purple-500/10 rounded-full text-purple-400">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Identity</h3>
                  <p className="text-sm text-gray-400">Manage your public profile information</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Full Name</label>
                <input
                  type="text"
                  value={profile.full_name || ''}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-white transition"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Username</label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-white transition"
                />
                <p className="text-xs text-gray-500">Unique identifier for your profile URL.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Bio</label>
                <RichTextEditor
                  content={profile.bio || ''}
                  onChange={(content) => handleChange('bio', content)}
                  placeholder="Tell your story..."
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
