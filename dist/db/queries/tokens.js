import { and, eq, isNull } from "drizzle-orm";
import { db } from "../index.js";
import { refreshTokens } from "../schema.js";
export const createRefreshToken = async (token) => {
    const [result] = await db.insert(refreshTokens).values(token).returning();
    return result;
};
export const getRefreshToken = async (token) => {
    const result = await db.query.refreshTokens.findFirst({
        where: (refreshTokens, { eq }) => eq(refreshTokens.token, token),
    });
    return result;
};
export const updateRefreshToken = async (fields) => {
    const result = await db
        .update(refreshTokens)
        .set({
        revokedAt: fields.revokedAt,
        updatedAt: fields.updatedAt,
    })
        .where(and(eq(refreshTokens.token, fields.token), isNull(refreshTokens.revokedAt)))
        .returning();
    return result;
};
