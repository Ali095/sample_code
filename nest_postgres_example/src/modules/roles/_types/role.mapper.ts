import { PermissionEntity } from "../../permissions/permission.entity";
import { PermissionMapper } from "../../permissions/_types";
import { CreateRoleRequestDto, UpdateRoleRequestDto } from "./role.request.dtos";
import { RoleResponseDto, RoleDto } from "./role.response.dto";
import { RoleEntity } from "../role.entity";

export class RoleMapper {
	public static toInternalDto(entity: RoleEntity): RoleDto {
		const dto = new RoleDto();
		dto.id = entity.id;
		dto.name = entity.name;
		return dto;
	}

	public static async toDto(entity: RoleEntity): Promise<RoleResponseDto> {
		const dto = new RoleResponseDto();
		dto.id = entity.id;
		dto.name = entity.name;
		dto.active = !entity.isArchive;
		return dto;
	}

	public static async toDtoWithRelations(entity: RoleEntity): Promise<RoleResponseDto> {
		console.log(entity);
		const dto = new RoleResponseDto();
		dto.id = entity.id;
		dto.name = entity.name;
		dto.permissions = await Promise.all((await entity.permissions).map(PermissionMapper.toDto));
		dto.active = !entity.isArchive;
		return dto;
	}

	public static toCreateEntity(dto: CreateRoleRequestDto): RoleEntity {
		const entity = new RoleEntity();
		entity.name = dto.name;
		entity.permissions = Promise.resolve(dto.permissions.map((id) => new PermissionEntity({ id })));
		entity.isArchive = false;
		return entity;
	}

	public static toUpdateEntity(entity: RoleEntity, dto: Partial<UpdateRoleRequestDto>): RoleEntity {
		const updateEntity = new RoleEntity(entity);

		if (dto.name !== undefined) updateEntity.name = dto.name;

		if (dto.permissions !== undefined) {
			updateEntity.permissions = Promise.resolve(dto.permissions.map((id) => new PermissionEntity({ id })));
		}

		if (dto.active !== undefined) updateEntity.isArchive = !dto.active;

		return updateEntity;
	}
}
