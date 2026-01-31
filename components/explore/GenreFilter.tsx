"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, Check, Filter, Search, X, AlertCircle } from "lucide-react";
import { ALL_GENRES, isSensitiveGenre } from "@/lib/genres";

interface GenreFilterProps {
  selectedGenres: string[];
  onChange: (genres: string[]) => void;
}

export default function GenreFilter({ selectedGenres, onChange }: GenreFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredGenres = useMemo(() => {
    // Minimum character threshold of 2 characters before search activates
    if (debouncedTerm.length < 2) {
      return ALL_GENRES;
    }
    return ALL_GENRES.filter((g) => 
      g.toLowerCase().includes(debouncedTerm.toLowerCase())
    );
  }, [debouncedTerm]);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onChange(selectedGenres.filter((g) => g !== genre));
    } else {
      onChange([...selectedGenres, genre]);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedTerm("");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
          isOpen || selectedGenres.length > 0
            ? "bg-purple-600/20 border-purple-500/50 text-purple-200"
            : "bg-black/40 border-white/10 text-gray-300 hover:bg-white/5"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Filter size={16} />
        <span>Genres {selectedGenres.length > 0 && `(${selectedGenres.length})`}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-64 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden backdrop-blur-md flex flex-col max-h-96">
          {/* Search Input */}
          <div className="p-2 border-b border-white/10 bg-gray-900/95 sticky top-0 z-10">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search genres..."
                className="w-full bg-black/40 border border-white/10 rounded-md py-1.5 pl-8 pr-8 text-sm text-white focus:outline-none focus:border-purple-500 placeholder-gray-500"
                aria-label="Search genres"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Genre List */}
          <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
            {filteredGenres.length > 0 ? (
              filteredGenres.map((genre) => {
                const isSelected = selectedGenres.includes(genre);
                const isSensitive = isSensitiveGenre(genre);
                
                return (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                      isSelected
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center gap-2 truncate mr-2">
                      <span className={isSensitive ? "text-red-300" : ""}>{genre}</span>
                      {isSensitive && (
                        <AlertCircle size={12} className="text-red-500 shrink-0" aria-label="Sensitive content" />
                      )}
                    </div>
                    {isSelected && <Check size={14} className="shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-gray-400 text-sm">
                No genres found
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {selectedGenres.length > 0 && (
            <div className="p-2 border-t border-white/10 bg-gray-900/95">
              <button
                onClick={() => onChange([])}
                className="w-full text-center text-xs text-gray-400 hover:text-white py-1 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
