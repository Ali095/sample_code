import {
  Body, Controller, HttpStatus, Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiDocument, SkipAuth } from "src/common";
import { AuthService } from "./auth.service";
import { AuthTokenResponseDto, SigninCredentialsDto, SignupCredentialsDto } from "./_types";

@ApiTags("Authentication")
@Controller({ path: "auth", version: "1" })
@SkipAuth()
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiDocument({
    successStatusCode: 201,
    requestDescription: "Registeration request for user to register in system and get the access token",
    responseDescription: "User registered successfully and granted access token",
    returnDataDto: AuthTokenResponseDto,
    errorResponses: [HttpStatus.CONFLICT, HttpStatus.BAD_REQUEST],
  })
  @Post("/signup")
  signup(@Body() credentials: SignupCredentialsDto): Promise<AuthTokenResponseDto> {
    return this.authService.signup(credentials);
  }

  @ApiDocument({
    successStatusCode: 200,
    requestDescription: "Authentication request for user to fetch the access token",
    responseDescription: "User auhtenticated with valid credentials and granted access token",
    returnDataDto: AuthTokenResponseDto,
  })
  @Post("/signin")
  signin(@Body() credentials: SigninCredentialsDto): Promise<AuthTokenResponseDto> {
    return this.authService.signin(credentials);
  }
}
