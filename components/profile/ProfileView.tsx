"use client";

import Image from "next/image";
import Link from "next/link";
import { User, BookOpen, Calendar, Globe, Twitter, Github, Linkedin, Facebook, Instagram, Youtube } from "lucide-react";
import { Profile, Story } from "@/lib/stories";

const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform.toLowerCase()) {
    case 'twitter': return <Twitter size={16} className="text-blue-400" />;
    case 'github': return <Github size={16} className="text-gray-300" />;
    case 'linkedin': return <Linkedin size={16} className="text-blue-600" />;
    case 'facebook': return <Facebook size={16} className="text-blue-500" />;
    case 'instagram': return <Instagram size={16} className="text-pink-500" />;
    case 'youtube': return <Youtube size={16} className="text-red-500" />;
    default: return <Globe size={16} className="text-green-400" />;
  }
};

interface ProfileViewProps {
  profile: Profile;
  stories: Story[];
  sortBy?: 'newest' | 'oldest' | 'title';
  onSortChange?: (sort: 'newest' | 'oldest' | 'title') => void;
  preview?: boolean;
}

export default function ProfileView({ profile, stories, sortBy = 'newest', onSortChange, preview = false }: ProfileViewProps) {
  
  const sortedStories = [...stories].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {!preview && (
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeftIcon />
          Back to Home
        </Link>
      )}

      {/* Banner */}
      <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-8 bg-white/5 border border-white/10">
        {profile.banner_url ? (
          <Image
            src={profile.banner_url}
            alt="Profile Banner"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-900/40 to-blue-900/40" />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-20 relative z-10">
        {/* Sidebar: Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-1 mb-4">
                <div className="relative w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                  {profile.avatar_url ? (
                    <Image 
                      src={profile.avatar_url} 
                      alt={profile.username} 
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <User size={48} className="text-gray-400" />
                  )}
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-1">
                {profile.full_name || profile.username}
              </h1>
              <p className="text-purple-300 text-sm mb-4">@{profile.username}</p>
              
              {profile.bio && (
                <div 
                  className="text-gray-300 text-sm leading-relaxed mb-6 prose prose-invert prose-sm max-w-none text-left w-full"
                  dangerouslySetInnerHTML={{ __html: profile.bio }}
                />
              )}

              {/* Custom Sections */}
              {profile.custom_sections
                ?.filter(section => preview || section.is_public !== false)
                .sort((a, b) => a.order - b.order)
                .map(section => (
                 <div key={section.id} className={`w-full text-left mb-4 p-3 bg-white/5 rounded-lg ${section.is_public === false ? 'opacity-60 border border-dashed border-gray-600' : ''}`}>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                      {section.title}
                      {section.is_public === false && <span className="text-[10px] bg-gray-700 px-1.5 rounded text-gray-300">Private</span>}
                    </h3>
                    <div 
                      className="text-sm text-gray-300 prose prose-invert prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                 </div>
              ))}

              <div className="w-full space-y-3 pt-4 border-t border-white/10">
                {(!profile.privacy_settings || profile.privacy_settings.show_stats !== false) && (
                  <>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <BookOpen size={16} className="text-purple-400" />
                      <span>{stories.length} Stories Published</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <Calendar size={16} className="text-blue-400" />
                      <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                    </div>
                  </>
                )}
                
                {profile.website && (
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <Globe size={16} className="text-green-400" />
                    <span className="truncate">{profile.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}

                {/* Social Links */}
                {profile.social_links && profile.social_links.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    {profile.social_links
                      .filter(link => preview || link.is_public !== false)
                      .map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors relative ${link.is_public === false ? 'opacity-50 border border-dashed border-gray-500' : ''}`}
                        title={`${link.platform}${link.is_public === false ? ' (Private)' : ''}`}
                      >
                        <SocialIcon platform={link.platform} />
                        {link.is_public === false && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-gray-500 rounded-full border border-black" />
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Stories */}
        <div className="lg:col-span-2 pt-12 lg:pt-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Bibliography</h2>
            {onSortChange && (
              <select 
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest' | 'title')}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Alphabetical</option>
              </select>
            )}
          </div>

          <div className="space-y-4">
            {sortedStories.length > 0 ? (
              sortedStories.map(story => (
                <Link 
                  key={story.id} 
                  href={`/stories/${story.id}`}
                  className={`block group ${preview ? 'pointer-events-none' : ''}`}
                >
                  <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition-all duration-300 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors truncate pr-4">
                          {story.title}
                        </h3>
                        {story.genres && story.genres.length > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30 whitespace-nowrap">
                            {story.genres[0]}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                        {story.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{story.chapters?.length || 0} Chapters</span>
                        <span>Updated {new Date(story.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-gray-400">
                <p>No stories published yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowLeftIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="mr-2"
    >
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );
}
