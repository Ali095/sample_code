import { registerAs } from "@nestjs/config";
import { join } from "path";
import { ConfigMapper } from "./index";
import { DatabaseOptions } from "./interfaces";
import { SnakeNamingStrategy } from "../database/database.naming.strategy";

const CONNECTION_TYPE = "postgres";

export const registerDatabaseConfiguration = registerAs(ConfigMapper.database, (): DatabaseOptions => ({
	type: CONNECTION_TYPE,
	host: process.env.POSTGRES_HOST || "localhost",
	port: +process.env.POSTGRES_PORT || 5432,
	username: process.env.POSTGRES_USER || "postgres",
	password: process.env.POSTGRES_PASSWORD || "root",
	database: process.env.POSTGRES_DB || "zapier",
	schema: process.env.DB_SCHEMA || "zapier",
	synchronize: true,
	namingStrategy: new SnakeNamingStrategy(),
	logging: true,
	autoLoadEntities: true,
	entities: [join(__dirname, "./modules/**/*.entity{.ts, .js}")],
	migrations: [join(__dirname, "./migrations/*.entity{.ts, .js}")],
	migrationsTableName: "migration",
}));
