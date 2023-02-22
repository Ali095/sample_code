import { registerAs } from "@nestjs/config";
import { ConfigMapper } from "./index";

export interface Secrets {
	nodeEnv: string;
	port: number;
	APIPrefix: string;
	jwtSecret: string;
	jwtExpiresIn: string;
	refreshExpiresIn: string
}

export const registerConfgurationSecrets = registerAs(ConfigMapper.appConfig, (): Secrets => ({
	nodeEnv: process.env.NODE_ENV || "dev",
	port: parseInt(process.env.PORT, 10) || 3000,
	APIPrefix: "api",
	jwtSecret: process.env.JWT_SECRET || "thereIsNoSecretForCreatingJWT",
	jwtExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "2d",
	refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
}));
