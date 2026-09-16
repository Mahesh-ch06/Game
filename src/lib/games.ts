export type GameStatus = "available" | "coming_soon";
export type GameMode = "odd_one_out" | "chameleon" | "mafia" | null;

export type GameInstruction = {
  step: number;
  title: string;
  description: string;
};

export type Game = {
  id: string;
  slug: string;
  title: string;
  genre: string;
  playerCount: string;
  shortDescription: string;
  fullDescription: string;
  status: GameStatus;
  gameMode: GameMode;
  coverImage: string;
  bannerImage: string;
  stats: {
    totalPlayed: number;
    currentlyPlaying: number;
  };
  instructions: GameInstruction[];
  features: string[];
};

export const games: Game[] = [
  {
    id: "odd_one_out",
    slug: "odd-one-out",
    title: "Odd One Out",
    genre: "Social Deduction",
    playerCount: "3–16 Players",
    shortDescription: "Find the imposter among you. Everyone gets the same secret word, except one.",
    fullDescription:
      "Odd One Out is a fast-paced social deduction game where blending in is just as important as finding the truth. At the start of a round, almost everyone in the room receives the exact same Secret Word. However, one randomly chosen player is the Imposter and receives a slightly different, similar word. Take turns giving vague clues to prove you know the word without giving it away to the Imposter!",
    status: "available",
    gameMode: "odd_one_out",
    coverImage: "/games/odd-one-out-cover.jpg",
    bannerImage: "/games/odd-one-out-banner.jpg",
    stats: { totalPlayed: 14850, currentlyPlaying: 142 },
    instructions: [
      {
        step: 1,
        title: "Join a Room",
        description: "The host sets the discussion time and creates a room. Share the 5-letter join code with everyone.",
      },
      {
        step: 2,
        title: "Check Your Word",
        description: "Once the round starts, check your secret card privately to see your word.",
      },
      {
        step: 3,
        title: "Give Clues",
        description: "Take turns giving a one-word or short-phrase clue about your word. Don't be too obvious!",
      },
      {
        step: 4,
        title: "Discuss & Vote",
        description: "Debate who gave the most suspicious clue, then vote for the person you think is the Imposter.",
      },
    ],
    features: [
      "15,000+ unique kid-friendly word pairs",
      "Fair imposter distribution algorithm",
      "Cross-device mobile web play",
      "Zero-repetition guarantee per room",
    ],
  },
  {
    id: "word_chameleon",
    slug: "word-chameleon",
    title: "Word Chameleon",
    genre: "Party / Word Game",
    playerCount: "4–16 Players",
    shortDescription: "The Chameleon doesn't know the word. Can they fake it till they make it?",
    fullDescription:
      "In Word Chameleon, everyone is on the same page—except the Chameleon! While the normal players receive a specific Secret Word, the Chameleon receives absolutely nothing except a vague Category Hint. The Chameleon must listen closely to the other players' clues and blend into the conversation.",
    status: "available",
    gameMode: "chameleon",
    coverImage: "/games/word-chameleon-cover.jpg",
    bannerImage: "/games/word-chameleon-banner.jpg",
    stats: { totalPlayed: 11420, currentlyPlaying: 98 },
    instructions: [
      {
        step: 1,
        title: "Receive Roles",
        description: "Players get the Secret Word. The Chameleon only gets a Category Hint.",
      },
      {
        step: 2,
        title: "Blend In",
        description: "Take turns giving clues. If you are the Chameleon, use the category and other players' clues to fake your way through.",
      },
      {
        step: 3,
        title: "Catch the Reptile",
        description: "Vote on who you think the Chameleon is.",
      },
      {
        step: 4,
        title: "The Final Guess",
        description: "If the Chameleon is caught, they get one final chance to steal the victory by guessing the Secret Word!",
      },
    ],
    features: [
      "The 'Final Guess' victory steal mechanic",
      "14 broad categories for endless replayability",
      "Dynamic scoring system",
      "Perfect for large groups and parties",
    ],
  },
  {
    id: "mafia",
    slug: "mafia",
    title: "Mafia",
    genre: "Social Deduction",
    playerCount: "4–16 Players",
    shortDescription: "A classic game of deception. Find the Mafia before they eliminate the entire town.",
    fullDescription:
      "The town is asleep, but the Mafia is awake. In this classic social deduction party game, players are secretly assigned roles: Mafia, Doctor, Police, or Civilian. During the Night phase, the Mafia secretly eliminates a player, the Doctor protects someone, and the Police investigates. During the Day, the surviving players must discuss, debate, and vote to eliminate who they think the Mafia is. Can the town survive?",
    status: "available",
    gameMode: "mafia",
    coverImage: "/games/mafia-cover.jpg",
    bannerImage: "/games/mafia-banner.jpg",
    stats: { totalPlayed: 9680, currentlyPlaying: 164 },
    instructions: [
      {
        step: 1,
        title: "Check Your Role",
        description: "At the start of the game, check your secret role. Keep it hidden!",
      },
      {
        step: 2,
        title: "Night Phase",
        description: "The Mafia chooses a target to eliminate. The Doctor protects someone. The Police investigates a suspect.",
      },
      {
        step: 3,
        title: "Day Discussion",
        description: "Wake up and find out what happened. Discuss who is acting suspiciously.",
      },
      {
        step: 4,
        title: "Vote",
        description: "Vote to eliminate the most suspicious player. The game ends when the Mafia is eliminated, or when the Mafia outnumbers the Town.",
      },
    ],
    features: [
      "Dynamic role assignment algorithm",
      "Private night action UI",
      "Secure server-side state",
      "Pass & Play support for single devices",
    ],
  },
  {
    id: "spy_words",
    slug: "spy-words",
    title: "Spy Words",
    genre: "Team Strategy",
    playerCount: "4–20 Players",
    shortDescription: "Two rival spy networks race to contact all their agents first.",
    fullDescription:
      "A game of word association and strategy. Spymasters must give one-word clues that point to multiple words on the board, trying to guide their team to their agents while avoiding the assassin.",
    status: "coming_soon",
    gameMode: null,
    coverImage: "/games/spy-words-cover.jpg",
    bannerImage: "/games/spy-words-banner.jpg",
    stats: { totalPlayed: 4120, currentlyPlaying: 45 },
    instructions: [],
    features: [],
  },
  {
    id: "blank_slate",
    slug: "blank-slate",
    title: "Blank Slate",
    genre: "Casual / Mind-Reading",
    playerCount: "3–10 Players",
    shortDescription: "Try to match your answer with exactly one other person.",
    fullDescription:
      "A word-matching party game where you try to predict what others are thinking. Write down a word that completes the phrase and score points if you match with exactly one other player!",
    status: "coming_soon",
    gameMode: null,
    coverImage: "/games/blank-slate-cover.jpg",
    bannerImage: "/games/blank-slate-banner.jpg",
    stats: { totalPlayed: 3890, currentlyPlaying: 28 },
    instructions: [],
    features: [],
  },
];

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

export function getGameById(id: string): Game | undefined {
  return games.find((g) => g.id === id);
}
