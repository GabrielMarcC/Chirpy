import express from "express";
import { config } from "./config.js";
import { handlerReadiness } from "./app/handlers.js";
import { handlerMetrics } from "./app/metrics.js";
import { errorHanlder, middlewareLogResponses, middlewareMetricsInc, } from "./app/middleware.js";
import { handlerReset } from "./app/reset.js";
import { handlerDeleteChirp, handlerGetAllChirps, handlerGetChirp, handlerValidateChirp, } from "./app/chirp-hanlders.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { handlerCreateUser, handlerUpdateUser } from "./app/users.js";
import { ForbiddenError } from "./app/errors.js";
import { handlerLogin, handlerRefreshToken, handlerRevokeToken, } from "./app/auth-handlers.js";
import { handlerPolka } from "./app/webhooks.js";
process.loadEnvFile();
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);
const app = express();
app.use(express.json());
app.use(middlewareLogResponses);
app.use("/app/", middlewareMetricsInc, express.static("./src/app"), (req, res) => {
    res.send().status(200);
});
app.use("/app/assets/logo.png", express.static("./src/app/assets/logo.png"));
app.post("/api/users", async (req, res, next) => {
    try {
        await handlerCreateUser(req, res);
    }
    catch (error) {
        next(error);
    }
});
app.put("/api/users", async (req, res, next) => {
    try {
        await handlerUpdateUser(req, res);
    }
    catch (error) {
        next(error);
    }
});
app.post("/api/login", async (req, res, next) => {
    try {
        await handlerLogin(req, res);
    }
    catch (error) {
        next(error);
    }
});
app.post("/api/polka/webhooks", async (req, res, next) => {
    try {
        await handlerPolka(req, res);
    }
    catch (error) {
        next(error);
    }
});
app.post("/api/refresh", async (req, res, next) => {
    try {
        await handlerRefreshToken(req, res);
    }
    catch (error) {
        next(error);
    }
});
app.post("/api/revoke", async (req, res, next) => {
    try {
        await handlerRevokeToken(req, res);
    }
    catch (error) {
        next(error);
    }
});
app.get("/admin/metrics", handlerMetrics);
app.post("/api/chirps", async (req, res, next) => {
    try {
        await handlerValidateChirp(req, res);
    }
    catch (err) {
        console.log(err, "err");
        next(err);
    }
});
app.get("/api/chirps", handlerGetAllChirps);
app.get("/api/chirps/:chirpId", handlerGetChirp);
app.delete("/api/chirps/:chirpId", async (req, res, next) => {
    try {
        await handlerDeleteChirp(req, res);
    }
    catch (err) {
        console.log(err, "err");
        next(err);
    }
});
app.post("/admin/reset", async (req, res) => {
    if (config.platform !== "dev") {
        throw new ForbiddenError("403 Forbidden");
    }
    await handlerReset(req, res);
});
app.get("/api/healthz", handlerReadiness);
app.use(errorHanlder);
app.listen(config.port, () => {
    console.log(`Server is running at http://localhost:${config.port}`);
});
