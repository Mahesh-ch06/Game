import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const sessionSchema = z.object({
  sessionToken: z.string().min(10),
});

/**
 * Public: Get current active logo variant
 */
export const getActiveLogoFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getActiveLogo } = await import("./admin.server");
  const activeLogo = await getActiveLogo();
  return { activeLogo };
});

/**
 * Admin Login: Authenticate with admin passphrase
 */
export const adminLoginFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ password: z.string().min(1).max(100) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { loginAdmin } = await import("./admin.server");
    return loginAdmin(data.password);
  });

/**
 * Admin: Get system status & security metrics
 */
export const adminGetStatsFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    const { getAdminStats } = await import("./admin.server");
    return getAdminStats(data.sessionToken);
  });

/**
 * Admin: Update active logo variant site-wide
 */
export const adminUpdateLogoFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        sessionToken: z.string().min(10),
        logo: z.enum(["cipher", "cube", "minimal"]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { updateActiveLogo } = await import("./admin.server");
    return updateActiveLogo(data.sessionToken, data.logo);
  });

/**
 * Admin: Get active rooms
 */
export const adminGetRoomsFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    const { getAdminRooms } = await import("./admin.server");
    return getAdminRooms(data.sessionToken);
  });

/**
 * Admin: Terminate a room
 */
export const adminKillRoomFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        sessionToken: z.string().min(10),
        code: z.string().min(3).max(10),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { killAdminRoom } = await import("./admin.server");
    return killAdminRoom(data.sessionToken, data.code);
  });

/**
 * Admin: Get word pairs list
 */
export const adminGetWordPairsFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => sessionSchema.parse(input))
  .handler(async ({ data }) => {
    const { getWordPairs } = await import("./admin.server");
    return getWordPairs(data.sessionToken);
  });

/**
 * Admin: Add new custom word pair
 */
export const adminAddWordPairFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        sessionToken: z.string().min(10),
        category: z.string().min(1).max(30),
        major: z.string().min(1).max(40),
        minor: z.string().min(1).max(40),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { addWordPair } = await import("./admin.server");
    return addWordPair(data.sessionToken, data.category, data.major, data.minor);
  });

/**
 * Admin: Delete word pair
 */
export const adminDeleteWordPairFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        sessionToken: z.string().min(10),
        id: z.string().min(1),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { deleteWordPair } = await import("./admin.server");
    return deleteWordPair(data.sessionToken, data.id);
  });
