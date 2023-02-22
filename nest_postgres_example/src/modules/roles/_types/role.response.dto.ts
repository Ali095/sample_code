import { ApiProperty } from "@nestjs/swagger";
import { AbstractDTO } from "src/database/_types";
import { PermissionResponseDto } from "../../permissions/_types";

export class RoleResponseDto extends AbstractDTO {
	constructor(role?: Partial<RoleResponseDto>) {
		super(role);
		Object.assign(this, role);
	}

	@ApiProperty()
	name: string;

	@ApiProperty({ type: [PermissionResponseDto] })
	permissions: PermissionResponseDto[];

	@ApiProperty()
	active: boolean;
}

export class RoleDto {
	constructor(role?: Partial<RoleDto>) {
		Object.assign(this, role);
	}

	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;
}
