export const GENRE_CATEGORIES = [
  {
    name: "Romance",
    genres: [
      "Contemporary Romance", "Historical Romance", "Paranormal Romance", "Romantic Suspense",
      "RomCom", "Billionaire Romance", "Dark Romance", "Fantasy Romance", "Sci-Fi Romance",
      "Clean Romance", "Erotic Romance (18+)", "LGBTQ+ Romance", "Harem/Reverse Harem",
      "Office Romance", "Enemies to Lovers", "Friends to Lovers", "Fake Relationship",
      "Second Chance", "Slow Burn", "Forbidden Love"
    ]
  },
  {
    name: "Fantasy",
    genres: [
      "High Fantasy", "Urban Fantasy", "Dark Fantasy", "Epic Fantasy", "Progression Fantasy",
      "LitRPG", "Isekai", "Xianxia/Wuxia", "Magical Realism", "Mythology", "Fairy Tales",
      "Sword and Sorcery", "Grimdark", "Low Fantasy", "Arthurian", "Gaslamp Fantasy"
    ]
  },
  {
    name: "Sci-Fi",
    genres: [
      "Space Opera", "Cyberpunk", "Steampunk", "Dystopian", "Post-Apocalyptic", "Hard Sci-Fi",
      "Soft Sci-Fi", "Time Travel", "Aliens", "Artificial Intelligence", "Military Sci-Fi",
      "Space Western", "Biopunk", "Dieselpunk", "Solarpunk"
    ]
  },
  {
    name: "Thriller & Mystery",
    genres: [
      "Psychological Thriller", "Crime Thriller", "Legal Thriller", "Techno-Thriller",
      "Cozy Mystery", "Noir", "Hardboiled", "Police Procedural", "Espionage",
      "Supernatural Mystery", "Whodunit", "Historical Mystery"
    ]
  },
  {
    name: "Horror",
    genres: [
      "Supernatural Horror", "Psychological Horror", "Slasher", "Body Horror", "Gothic Horror",
      "Cosmic Horror", "Survival Horror", "Zombie Apocalypse", "Ghost Stories", "Occult"
    ]
  },
  {
    name: "Fiction & Literature",
    genres: [
      "Literary Fiction", "Historical Fiction", "Women's Fiction", "Contemporary Fiction",
      "Satire", "Tragedy", "Philosophy", "Religious/Spiritual", "Short Stories", "Flash Fiction"
    ]
  },
  {
    name: "Young Adult (YA)",
    genres: [
      "YA Fantasy", "YA Sci-Fi", "YA Romance", "YA Contemporary", "Coming of Age",
      "School Life", "Teen Drama"
    ]
  },
  {
    name: "Action & Adventure",
    genres: [
      "Action", "Adventure", "Martial Arts", "War/Military", "Spy", "Survival",
      "Treasure Hunt", "Western"
    ]
  },
  {
    name: "Mature & Specialized (18+)",
    genres: [
      "Mature (18+)", "Erotica", "Dark Content", "Smut", "Taboo", "Adult Fiction",
      "Rape", "Suicide", "Self-Harm", "Abuse", "Trauma", "Incest", "Violence", "Gore"
    ]
  },
  {
    name: "Non-Fiction",
    genres: [
      "Memoir", "Biography", "Self-Help", "True Crime", "History", "Science",
      "Travel", "Cooking", "Art", "Poetry"
    ]
  }
];

export const ALL_GENRES = GENRE_CATEGORIES.flatMap(c => c.genres).sort();

export const SENSITIVE_GENRES = [
  "Rape", "Suicide", "Self-Harm", "Abuse", "Trauma", "Incest", "Gore", 
  "Erotica", "Smut", "Taboo", "Mature (18+)", "Dark Content", "Violence"
];

export function isSensitiveGenre(genre: string): boolean {
  return SENSITIVE_GENRES.includes(genre);
}

export function getGenreWarning(genre: string): string | null {
  if (["Rape", "Suicide", "Self-Harm", "Abuse", "Incest"].includes(genre)) {
    return "This content contains sensitive themes that may be disturbing to some readers. Viewer discretion is advised.";
  }
  if (["Erotica", "Smut", "Mature (18+)"].includes(genre)) {
    return "This content is intended for mature audiences only (18+).";
  }
  return null;
}
