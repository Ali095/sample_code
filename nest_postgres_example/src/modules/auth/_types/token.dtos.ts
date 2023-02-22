import { ApiProperty } from "@nestjs/swagger";

export interface ValidateTokenResponseDto {
	valid: boolean;
}

export interface JwtPayload {
	id: number;
	username: string;
	email: string;
}

export class TokenDto {
	@ApiProperty({ name: "access_token" })
	accessToken: string;

	@ApiProperty({ name: "access_token_expires" })
	accessTokenExpires: string;

	@ApiProperty({ name: "refresh_token" })
	refreshToken: string;
}
