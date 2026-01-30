"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { createPortal } from "react-dom";
import { Loader2 } from "lucide-react";

export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

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

  const handleAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        if (!username || username.length < 3) throw new Error("Username must be at least 3 characters");

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (authError) throw authError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: authData.user.id, username }]);
          
          if (profileError) {
             console.error("Profile creation failed:", profileError);
             // Note: User is created in Auth, but profile failed. 
             // In a real app, we might want to handle this more gracefully.
          }
        }

        alert("Check your email for the confirmation link!");
        setOpen(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setOpen(false);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-sm font-medium text-purple-300 hover:text-purple-200 transition">
          Dashboard
        </Link>
        <Link href="/bookmarks" className="text-sm font-medium text-purple-300 hover:text-purple-200 transition">
          My Bookmarks
        </Link>
        <Link href="/profile" className="text-sm font-medium text-purple-300 hover:text-purple-200 transition">
          Profile
        </Link>
        <span className="text-sm text-gray-300 hidden md:inline">
          {user.email}
        </span>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 border border-white/20 rounded-full hover:bg-white/10 transition text-sm"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-x-4">
        <button onClick={() => { setMode("login"); setOpen(true); }} className="px-4 py-2 hover:text-purple-300 transition">Login</button>
        <button onClick={() => { setMode("signup"); setOpen(true); }} className="px-4 py-2 bg-purple-600 rounded-full hover:bg-purple-700 transition">Sign Up</button>
      </div>
      {open && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-[101] w-full max-w-sm p-8 rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold mb-6 text-white text-center">{mode === "login" ? "Welcome Back" : "Create Account"}</h3>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {mode === "signup" && (
                <input
                  placeholder="Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-white placeholder-gray-500"
                />
              )}
              <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-white placeholder-gray-500"
              />
              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-white placeholder-gray-500"
              />
              <button
                onClick={handleAuth}
                disabled={loading}
                className="w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === "login" ? "Login" : "Sign Up"}
              </button>

              <p className="text-xs text-center text-gray-400 mt-4">
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  {mode === "login" ? "Sign Up" : "Login"}
                </button>
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
