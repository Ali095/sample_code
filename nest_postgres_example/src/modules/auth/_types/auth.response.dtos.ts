import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "src/modules/users/_types";
import { TokenDto } from "./token.dtos";

export class AuthTokenResponseDto extends TokenDto {
	@ApiProperty({ type: [UserResponseDto] })
	user: UserResponseDto;
}
