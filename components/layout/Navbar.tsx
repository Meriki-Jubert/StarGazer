"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Menu, X, BookOpen, PenTool, LayoutDashboard, Bookmark, User as UserIcon, LogOut, ChevronDown } from "lucide-react";
import AuthDialog from "@/components/auth/AuthDialog";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check active session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: "Explore", href: "/read", icon: BookOpen },
    { name: "Write", href: "/publish", icon: PenTool }, 
  ];

  const authNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold tracking-wider bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                StarGazer
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                    pathname === item.href ? "text-purple-400" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {user && authNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                    pathname === item.href ? "text-purple-400" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition focus:outline-none"
                  >
                    <span className="max-w-[150px] truncate">{user.email}</span>
                    <ChevronDown size={16} />
                  </button>

                  {/* Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-200">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserIcon size={16} />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 text-left"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                   <button 
                     onClick={() => setIsAuthDialogOpen(true)}
                     className="text-sm font-medium text-gray-300 hover:text-white transition"
                   >
                     Log In
                   </button>
                   <button 
                     onClick={() => setIsAuthDialogOpen(true)}
                     className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-full hover:bg-purple-700 transition"
                   >
                     Sign Up
                   </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-4 rounded-md text-base font-medium flex items-center gap-3 ${
                    pathname === item.href ? "bg-purple-900/20 text-purple-400" : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              ))}
              
              {user && authNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-4 rounded-md text-base font-medium flex items-center gap-3 ${
                    pathname === item.href ? "bg-purple-900/20 text-purple-400" : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 pb-4 border-t border-white/10">
              {user ? (
                <div className="px-2 space-y-1">
                  <div className="px-3 py-2 text-sm text-gray-400">Signed in as {user.email}</div>
                  <Link
                    href="/profile"
                    className="block px-3 py-4 rounded-md text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserIcon size={20} />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-3 py-4 rounded-md text-base font-medium text-red-400 hover:bg-white/5 hover:text-red-300 flex items-center gap-3"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="px-4 py-4 space-y-4">
                  <button 
                    onClick={() => { setIsAuthDialogOpen(true); setIsMobileMenuOpen(false); }}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700"
                  >
                    Sign Up
                  </button>
                  <button 
                    onClick={() => { setIsAuthDialogOpen(true); setIsMobileMenuOpen(false); }}
                    className="w-full flex justify-center py-3 px-4 border border-white/20 rounded-lg shadow-sm text-base font-medium text-gray-300 hover:bg-white/10"
                  >
                    Log In
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Dialog */}
      <AuthDialog isOpen={isAuthDialogOpen} onClose={() => setIsAuthDialogOpen(false)} />
      
      {/* Spacer for fixed navbar */}
      <div className="h-16" /> 
    </>
  );
}
