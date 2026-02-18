import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError, } from "./errors.js";
import { createChirp, deleteChirp, getAllChirps, getAllChirpsByUserId, getChirp, } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../config.js";
export const handlerValidateChirp = async (req, res) => {
    const maxLength = 140;
    const token = getBearerToken(req);
    if (!token) {
        return res.status(401).send();
    }
    const id = validateJWT(token, config.secret);
    if (!id) {
        throw new UnauthorizedError("Token is missing");
    }
    if (!req.body) {
        console.warn("Request body is missing");
        res.status(500).send({
            error: "Something went wrong",
        });
        return;
    }
    const body = req.body.body;
    if (req.body && body.length > maxLength) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    const words = body.split(" ");
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const loweredWord = word.toLowerCase();
        if (badWords.includes(loweredWord)) {
            words[i] = "****";
        }
    }
    const cleaned = words.join(" ");
    const response = await createChirp({
        userId: id,
        body: cleaned.length > 0 ? cleaned : body,
    });
    res.header("Content-Type", "application/json");
    res.status(201).send(Object(response));
};
export const handlerGetAllChirps = async (req, res) => {
    const query = req.query;
    if (query.authorId) {
        const response = await getAllChirpsByUserId(query.authorId);
        return res.status(200).send(response);
    }
    const response = await getAllChirps(query?.sort);
    return res.status(200).send(response);
};
export const handlerGetChirp = async (req, res) => {
    const chirpId = req.params.chirpId;
    const result = await getChirp(chirpId);
    if (!result) {
        throw new NotFoundError("Chirp not found");
    }
    return res.status(200).send(result);
};
export const handlerDeleteChirp = async (req, res) => {
    const chirpId = req.params.chirpId;
    const token = getBearerToken(req);
    if (!token) {
        throw new ForbiddenError("Missing token");
    }
    const id = validateJWT(token, config.secret);
    if (!id) {
        throw new ForbiddenError("Invalid  token");
    }
    const chirp = await getChirp(chirpId);
    if (!chirp) {
        throw new NotFoundError("Chirp not found");
    }
    const result = await deleteChirp(chirpId, id);
    if (!result) {
        throw new ForbiddenError("Error while deleting chirp");
    }
    return res.status(204).send();
};
