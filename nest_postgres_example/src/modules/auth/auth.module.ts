import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenService } from "src/modules/auth/token.service";
import { ExternalAppsModule } from "src/external/external.module";
import { UsersModule } from "../users/users.module";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Secrets } from "../../config/interfaces";
import { ConfigMapper } from "../../config";
import { UserAuthenticationEntity } from "./auth.entity";

const jwtFactory = {
	useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => {
		const appConfig = configService.get<Secrets>(ConfigMapper.appConfig);
		return {
			secret: appConfig.jwtSecret,
			signOptions: { expiresIn: appConfig.jwtExpiresIn },
		};
	},
	inject: [ConfigService],
};

@Module({
	imports: [
		JwtModule.registerAsync(jwtFactory),
		PassportModule.register({ defaultStrategy: "jwt" }),
		TypeOrmModule.forFeature([UserAuthenticationEntity]),
		UsersModule,
		ExternalAppsModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, TokenService],
	exports: [JwtModule, JwtStrategy, PassportModule],
})
export class AuthModule { }
