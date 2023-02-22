import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { Secrets } from "src/config/interfaces";
import { ConfigMapper } from "src/config";
import {
  ValidateTokenResponseDto, JwtPayload, TokenDto, UserAuthStatus,
} from "./_types";
import { UserAuthenticationEntity } from "./auth.entity";

@Injectable()
export class TokenService {
  private config: Secrets;

  constructor(
    @InjectRepository(UserAuthenticationEntity)
    private authRepository: Repository<UserAuthenticationEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.config = this.configService.get<Secrets>(ConfigMapper.appConfig);
  }

  /**
   * Generate Auth token(JWT) service for login user
   * @param JwtPayload {JwtPayload}
   * @returns TokenDto Returns access and refresh tokens with expiry
   */
  public generateAuthToken(payload: JwtPayload): TokenDto {
    const accessTokenExpires = this.config.jwtExpiresIn;
    const refreshTokenExpires = this.config.refreshExpiresIn;

    const accessToken = this.generateToken(payload, accessTokenExpires);
    const refreshToken = this.generateToken(payload, refreshTokenExpires);

    return {
      accessToken,
      accessTokenExpires,
      refreshToken,
    };
  }

  /**
   * Generate Refresh token(JWT) service for generating new refresh and access tokens
   * @param payload {JwtPayload}
   * @returns  Returns access and refresh tokens with expiry or error
   */
  public generateRefreshToken(refreshToken: string): TokenDto {
    const { id, username, email } = this.verifyToken(refreshToken);
    return this.generateAuthToken({ id, username, email });
  }

  /**
   * Verify JWT service
   * @param token JWT token
   * @param type {TokenType} "refresh" or "access"
   * @returns decrypted payload from JWT
   */
  public verifyToken(token: string) {
    return this.jwtService.verify(token);
  }

  /**
   * Validate received JWT
   * @param token {string}
   * @returns valid: boolean
   */
  public async validateToken(token: string): Promise<ValidateTokenResponseDto> {
    try {
      const { id } = this.jwtService.verify(token);
      const user = await this.authRepository.findOne(id);
      if (!user || user.status === UserAuthStatus.Blocked || user.status === UserAuthStatus.Inactive) {
        return { valid: false };
      }

      return { valid: !!id };
    } catch (error) {
      Logger.error("Validation token error", error);
      return { valid: false };
    }
  }

  /**
   * Generate JWT token
   * @private
   * @param payload {JwtPayload}
   * @param expiresIn {string}
   * @returns JWT
   */
  private generateToken(payload: JwtPayload, expiresIn: string): string {
    const token = this.jwtService.sign(payload, { expiresIn });
    return token;
  }
}
