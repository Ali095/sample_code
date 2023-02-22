import { ApiProperty } from "@nestjs/swagger";
import { AbstractDTO } from "src/database/_types";
import { PermissionDto } from "../../permissions/_types";
import { RoleDto } from "../../roles/_types";

export class UserResponseDto extends AbstractDTO {
	@ApiProperty()
	id: number;

	@ApiProperty({ name: "first_name" })
	firstName: string;

	@ApiProperty({ name: "last_name" })
	lastName: string;

	@ApiProperty({ name: "email" })
	email: string;

	@ApiProperty({ name: "username" })
	username: string;

	@ApiProperty({ name: "status" })
	status: string;

	@ApiProperty({ name: "email_verified" })
	emailVerified: boolean;

	@ApiProperty({ example: "UTC+05:00" })
	timezone: string;

	@ApiProperty({ example: "Company Name" })
	company: string;

	@ApiProperty({ type: [RoleDto] })
	roles?: RoleDto[];

	@ApiProperty({ type: [PermissionDto] })
	permissions?: PermissionDto[];

	@ApiProperty({ example: "https://example.com" })
	profilePicture?: string;

	@ApiProperty({ example: new Date().toISOString() })
	lastLoggedIn?: string;
}
