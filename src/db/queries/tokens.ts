import { and, eq, isNull } from "drizzle-orm"
import { db } from "../index.js"
import { NewRefreshToken, refreshTokens } from "../schema.js"

export const createRefreshToken = async (token: NewRefreshToken) => {
  const [result] = await db.insert(refreshTokens).values(token).returning()
  return result
}

export const getRefreshToken = async (token: string) => {
  const result = await db.query.refreshTokens.findFirst({
    where: (refreshTokens, { eq }) => eq(refreshTokens.token, token),
  })

  return result
}

export const updateRefreshToken = async (
  fields: Pick<NewRefreshToken, "updatedAt" | "revokedAt" | "token">
) => {
  const result = await db
    .update(refreshTokens)
    .set({
      revokedAt: fields.revokedAt,
      updatedAt: fields.updatedAt,
    })
    .where(
      and(
        eq(refreshTokens.token, fields.token),
        isNull(refreshTokens.revokedAt)
      )
    )
    .returning()

  return result
}
