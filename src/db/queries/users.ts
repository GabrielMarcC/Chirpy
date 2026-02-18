import { db } from "../index.js"
import { NewUser, users } from "../schema.js"
import { eq } from "drizzle-orm"

export const createUser = async (user: NewUser) => {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      isChirpyRed: users.isChirpyRed,
    })

  return result
}

export const findUserByEmail = async (email: string) => {
  return await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })
}

export const findUserById = async (userId: string) => {
  return await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  })
}

type UpdateUserInput = {
  userId: string
  email?: string
  hashedPassword?: string
  isChirpyRed?: boolean
}

export const updateUser = async (data: UpdateUserInput) => {
  const [result] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, data.userId))
    .returning({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      isChirpyRed: users.isChirpyRed,
    })

  return result
}

export const deleteAllUsers = async () => {
  await db.delete(users)
}
