"use client";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Experience from '@/components/3d/Experience'; 
import StoriesFeed from '@/components/stories/StoriesFeed';
import Navbar from '@/components/layout/Navbar';

export default function ReadPage() {
  return (
    <div className="relative min-h-screen flex flex-col text-gray-200 font-sans">
       <div className="fixed inset-0 -z-10">
          <Experience /> 
          <div className="absolute inset-0 bg-black/80" />
       </div>

      <Navbar />

      <div className="max-w-7xl mx-auto w-full px-6 md:px-8 pt-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Book Archives</h1>
            <p className="text-sm text-gray-400">Explore the multiverse of stories</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-8 pb-8">
        <StoriesFeed />
      </main>
    </div>
  );
}
