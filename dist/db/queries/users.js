import { db } from "../index.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";
export const createUser = async (user) => {
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
    });
    return result;
};
export const findUserByEmail = async (email) => {
    return await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
    });
};
export const findUserById = async (userId) => {
    return await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
    });
};
export const updateUser = async (data) => {
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
    });
    return result;
};
export const deleteAllUsers = async () => {
    await db.delete(users);
};
