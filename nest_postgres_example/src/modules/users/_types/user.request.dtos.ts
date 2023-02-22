import {
	IsArray, IsNotEmpty, IsOptional, IsNumber, MaxLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserRequestDto {
	@IsOptional()
	@MaxLength(100)
	@ApiProperty({ example: "Hassan", name: "first_name" })
	firstName?: string;

	@IsOptional()
	@MaxLength(100)
	@ApiProperty({ example: "Virk", name: "last_name" })
	lastName?: string;

	@MaxLength(100)
	@IsOptional()
	@ApiProperty({ example: "UTC+05:00", required: false })
	timezone?: string;

	@MaxLength(100)
	@IsOptional()
	@ApiProperty({ example: "Company Name", required: false })
	company?: string;

	@ApiProperty({ example: [1, 2] })
	@IsArray()
	@IsOptional()
	@IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
	permissions?: number[];

	@ApiProperty({ example: [1, 2] })
	@IsArray()
	@IsOptional()
	@IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
	roles?: number[];
}

export class UpdateUserRequestDto {
	@MaxLength(100)
	@IsOptional()
	@ApiProperty({ example: "Hassan", name: "first_name" })
	firstName: string;

	@MaxLength(100)
	@IsOptional()
	@ApiProperty({ example: "Virk", name: "last_name" })
	lastName: string;

	@MaxLength(100)
	@IsOptional()
	@ApiProperty({ example: "UTC+05:00", required: false })
	timezone: string;

	@MaxLength(100)
	@IsOptional()
	@ApiProperty({ example: "Company Name", required: false })
	company: string;

	@ApiProperty({ example: [1, 2] })
	@IsArray()
	@IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
	@IsOptional()
	permissions: number[];

	@ApiProperty({ example: [1, 2] })
	@IsArray()
	@IsOptional()
	@IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
	roles: number[];
}
