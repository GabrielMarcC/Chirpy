import { MigrationConfig } from "drizzle-orm/migrator"

process.loadEnvFile()

type APIConfig = {
  fileServerHits: number
  port: number
  db: {
    url: string
    migrationConfig: MigrationConfig
  }
  platform: string
  secret: string
  polka: string
}
export const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db",
}

export const config: APIConfig & { port: number } = {
  fileServerHits: 0,
  port: 8080,
  db: {
    url: process.env.DB_URL!,
    migrationConfig: migrationConfig,
  },
  platform: process.env.PLATFORM!,
  secret: process.env.SECRET!,
  polka: process.env.POLKA_KEY!,
}
