import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps } from "../schema.js";
export const createChirp = async (chirp) => {
    const [result] = await db.insert(chirps).values(chirp).returning();
    return result;
};
export const getAllChirps = async (sort = "asc") => {
    const result = await db
        .select()
        .from(chirps)
        .orderBy(sort === "asc" ? asc(chirps.createdAt) : desc(chirps.createdAt));
    return result;
};
export const getChirp = async (chirpId) => {
    const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpId));
    return result;
};
export const getAllChirpsByUserId = async (authorId) => {
    const result = await db.query.chirps.findMany({
        where: (chirps, { eq }) => eq(chirps.userId, authorId),
    });
    return result;
};
export const deleteChirp = async (chirpId, userId) => {
    const [result] = await db
        .delete(chirps)
        .where(and(eq(chirps.id, chirpId), eq(chirps.userId, userId)))
        .returning({
        id: chirps.id,
    });
    return result;
};
