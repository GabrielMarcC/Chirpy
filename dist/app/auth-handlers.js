import { findUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, getBearerToken, makeJWT, makeRefreshToken, } from "./auth.js";
import { BadRequestError, UnauthorizedError } from "./errors.js";
import { config } from "../config.js";
import { createRefreshToken, getRefreshToken, updateRefreshToken, } from "../db/queries/tokens.js";
import { HOUR } from "../constants.js";
export const handlerLogin = async (req, res) => {
    const params = req.body;
    const user = await findUserByEmail(params.email);
    if (!user) {
        throw new UnauthorizedError("incorrect email or password");
    }
    const token = makeJWT(user?.id, HOUR, config.secret);
    const refreshToken = makeRefreshToken();
    const createRefresh = await createRefreshToken({
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        revokedAt: null,
    });
    if (!createRefresh) {
        throw new BadRequestError("Error creating refresh token");
    }
    const passwordMatch = await checkPasswordHash(params.password, user.hashedPassword);
    if (!passwordMatch) {
        throw new UnauthorizedError("incorrect email or password");
    }
    res.status(200).send({
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token,
        refreshToken,
        isChirpyRed: user.isChirpyRed,
    });
};
export const handlerRefreshToken = async (req, res) => {
    const token = getBearerToken(req);
    const findedToken = await getRefreshToken(token);
    const isInvalid = !findedToken?.token ||
        findedToken.revokedAt !== null ||
        findedToken.expiresAt < new Date();
    if (isInvalid) {
        res.status(401).send({
            error: "Unauthorized",
        });
        return;
    }
    const newToken = makeJWT(findedToken.userId, HOUR, config.secret);
    res.status(200).send({
        token: newToken,
    });
};
export const handlerRevokeToken = async (req, res) => {
    const token = getBearerToken(req);
    const tokenFromDb = await getRefreshToken(token);
    const isInvalid = !tokenFromDb ||
        tokenFromDb.token !== token ||
        tokenFromDb.revokedAt !== null ||
        tokenFromDb.expiresAt < new Date();
    if (isInvalid) {
        res.status(401).send({
            error: "Unauthorized",
        });
        return;
    }
    const updateRevokeToken = await updateRefreshToken({
        token,
        revokedAt: new Date(),
        updatedAt: new Date(),
    });
    if (updateRevokeToken.length === 0) {
        res.status(400).send({
            error: "Something went wrong",
        });
    }
    return res.status(204).send();
};
