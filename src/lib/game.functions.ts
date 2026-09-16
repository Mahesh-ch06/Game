import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const tokenSchema = z.object({ token: z.string().uuid() });

export const createRoomFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        nickname: z.string().min(1).max(40),
        discussionSeconds: z.number().int(),
        gameMode: z.enum(["odd_one_out", "chameleon", "mafia"]).optional().default("odd_one_out"),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { createRoom } = await import("./game.server");
    return createRoom(data.nickname, data.discussionSeconds, data.gameMode);
  });

export const joinRoomFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ code: z.string().min(3).max(12), nickname: z.string().min(1).max(40) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { joinRoom } = await import("./game.server");
    return joinRoom(data.code, data.nickname);
  });

export const getStateFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { getState } = await import("./game.server");
    return getState(data.token);
  });

export const startRoundFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        token: z.string().uuid(),
        custom: z
          .object({
            major: z.string().max(60),
            minor: z.string().max(60),
            category: z.string().max(40).optional(),
          })
          .nullable()
          .optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { startRound } = await import("./game.server");
    return startRound(data.token, data.custom ?? null);
  });

export const beginDiscussionFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { beginDiscussion } = await import("./game.server");
    return beginDiscussion(data.token);
  });

export const startVotingFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { startVoting } = await import("./game.server");
    return startVoting(data.token);
  });

export const castVoteFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ token: z.string().uuid(), targetId: z.string().min(1).max(50) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { castVote } = await import("./game.server");
    return castVote(data.token, data.targetId);
  });

export const forceResultsFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { forceResults } = await import("./game.server");
    return forceResults(data.token);
  });

export const nextRoundFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { nextRound } = await import("./game.server");
    return nextRound(data.token);
  });

export const leaveRoomFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { leaveRoom } = await import("./game.server");
    return leaveRoom(data.token);
  });

export const kickPlayerFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ token: z.string().uuid(), targetId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { kickPlayer } = await import("./game.server");
    return kickPlayer(data.token, data.targetId);
  });

export const switchGameModeFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        token: z.string().uuid(),
        mode: z.enum(["odd_one_out", "chameleon", "mafia"]),
      })
      .parse(input),
  )
  .handler(async () => {
    throw new Error("Game mode is permanently locked for this room.");
  });

export const guessChameleonWordFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ token: z.string().uuid(), guess: z.string().min(1).max(60) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { guessChameleonWord } = await import("./game.server");
    return guessChameleonWord(data.token, data.guess);
  });

export const getRoomHistoryFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { getRoomHistory } = await import("./game.server");
    return getRoomHistory(data.token);
  });

export const getPlatformStatsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getPlatformStats } = await import("./game.server");
  return getPlatformStats();
});

// Mafia-specific server functions
export const mafiaStartGameFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { mafiaStartGame } = await import("./game.server");
    return mafiaStartGame(data.token);
  });

export const mafiaNightActionFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ token: z.string().uuid(), targetId: z.string().uuid().nullable().optional() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { mafiaNightAction } = await import("./game.server");
    return mafiaNightAction(data.token, data.targetId ?? null);
  });

export const mafiaBeginMorningFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { mafiaBeginMorning } = await import("./game.server");
    return mafiaBeginMorning(data.token);
  });

export const mafiaBeginDiscussFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { mafiaBeginDiscuss } = await import("./game.server");
    return mafiaBeginDiscuss(data.token);
  });

export const mafiaBeginVoteFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { mafiaBeginVote } = await import("./game.server");
    return mafiaBeginVote(data.token);
  });

export const mafiaCastVoteFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ token: z.string().uuid(), targetId: z.string().min(1).max(50) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { mafiaCastVote } = await import("./game.server");
    return mafiaCastVote(data.token, data.targetId);
  });

export const mafiaForceVoteResultsFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { mafiaForceVoteResults } = await import("./game.server");
    return mafiaForceVoteResults(data.token);
  });

export const mafiaNextNightFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { mafiaNextNight } = await import("./game.server");
    return mafiaNextNight(data.token);
  });

export const mafiaRestartGameFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { mafiaRestartGame } = await import("./game.server");
    return mafiaRestartGame(data.token);
  });
