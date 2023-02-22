import { ApiProperty } from "@nestjs/swagger/dist";
import {
	IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches,
} from "class-validator";
import { CreateUserRequestDto } from "../../users/_types";

const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export class SigninCredentialsDto {
	@ApiProperty({ required: false, example: "Hassanali5062" })
	@IsOptional()
	username?: string;

	@IsEmail({}, { message: "Email is required" })
	@IsOptional()
	@ApiProperty({ required: true, example: "Hassanali5062@gmail.com" })
	email?: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ example: "Ali@11" })
	password: string;
}

export class SignupCredentialsDto extends CreateUserRequestDto {
	@ApiProperty({ required: false, example: "Hassanali5062" })
	@IsOptional()
	username?: string;

	@IsEmail({}, { message: "Email is required" })
	@IsNotEmpty()
	@ApiProperty({ required: true, example: "Hassanali5062@gmail.com" })
	email: string;

	@IsString()
	@Length(6, 32)
	@Matches(passwordRegex, { message: "Invalid password. Password is too weak" })
	@IsNotEmpty()
	@ApiProperty({ example: "Ali@11" })
	password: string;
}

export class ChangePasswordRequestDto {
	@IsNotEmpty()
	@ApiProperty({ example: "Ali@11" })
	currentPassword: string;

	@Matches(passwordRegex, { message: "Password is too weak" })
	@IsNotEmpty()
	@Length(6, 32)
	@ApiProperty({ example: "Hello123" })
	newPassword: string;
}
