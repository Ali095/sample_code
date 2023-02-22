import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigMapper } from "../../config";
import { Secrets } from "../../config/interfaces";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const appConfig = configService.get<Secrets>(ConfigMapper.appConfig);
    super({ secretOrKey: appConfig.jwtSecret, jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() });
  }

  async validate(payload: any) {
    return { user: `user is happy${payload}` };
  }
}
