"use client";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { BookOpen, PenSquare } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

const Experience = dynamic(() => import('@/components/3d/Experience'), { ssr: false });

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col text-white overflow-hidden font-sans">
      <Experience stars={3500} sparkles={80} />
      
      <Navbar />

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4 z-10">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
          Stories That <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Come Alive
          </span>
        </h1>
        <p className="text-base sm:text-xl text-gray-300 max-w-2xl mb-8 px-4">
          Immerse yourself in 3D worlds, write your legacy, and chat with the ultimate AI fan about every plot twist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
          <Link href="/read" className="group relative px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-100 transition flex items-center justify-center gap-2 w-full sm:w-auto">
            <BookOpen className="w-5 h-5" />
            Start Reading
          </Link>
          <Link href="/publish" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full font-bold hover:bg-white/20 transition flex items-center justify-center gap-2 w-full sm:w-auto">
            <PenSquare className="w-5 h-5" />
            Publish Story
          </Link>
        </div>
      </div>
    </main>
  );
}
