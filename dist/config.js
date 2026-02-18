process.loadEnvFile();
export const migrationConfig = {
    migrationsFolder: "./src/db",
};
export const config = {
    fileServerHits: 0,
    port: 8080,
    db: {
        url: process.env.DB_URL,
        migrationConfig: migrationConfig,
    },
    platform: process.env.PLATFORM,
    secret: process.env.SECRET,
    polka: process.env.POLKA_KEY,
};
