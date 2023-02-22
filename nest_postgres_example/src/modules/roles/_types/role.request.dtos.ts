import {
	ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsNumber, MaxLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleRequestDto {
	@ApiProperty()
	@IsNotEmpty()
	@MaxLength(50)
	name: string;

	@ApiProperty({ example: [1, 2] })
	@ArrayNotEmpty()
	@IsArray()
	@IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
	permissions: number[];
}

export class UpdateRoleRequestDto extends CreateRoleRequestDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsBoolean()
	active: boolean;
}
