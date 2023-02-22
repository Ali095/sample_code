import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { SKIP_AUTH } from "../config";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	constructor(private reflector: Reflector) {
		super();
	}

	/**
	 * Verify the token is valid
	 * @param context {ExecutionContext}
	 * @returns super.canActivate(context)
	 */
	canActivate(context: ExecutionContext) {
		const skipAuth = this.reflector.getAllAndOverride<boolean>(
			SKIP_AUTH,
			[context.getHandler(), context.getClass()],
		);
		if (skipAuth) {
			return true;
		}

		const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(context.switchToHttp().getRequest());
		if (!accessToken) {
			throw new UnauthorizedException("Token not found which causes unauthorized request. Please authenticate yourself before making request");
		}

		return super.canActivate(context);
	}
}
