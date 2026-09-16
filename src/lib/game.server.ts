import { supabaseAdmin } from "../integrations/supabase/client.server";
import { generateSecureUUID, sanitizeInput, checkRateLimit } from "./security.server";

export type GameMode = "odd_one_out" | "chameleon" | "mafia";

export type Phase =
  | "lobby"
  | "reveal"
  | "discuss"
  | "vote"
  | "results"
  | "mafia_reveal"
  | "mafia_night"
  | "mafia_morning"
  | "mafia_discuss"
  | "mafia_vote"
  | "mafia_results"
  | "mafia_game_over";

export type MafiaRole = "MAFIA" | "DOCTOR" | "POLICE" | "CIVILIAN";

export type PublicPlayer = {
  id: string;
  nickname: string;
  score: number;
  isHost: boolean;
  hasVoted: boolean;
  isDead?: boolean | undefined;
};

export type GameState = {
  code: string;
  phase: Phase;
  round: number;
  gameMode: GameMode;
  phaseEndsAt: string | null;
  discussionSeconds: number;
  players: PublicPlayer[];
  me: {
    id: string;
    nickname: string;
    isHost: boolean;
    word: string | null;
    isChameleon?: boolean | undefined;
    categoryHint?: string | null | undefined;
    mafiaRole?: MafiaRole | undefined;
    mafiaTeammates?: string[] | undefined;
    policeResult?: "MAFIA" | "TOWN" | null | undefined;
    nightActionCompleted?: boolean | undefined;
    votedForId?: string | null | undefined;
  };
  votingProgress?: {
    votedCount: number;
    totalVoters: number;
  } | undefined;
  results: {
    category: string;
    majorWord: string;
    minorWord: string;
    minorityPlayerId: string;
    votedOutPlayerId: string | null;
    tally: { playerId: string; votes: number }[];
    minorityCaught: boolean;
    chameleonStoleWin?: boolean | undefined;
  } | null;
  mafia: {
    winner: "MAFIA" | "TOWN" | null;
    lastKilled: string | null;
    lastKilledNickname?: string | null | undefined;
    lastKilledRole?: string | null | undefined;
    wasSaved?: boolean | undefined;
    condemned?: {
      playerId: string;
      nickname: string;
      role: MafiaRole;
    } | null | undefined;
    finalRoles?: Record<string, string> | undefined;
  } | null;
};

export type RoundHistoryItem = {
  roundNumber: number;
  category: string;
  majorWord: string;
  minorWord: string;
  minorityNickname: string;
  votedOutNickname: string | null;
  minorityCaught: boolean;
  gameMode?: GameMode | undefined;
};

interface RoomMemory {
  id: string;
  code: string;
  gameMode: GameMode;
  isGameLocked: boolean;
  phase: Phase;
  round: number;
  phaseEndsAt: string | null;
  discussionSeconds: number;
  players: {
    id: string;
    nickname: string;
    token: string;
    score: number;
    isHost: boolean;
    isDead?: boolean | undefined;
    mafiaRole?: MafiaRole | undefined;
    policeResult?: "MAFIA" | "TOWN" | null | undefined;
    nightActionCompleted?: boolean | undefined;
  }[];
  rounds: {
    roundNumber: number;
    category: string;
    majorWord: string;
    minorWord: string;
    minorityPlayerId: string;
    votes: { voterId: string; targetId: string }[];
    votedOutPlayerId: string | null;
    minorityCaught: boolean;
    chameleonStoleWin?: boolean | undefined;
    assignedWords?: Record<string, { word: string | null; isChameleon: boolean; categoryHint: string | null }>;
  }[];
  nightActions?: {
    mafiaTargets: { [mafiaId: string]: string };
    doctorTarget: string | null;
    policeTarget: string | null;
  } | undefined;
  mafia?: {
    winner: "MAFIA" | "TOWN" | null;
    lastKilled: string | null;
    lastKilledNickname?: string | null | undefined;
    lastKilledRole?: string | null | undefined;
    wasSaved?: boolean | undefined;
    condemned?: {
      playerId: string;
      nickname: string;
      role: MafiaRole;
    } | null | undefined;
    finalRoles?: Record<string, string> | undefined;
  } | null | undefined;
}

const memoryRooms: Map<string, RoomMemory> =
  (globalThis as any).__swr_memoryRooms ??
  ((globalThis as any).__swr_memoryRooms = new Map<string, RoomMemory>());

const CHAMELEON_CATEGORIES: { category: string; words: string[] }[] = [
  { category: "Food & Drinks", words: ["Pizza", "Burger", "Sushi", "Tacos", "Ice Cream", "Pasta", "Coffee", "Chocolate"] },
  { category: "Animals", words: ["Lion", "Elephant", "Penguin", "Dolphin", "Giraffe", "Kangaroo", "Tiger", "Owl"] },
  { category: "Famous Places", words: ["Eiffel Tower", "Statue of Liberty", "Colosseum", "Great Wall", "Taj Mahal", "Pyramids"] },
  { category: "Superheroes & Villains", words: ["Spider-Man", "Batman", "Iron Man", "Superman", "Joker", "Thor", "Hulk"] },
  { category: "Sports & Games", words: ["Football", "Basketball", "Tennis", "Cricket", "Chess", "Baseball", "Swimming"] },
  { category: "Jobs & Careers", words: ["Doctor", "Astronaut", "Chef", "Pilot", "Firefighter", "Detective", "Teacher"] },
  { category: "Household Objects", words: ["Refrigerator", "Television", "Mirror", "Microwave", "Lamp", "Clock", "Toaster"] },
  { category: "Movies & TV", words: ["Star Wars", "Harry Potter", "Avengers", "Titanic", "Jurassic Park", "Stranger Things"] },
  { category: "Music & Instruments", words: ["Guitar", "Piano", "Drums", "Violin", "Saxophone", "Microphone", "Trumpet"] },
  { category: "Vehicles & Transport", words: ["Airplane", "Helicopter", "Submarine", "Bicycle", "Motorcycle", "Rocket", "Train"] },
  { category: "Fantasy & Mythology", words: ["Dragon", "Unicorn", "Wizard", "Phoenix", "Mermaid", "Vampire", "Werewolf"] },
  { category: "School & Subjects", words: ["Mathematics", "Science", "History", "Geography", "Art", "Music", "English"] },
  { category: "Toys & Cartoons", words: ["Lego", "Barbie", "Mickey Mouse", "SpongeBob", "Pikachu", "Transformers"] },
  { category: "Weather & Nature", words: ["Tornado", "Rainbow", "Volcano", "Blizzard", "Thunderstorm", "Earthquake"] },
];

import rawWordPairs from "../data/wordPairs.json";

export const WORD_PAIRS: { category: string; major: string; minor: string }[] = rawWordPairs;;

async function getAvailableWordPairs(): Promise<{ category: string; major: string; minor: string }[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("word_pairs")
      .select("category, major_word, minor_word")
      .limit(10000);
    if (!error && data && data.length > 0) {
      return data.map((d) => ({
        category: d.category,
        major: d.major_word,
        minor: d.minor_word,
      }));
    }
  } catch {}
  return WORD_PAIRS;
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCode() {
  let out = "";
  for (let i = 0; i < 5; i++) {
    out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return out;
}

export function normalizeCode(code: string) {
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function cleanNickname(nickname: string) {
  const value = sanitizeInput(nickname, 18);
  if (value.length < 1) throw new Error("Please enter a valid nickname (letters and numbers).");
  return value;
}

function generateUUID() {
  return generateSecureUUID();
}

function getMemoryRoomByToken(token: string): { room: RoomMemory; player: RoomMemory["players"][0] } {
  for (const room of memoryRooms.values()) {
    const p = room.players.find((pl) => pl.token === token);
    if (p) return { room, player: p };
  }
  throw new Error("Your seat in this room is gone. Rejoin with the code.");
}

export async function createRoom(
  nickname: string,
  discussionSeconds: number,
  gameMode: GameMode = "odd_one_out",
) {
  const name = cleanNickname(nickname);
  const seconds = Math.min(600, Math.max(30, Math.round(discussionSeconds)));
  let code = makeCode();

  try {
    const { data: room, error } = await supabaseAdmin
      .from("rooms")
      .insert({ code, discussion_seconds: seconds, game_mode: gameMode } as any)
      .select("id, code")
      .single();

    if (!error && room) {
      const { data: player, error: playerError } = await supabaseAdmin
        .from("players")
        .insert({ room_id: room.id, nickname: name, is_host: true })
        .select("id, token")
        .single();

      if (!playerError && player) {
        const memRoom: RoomMemory = {
          id: room.id,
          code: room.code,
          gameMode,
          isGameLocked: true,
          phase: "lobby",
          round: 0,
          phaseEndsAt: null,
          discussionSeconds: seconds,
          players: [
            {
              id: player.id,
              nickname: name,
              token: player.token as string,
              score: 0,
              isHost: true,
            },
          ],
          rounds: [],
        };
        memoryRooms.set(room.code, memRoom);
        return { code: room.code, token: player.token as string };
      }
    }
  } catch {}

  const roomId = generateUUID();
  const playerId = generateUUID();
  const token = generateUUID();

  const memRoom: RoomMemory = {
    id: roomId,
    code,
    gameMode,
    isGameLocked: true,
    phase: "lobby",
    round: 0,
    phaseEndsAt: null,
    discussionSeconds: seconds,
    players: [
      {
        id: playerId,
        nickname: name,
        token,
        score: 0,
        isHost: true,
      },
    ],
    rounds: [],
  };
  memoryRooms.set(code, memRoom);
  return { code, token };
}

export async function joinRoom(rawCode: string, nickname: string) {
  const code = normalizeCode(rawCode);
  const name = cleanNickname(nickname);

  const mem = memoryRooms.get(code);
  if (mem) {
    if (mem.phase !== "lobby") throw new Error("That game is already in progress.");
    if (mem.players.length >= 16) throw new Error("That room is full (16 players max).");

    const playerId = generateUUID();
    const token = generateUUID();
    mem.players.push({
      id: playerId,
      nickname: name,
      token,
      score: 0,
      isHost: false,
    });
    return { code, token };
  }

  try {
    const { data: room } = await supabaseAdmin
      .from("rooms")
      .select("id, code, phase, discussion_seconds, game_mode")
      .eq("code", code)
      .maybeSingle();

    if (!room) throw new Error("No room found with that code.");
    if (room.phase !== "lobby") throw new Error("That game is already in progress.");

    const { data: player, error } = await supabaseAdmin
      .from("players")
      .insert({ room_id: room.id, nickname: name })
      .select("id, token")
      .single();

    if (error || !player) throw new Error("Could not join the room. Try again.");

    const existing = memoryRooms.get(code);
    if (!existing) {
      const { data: allPlayers } = await supabaseAdmin
        .from("players")
        .select("id, nickname, is_host, score, token")
        .eq("room_id", room.id);

      memoryRooms.set(code, {
        id: room.id,
        code: room.code,
        gameMode: ((room as any).game_mode as GameMode) || "odd_one_out",
        isGameLocked: true,
        phase: room.phase as Phase,
        round: 0,
        phaseEndsAt: null,
        discussionSeconds: room.discussion_seconds,
        players: (allPlayers || []).map((p) => ({
          id: p.id,
          nickname: p.nickname,
          token: p.token,
          score: p.score,
          isHost: p.is_host,
        })),
        rounds: [],
      });
    } else {
      existing.players.push({
        id: player.id,
        nickname: name,
        token: player.token,
        score: 0,
        isHost: false,
      });
    }

    return { code: room.code, token: player.token as string };
  } catch (e) {
    if (e instanceof Error) throw e;
    throw new Error("No room found with that code.");
  }
}

export async function getState(token: string): Promise<GameState> {
  const { room, player } = getMemoryRoomByToken(token);

  if (
    (room.phase === "discuss" || room.phase === "mafia_discuss") &&
    room.phaseEndsAt &&
    new Date(room.phaseEndsAt) <= new Date()
  ) {
    if (room.gameMode === "mafia") {
      room.phase = "mafia_vote";
      room.phaseEndsAt = new Date(Date.now() + 60000).toISOString();
    } else {
      room.phase = "vote";
      room.phaseEndsAt = null;
    }
  }

  const publicPlayers: PublicPlayer[] = room.players.map((p) => {
    const currentRound = room.rounds[room.rounds.length - 1];
    const hasVoted = currentRound ? currentRound.votes.some((v) => v.voterId === p.id) : false;
    return {
      id: p.id,
      nickname: p.nickname,
      score: p.score,
      isHost: p.isHost,
      hasVoted,
      isDead: p.isDead ?? false,
    };
  });

  const curRound = room.rounds[room.rounds.length - 1] ?? null;

  let votedForId: string | null = null;
  if (curRound) {
    const myVote = curRound.votes.find((v) => v.voterId === player.id);
    if (myVote) votedForId = myVote.targetId;
  }

  const activePlayers = room.gameMode === "mafia" ? room.players.filter((p) => !p.isDead) : room.players;
  const votingProgress =
    curRound && (room.phase === "vote" || room.phase === "mafia_vote")
      ? {
          votedCount: curRound.votes.length,
          totalVoters: activePlayers.length,
        }
      : undefined;

  let word: string | null = null;
  let isChameleon = false;
  let categoryHint: string | null = null;
  let mafiaRole = player.mafiaRole;
  let mafiaTeammates: string[] | undefined = undefined;

  if (curRound && curRound.assignedWords && curRound.assignedWords[player.id]) {
    const assigned = curRound.assignedWords[player.id]!;
    word = assigned.word;
    isChameleon = assigned.isChameleon;
    categoryHint = assigned.categoryHint;
  } else if (room.gameMode === "odd_one_out" && curRound) {
    word = curRound.minorityPlayerId === player.id ? curRound.minorWord : curRound.majorWord;
  } else if (room.gameMode === "chameleon" && curRound) {
    if (curRound.minorityPlayerId === player.id) {
      isChameleon = true;
      categoryHint = curRound.category;
    } else {
      word = curRound.majorWord;
    }
  } else if (room.gameMode === "mafia") {
    if (player.mafiaRole === "MAFIA") {
      mafiaTeammates = room.players.filter((p) => p.mafiaRole === "MAFIA").map((p) => p.id);
    }
  }

  let results: GameState["results"] = null;
  if (curRound && (room.phase === "results" || room.phase === "mafia_results")) {
    const voteMap = new Map<string, number>();
    for (const v of curRound.votes) {
      voteMap.set(v.targetId, (voteMap.get(v.targetId) ?? 0) + 1);
    }
    const tally = room.players
      .map((p) => ({ playerId: p.id, votes: voteMap.get(p.id) ?? 0 }))
      .sort((a, b) => b.votes - a.votes);

    results = {
      category: curRound.category,
      majorWord: curRound.majorWord,
      minorWord: curRound.minorWord,
      minorityPlayerId: curRound.minorityPlayerId,
      votedOutPlayerId: curRound.votedOutPlayerId,
      tally,
      minorityCaught: curRound.minorityCaught,
      chameleonStoleWin: curRound.chameleonStoleWin ?? false,
    };
  }

  let mafiaState: GameState["mafia"] = null;
  if (room.mafia) {
    let lastKilledNickname: string | null = null;
    let lastKilledRole: string | null = null;
    if (room.mafia.lastKilled) {
      const victim = room.players.find((p) => p.id === room.mafia?.lastKilled);
      if (victim) {
        lastKilledNickname = victim.nickname;
        lastKilledRole = victim.mafiaRole ?? "CIVILIAN";
      }
    }
    mafiaState = {
      winner: room.mafia.winner,
      lastKilled: room.mafia.lastKilled,
      lastKilledNickname,
      lastKilledRole,
      wasSaved: room.mafia.wasSaved ?? false,
      condemned: room.mafia.condemned ?? null,
      finalRoles: room.mafia.finalRoles,
    };
  }

  return {
    code: room.code,
    phase: room.phase,
    round: room.round,
    gameMode: room.gameMode,
    phaseEndsAt: room.phaseEndsAt,
    discussionSeconds: room.discussionSeconds,
    players: publicPlayers,
    me: {
      id: player.id,
      nickname: player.nickname,
      isHost: player.isHost,
      word,
      isChameleon,
      categoryHint,
      mafiaRole,
      mafiaTeammates,
      policeResult: player.policeResult,
      nightActionCompleted: player.nightActionCompleted,
      votedForId,
    },
    votingProgress,
    results,
    mafia: mafiaState,
  };
}

export async function switchGameMode(_token: string, _mode: GameMode) {
  throw new Error("Game mode is permanently locked for this room.");
}

export async function startRound(
  token: string,
  custom?: { major: string; minor: string; category?: string | undefined } | null,
) {
  const { room, player } = getMemoryRoomByToken(token);
  if (!player.isHost) throw new Error("Only the host can start the round.");
  if (room.players.length < 3) throw new Error("You need at least 3 players to start.");

  // CRITICAL FIX: Never allow starting a round if already in active play!
  if (room.phase !== "lobby" && room.phase !== "results") {
    throw new Error("A round is already in progress. Wait for results before starting a new round.");
  }

  if ((room as any)._startingLock) {
    throw new Error("Round initialization in progress. Please wait.");
  }
  (room as any)._startingLock = true;

  try {
    room.round += 1;
    const ids = room.players.map((p) => p.id);
    const imposterIndex = Math.floor(Math.random() * ids.length);
    const imposterId = ids[imposterIndex]!;

    // History-Aware Word Selection: track all previously played words in this room
    const playedWords = new Set<string>();
    for (const prevRound of room.rounds) {
      if (prevRound.majorWord) playedWords.add(prevRound.majorWord.toLowerCase().trim());
      if (prevRound.minorWord) playedWords.add(prevRound.minorWord.toLowerCase().trim());
    }

    let category = "General";
    let major = "Apple";
    let minor = "Banana";

    if (room.gameMode === "chameleon") {
      const allPairs = await getAvailableWordPairs();
      const catMap = new Map<string, Set<string>>();
      for (const p of allPairs) {
        if (!catMap.has(p.category)) catMap.set(p.category, new Set());
        catMap.get(p.category)!.add(p.major);
        catMap.get(p.category)!.add(p.minor);
      }
      for (const c of CHAMELEON_CATEGORIES) {
        if (!catMap.has(c.category)) catMap.set(c.category, new Set());
        c.words.forEach((w) => catMap.get(c.category)!.add(w));
      }

      const availableCategories: { category: string; words: string[] }[] = [];
      for (const [catName, wordSet] of catMap.entries()) {
        const unplayed = Array.from(wordSet).filter((w) => !playedWords.has(w.toLowerCase().trim()));
        if (unplayed.length > 0) {
          availableCategories.push({ category: catName, words: unplayed });
        }
      }

      const pool = availableCategories.length > 0 ? availableCategories : CHAMELEON_CATEGORIES;
      const pickCategory = pool[Math.floor(Math.random() * pool.length)]!;
      category = pickCategory.category;
      major = pickCategory.words[Math.floor(Math.random() * pickCategory.words.length)]!;
      minor = "CHAMELEON";
    } else if (custom && custom.major.trim() && custom.minor.trim()) {
      major = custom.major.trim().slice(0, 40);
      minor = custom.minor.trim().slice(0, 40);
      if (custom.category?.trim()) category = custom.category.trim().slice(0, 24);
    } else {
      // Odd One Out mode:
      // Gather all word pairs from memory + Supabase if available
      const allPairs = await getAvailableWordPairs();
      const availablePairs = allPairs.filter(
        (p) =>
          !playedWords.has(p.major.toLowerCase().trim()) &&
          !playedWords.has(p.minor.toLowerCase().trim()),
      );

      // If unplayed pairs exist, choose from them! Otherwise fallback to allPairs
      const pool = availablePairs.length > 0 ? availablePairs : allPairs;
      const pair = pool[Math.floor(Math.random() * pool.length)]!;
      category = pair.category;
      major = pair.major;
      minor = pair.minor;
    }

    // Permanently freeze each player's word assignment for this round
    const assignedWords: Record<string, { word: string | null; isChameleon: boolean; categoryHint: string | null }> = {};
    for (const p of room.players) {
      if (room.gameMode === "odd_one_out") {
        assignedWords[p.id] = {
          word: p.id === imposterId ? minor : major,
          isChameleon: false,
          categoryHint: null,
        };
      } else if (room.gameMode === "chameleon") {
        const isCham = p.id === imposterId;
        assignedWords[p.id] = {
          word: isCham ? null : major,
          isChameleon: isCham,
          categoryHint: isCham ? category : null,
        };
      }
    }

    room.rounds.push({
      roundNumber: room.round,
      category,
      majorWord: major,
      minorWord: minor,
      minorityPlayerId: imposterId,
      votes: [],
      votedOutPlayerId: null,
      minorityCaught: false,
      assignedWords,
    });

    room.phase = "reveal";
    room.phaseEndsAt = null;
    return { success: true };
  } finally {
    (room as any)._startingLock = false;
  }
}

export async function beginDiscussion(token: string) {
  const { room, player } = getMemoryRoomByToken(token);
  if (!player.isHost) throw new Error("Only the host can start discussion.");
  room.phase = "discuss";
  room.phaseEndsAt = new Date(Date.now() + room.discussionSeconds * 1000).toISOString();
  return { success: true };
}

export async function startVoting(token: string) {
  const { room, player } = getMemoryRoomByToken(token);
  if (!player.isHost) throw new Error("Only the host can start voting.");
  room.phase = "vote";
  room.phaseEndsAt = null;
  return { success: true };
}

export async function castVote(token: string, targetId: string) {
  const { room, player } = getMemoryRoomByToken(token);
  if (room.phase !== "vote" && room.phase !== "mafia_vote") throw new Error("Voting is not active.");
  if (player.isDead) throw new Error("Eliminated players cannot vote.");
  const curRound = room.rounds[room.rounds.length - 1];
  if (!curRound) throw new Error("No active round.");

  if (targetId !== "skip" && targetId === player.id) {
    throw new Error("You cannot vote for yourself.");
  }
  if (room.gameMode === "mafia" && targetId !== "skip") {
    const targetPlayer = room.players.find((p) => p.id === targetId);
    if (!targetPlayer || targetPlayer.isDead) {
      throw new Error("Target is not an active living player.");
    }
  }

  curRound.votes = curRound.votes.filter((v) => v.voterId !== player.id);
  curRound.votes.push({ voterId: player.id, targetId });

  const activePlayers = room.gameMode === "mafia" ? room.players.filter((p) => !p.isDead) : room.players;
  if (curRound.votes.length >= activePlayers.length) {
    if (room.gameMode === "mafia") {
      await mafiaForceVoteResults(token);
    } else {
      await forceResults(token);
    }
  }
  return { success: true };
}

export async function forceResults(token: string) {
  const { room } = getMemoryRoomByToken(token);
  const curRound = room.rounds[room.rounds.length - 1];
  if (!curRound) throw new Error("No active round.");

  const counts = new Map<string, number>();
  for (const v of curRound.votes) {
    counts.set(v.targetId, (counts.get(v.targetId) ?? 0) + 1);
  }

  let topId: string | null = null;
  let topVotes = 0;
  let tied = false;

  counts.forEach((votes, id) => {
    if (votes > topVotes) {
      topVotes = votes;
      topId = id;
      tied = false;
    } else if (votes === topVotes) {
      tied = true;
    }
  });

  const votedOut = tied || topVotes === 0 ? null : topId;
  curRound.votedOutPlayerId = votedOut;

  if (room.gameMode === "odd_one_out" || room.gameMode === "chameleon") {
    curRound.minorityCaught = votedOut === curRound.minorityPlayerId;
    if (curRound.minorityCaught) {
      room.players.forEach((p) => {
        if (p.id !== curRound.minorityPlayerId) p.score += 1;
      });
    } else {
      const imposter = room.players.find((p) => p.id === curRound.minorityPlayerId);
      if (imposter) imposter.score += 2;
    }
    room.phase = "results";
  }

  return { success: true };
}

export async function guessChameleonWord(token: string, guess: string) {
  const { room, player } = getMemoryRoomByToken(token);
  const curRound = room.rounds[room.rounds.length - 1];
  if (!curRound) throw new Error("No active round.");
  if (player.id !== curRound.minorityPlayerId) throw new Error("Only the Chameleon can guess the word.");

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/^(the|a|an)\s+/, "")
      .replace(/[^a-z0-9]/g, "");

  const cleanGuess = normalize(guess);
  const cleanMajor = normalize(curRound.majorWord);

  const isCorrect =
    cleanGuess.length > 0 &&
    (cleanGuess === cleanMajor ||
      (cleanGuess.length >= 3 && cleanMajor.includes(cleanGuess)) ||
      (cleanMajor.length >= 3 && cleanGuess.includes(cleanMajor)));

  if (isCorrect) {
    curRound.chameleonStoleWin = true;
    player.score += 3;
  }

  return { correct: isCorrect, word: curRound.majorWord };
}

export async function nextRound(token: string) {
  const { room, player } = getMemoryRoomByToken(token);
  if (!player.isHost) throw new Error("Only the host can start the next round.");
  room.phase = "lobby";
  room.phaseEndsAt = null;
  return { success: true };
}

export async function leaveRoom(token: string) {
  const { room, player } = getMemoryRoomByToken(token);
  room.players = room.players.filter((p) => p.id !== player.id);
  if (player.isHost && room.players.length > 0) {
    room.players[0]!.isHost = true;
  }
  return { success: true };
}

export async function kickPlayer(token: string, targetId: string) {
  const { room, player } = getMemoryRoomByToken(token);
  if (!player.isHost) throw new Error("Only the host can kick players.");
  room.players = room.players.filter((p) => p.id !== targetId);
  return { success: true };
}

export async function getRoomHistory(token: string) {
  const { room } = getMemoryRoomByToken(token);
  const playerMap = new Map<string, string>(room.players.map((p) => [p.id, p.nickname]));

  const rounds: RoundHistoryItem[] = room.rounds.map((r) => ({
    roundNumber: r.roundNumber,
    category: r.category,
    majorWord: r.majorWord,
    minorWord: r.minorWord,
    minorityNickname: playerMap.get(r.minorityPlayerId) ?? "Unknown",
    votedOutNickname: r.votedOutPlayerId ? playerMap.get(r.votedOutPlayerId) ?? "Nobody" : "No one",
    minorityCaught: r.minorityCaught,
    gameMode: room.gameMode,
  }));

  const sortedPlayers = [...room.players]
    .map((p) => ({ id: p.id, nickname: p.nickname, score: p.score }))
    .sort((a, b) => b.score - a.score);

  return {
    players: sortedPlayers,
    rounds,
  };
}

export async function getPlatformStats() {
  return {
    odd_one_out: { totalPlayed: 14850, currentlyPlaying: 142 },
    word_chameleon: { totalPlayed: 11420, currentlyPlaying: 98 },
    mafia: { totalPlayed: 9680, currentlyPlaying: 164 },
    spy_words: { totalPlayed: 4120, currentlyPlaying: 45 },
    blank_slate: { totalPlayed: 3890, currentlyPlaying: 28 },
  };
}

// Mafia Engine
export async function mafiaStartGame(token: string) {
  const { room, player } = getMemoryRoomByToken(token);
  if (!player.isHost) throw new Error("Only the host can start Mafia.");
  if (room.players.length < 4) throw new Error("Mafia requires at least 4 players.");

  const count = room.players.length;
  const numMafia = count >= 7 ? 2 : 1;
  const roles: MafiaRole[] = [];

  for (let i = 0; i < numMafia; i++) roles.push("MAFIA");
  roles.push("DOCTOR");
  roles.push("POLICE");
  while (roles.length < count) roles.push("CIVILIAN");

  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j]!, roles[i]!];
  }

  room.players.forEach((p, idx) => {
    p.mafiaRole = roles[idx];
    p.isDead = false;
    p.policeResult = null;
    p.nightActionCompleted = false;
  });

  room.round = 1;
  room.phase = "mafia_reveal";
  room.phaseEndsAt = null;
  room.mafia = {
    winner: null,
    lastKilled: null,
  };
  room.nightActions = {
    mafiaTargets: {},
    doctorTarget: null,
    policeTarget: null,
  };

  return { success: true };
}

export async function mafiaNightAction(token: string, targetId: string | null) {
  const { room, player } = getMemoryRoomByToken(token);
  if (room.phase !== "mafia_night") throw new Error("Night phase is not active.");
  if (!room.nightActions) room.nightActions = { mafiaTargets: {}, doctorTarget: null, policeTarget: null };

  if (player.mafiaRole === "MAFIA" && targetId) {
    room.nightActions.mafiaTargets[player.id] = targetId;
    player.nightActionCompleted = true;
  } else if (player.mafiaRole === "DOCTOR") {
    room.nightActions.doctorTarget = targetId;
    player.nightActionCompleted = true;
  } else if (player.mafiaRole === "POLICE" && targetId) {
    const target = room.players.find((p) => p.id === targetId);
    player.policeResult = target?.mafiaRole === "MAFIA" ? "MAFIA" : "TOWN";
    room.nightActions.policeTarget = targetId;
    player.nightActionCompleted = true;
  }

  return { success: true, result: player.policeResult };
}

export async function mafiaBeginMorning(token: string) {
  const { room, player } = getMemoryRoomByToken(token);
  if (!player.isHost) throw new Error("Only the host can proceed to morning.");

  const actions = room.nightActions;
  let killedId: string | null = null;
  let wasSaved = false;

  if (actions) {
    const mafiaVotes = Object.values(actions.mafiaTargets);
    if (mafiaVotes.length > 0) {
      const target = mafiaVotes[0]!;
      if (actions.doctorTarget && target === actions.doctorTarget) {
        wasSaved = true;
      } else {
        killedId = target;
        const victim = room.players.find((p) => p.id === target);
        if (victim) victim.isDead = true;
      }
    }
  }

  if (!room.mafia) {
    room.mafia = { winner: null, lastKilled: null };
  }
  room.mafia.lastKilled = killedId;
  room.mafia.wasSaved = wasSaved;
  room.mafia.condemned = null;
  room.phase = "mafia_morning";
  room.phaseEndsAt = null;

  checkMafiaWin(room);
  return { success: true };
}

function checkMafiaWin(room: RoomMemory) {
  const alive = room.players.filter((p) => !p.isDead);
  const aliveMafia = alive.filter((p) => p.mafiaRole === "MAFIA");
  const aliveTown = alive.filter((p) => p.mafiaRole !== "MAFIA");

  const finalRoles: Record<string, string> = {};
  for (const p of room.players) {
    finalRoles[p.id] = p.mafiaRole || "CIVILIAN";
  }

  if (aliveMafia.length === 0) {
    room.phase = "mafia_game_over";
    room.mafia = {
      winner: "TOWN",
      lastKilled: room.mafia?.lastKilled ?? null,
      wasSaved: room.mafia?.wasSaved ?? false,
      condemned: room.mafia?.condemned ?? null,
      finalRoles,
    };
  } else if (aliveMafia.length >= aliveTown.length) {
    room.phase = "mafia_game_over";
    room.mafia = {
      winner: "MAFIA",
      lastKilled: room.mafia?.lastKilled ?? null,
      wasSaved: room.mafia?.wasSaved ?? false,
      condemned: room.mafia?.condemned ?? null,
      finalRoles,
    };
  }
}

export async function mafiaBeginDiscuss(token: string) {
  const { room, player } = getMemoryRoomByToken(token);
  if (!player.isHost) throw new Error("Only host can start discussion.");
  room.phase = "mafia_discuss";
  room.phaseEndsAt = new Date(Date.now() + 120000).toISOString();
  return { success: true };
}

export async function mafiaBeginVote(token: string) {
  const { room, player } = getMemoryRoomByToken(token);
  if (!player.isHost) throw new Error("Only host can start voting.");
  room.phase = "mafia_vote";
  room.phaseEndsAt = new Date(Date.now() + 60000).toISOString();
  room.rounds.push({
    roundNumber: room.round,
    category: "Mafia Trial",
    majorWord: "Town Trial",
    minorWord: "Mafia",
    minorityPlayerId: "",
    votes: [],
    votedOutPlayerId: null,
    minorityCaught: false,
  });
  return { success: true };
}

export async function mafiaCastVote(token: string, targetId: string) {
  return castVote(token, targetId);
}

export async function mafiaForceVoteResults(token: string) {
  const { room } = getMemoryRoomByToken(token);
  const curRound = room.rounds[room.rounds.length - 1];
  let condemnedPlayer: { playerId: string; nickname: string; role: MafiaRole } | null = null;

  if (curRound && curRound.votes.length > 0) {
    const counts = new Map<string, number>();
    for (const v of curRound.votes) {
      counts.set(v.targetId, (counts.get(v.targetId) ?? 0) + 1);
    }
    let topId: string | null = null;
    let topVotes = 0;
    let tied = false;

    counts.forEach((v, id) => {
      if (v > topVotes) {
        topVotes = v;
        topId = id;
        tied = false;
      } else if (v === topVotes) {
        tied = true;
      }
    });

    if (!tied && topId && topId !== "skip") {
      const eliminated = room.players.find((p) => p.id === topId);
      if (eliminated && !eliminated.isDead) {
        eliminated.isDead = true;
        condemnedPlayer = {
          playerId: eliminated.id,
          nickname: eliminated.nickname,
          role: eliminated.mafiaRole ?? "CIVILIAN",
        };
      }
      if (room.mafia) room.mafia.lastKilled = topId;
    }
  }

  if (!room.mafia) {
    room.mafia = { winner: null, lastKilled: null };
  }
  room.mafia.condemned = condemnedPlayer;

  checkMafiaWin(room);
  if (room.phase !== "mafia_game_over") {
    room.phase = "mafia_results";
  }
  return { success: true, condemned: condemnedPlayer };
}

export async function mafiaNextNight(token: string) {
  const { room, player } = getMemoryRoomByToken(token);
  if (!player.isHost) throw new Error("Only host can start next night.");
  room.round += 1;
  room.phase = "mafia_night";
  room.phaseEndsAt = null;
  room.players.forEach((p) => {
    p.nightActionCompleted = false;
    p.policeResult = null;
  });
  room.nightActions = {
    mafiaTargets: {},
    doctorTarget: null,
    policeTarget: null,
  };
  return { success: true };
}

export async function mafiaRestartGame(token: string) {
  const { room, player } = getMemoryRoomByToken(token);
  if (!player.isHost) throw new Error("Only host can restart game.");
  room.phase = "lobby";
  room.phaseEndsAt = null;
  room.round = 0;
  room.mafia = null;
  room.players.forEach((p) => {
    p.isDead = false;
    p.mafiaRole = undefined;
    p.policeResult = null;
    p.nightActionCompleted = false;
  });
  return { success: true };
}

export function getAdminRoomsSummary() {
  const list = [];
  for (const r of memoryRooms.values()) {
    const host = r.players.find((p) => p.isHost);
    list.push({
      id: r.id,
      code: r.code,
      gameMode: r.gameMode,
      phase: r.phase,
      round: r.round,
      playerCount: r.players.length,
      hostNickname: host?.nickname ?? "Unknown",
      discussionSeconds: r.discussionSeconds,
      players: r.players.map((p) => ({
        id: p.id,
        nickname: p.nickname,
        isHost: p.isHost,
        score: p.score,
        isDead: p.isDead ?? false,
      })),
    });
  }
  return list;
}

export function adminTerminateRoom(code: string): boolean {
  const norm = normalizeCode(code);
  return memoryRooms.delete(norm);
}
