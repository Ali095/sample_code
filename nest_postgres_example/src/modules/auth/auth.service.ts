import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, InsertResult } from "typeorm";
import { BadRequestException } from "@nestjs/common/exceptions/bad-request.exception";
import { CreateUserRequestDto } from "src/modules/users/_types";
import { AuthMapper } from "src/modules/auth/auth.mapper";
import { TokenService } from "src/modules/auth/token.service";
import { SendgridService } from "src/external/email/email.service";
import { EmailType } from "src/external/email/_types";
import { Logger } from "@nestjs/common/services";
import { UsersService } from "../users/users.service";
import {
  AuthTokenResponseDto, SigninCredentialsDto, SignupCredentialsDto, TokenDto,
} from "./_types";
import { UserAuthenticationEntity } from "./auth.entity";
import { EncryptionHelper } from "../../common/helpers";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserAuthenticationEntity)
    private authRepository: Repository<UserAuthenticationEntity>,
    private tokenService: TokenService,
    private usersService: UsersService,
    private emailService: SendgridService,
  ) { }

  async signup(user: SignupCredentialsDto): Promise<AuthTokenResponseDto> {
    let authEntity = AuthMapper.toCreateEntity(user);
    authEntity.password = await EncryptionHelper.hash(authEntity.password);
    authEntity = await this.authRepository.save(authEntity);

    const { id, username, email } = authEntity;
    const tokens: TokenDto = this.tokenService.generateAuthToken({ id, username, email });

    const userData = await this.usersService.createUser(id, user);
    return { ...tokens, user: userData };
  }

  async signin(credentials: SigninCredentialsDto): Promise<AuthTokenResponseDto> {
    // const emailData = await this.emailService.sendMailToSingleUser({ to: "sekaf41202@bymercy.com" }, EmailType.EMAIL_VERIFICATION);
    /** Check validation on request */
    if (!credentials.email && !credentials.username) throw new BadRequestException("One of username and email field must not be empty");

    let user: UserAuthenticationEntity;
    if (credentials.username) user = await this.authRepository.findOne({ where: { username: credentials.username } });
    else user = await this.authRepository.findOne({ where: { email: credentials.email } });

    if (!user) throw new UnauthorizedException(`No account found for user ${credentials.email || credentials.username}`);

    const valid = await EncryptionHelper.compareHash(credentials.password, user.password);
    if (!valid) throw new UnauthorizedException(`Incorrect password provided for user ${credentials.email || credentials.username}`);

    const { id, username, email } = user;
    const tokens: TokenDto = this.tokenService.generateAuthToken({ id, username, email });

    const userData = await this.usersService.getUserById(id);

    // call to update the last login of user before returning from function
    this.authRepository.save({ ...user, lastLoggedIn: new Date() }).catch(Logger.error);
    return { ...tokens, user: userData };
  }

  // async updateUserAuthData(userId: number) {
  //   let authEntity = AuthMapper.toCreateEntity(user);
  //   authEntity.password = await EncryptionHelper.hash(authEntity.password);
  //   authEntity = await this.authRepository.save(authEntity);

  //   const { id, username, email } = authEntity;
  //   const tokens: TokenDto = this.tokenService.generateAuthToken({ id, username, email });

  //   const userData = await this.usersService.createUser(id, user);
  //   return { ...tokens, user: userData };
  // }
}
