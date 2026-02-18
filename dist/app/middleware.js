import { verifyCode } from "./utils.js";
import { config } from "../config.js";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError, } from "./errors.js";
export function middlewareMetricsInc(_, __, next) {
    config.fileServerHits++;
    next();
}
export const middlewareLogResponses = (req, res, next) => {
    res.on("finish", () => {
        const statusCode = verifyCode(res.statusCode);
        console.log(`${statusCode.message && statusCode.message?.length > 0 && statusCode.message} ${req.method} ${req.url} Status: ${statusCode.code}`);
    });
    next();
};
export const errorHanlder = (err, req, res, next) => {
    if (err instanceof BadRequestError) {
        res.status(400).send({
            error: err.message,
        });
        return;
    }
    if (err instanceof UnauthorizedError) {
        res.status(401).send("Unauthorized");
        return;
    }
    if (err instanceof ForbiddenError) {
        res.status(403).send("Forbidden");
        return;
    }
    if (err instanceof NotFoundError) {
        res.status(404).send("Bad Request");
        return;
    }
    console.error(err);
    res.status(500).send("Internal Server Error");
};
