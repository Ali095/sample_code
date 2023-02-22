import { PermissionEntity } from "../permission.entity";
import { CreatePermissionRequestDto, UpdatePermissionRequestDto } from "./permission.request.dtos";
import { PermissionResponseDto, PermissionDto } from "./permission.response.dtos";

export class PermissionMapper {
	public static toInternalDto(entity: PermissionEntity): PermissionDto {
		const dto = new PermissionDto();
		dto.slug = entity.slug;
		dto.description = entity.description;
		return dto;
	}

	public static toDto(entity: PermissionEntity): PermissionResponseDto {
		const dto = new PermissionResponseDto();
		dto.id = entity.id;
		dto.slug = entity.slug;
		dto.description = entity.description;
		dto.active = !entity.isArchive;
		return dto;
	}

	public static toCreateEntity(dto: CreatePermissionRequestDto): PermissionEntity {
		const entity = new PermissionEntity();
		entity.slug = dto.slug;
		entity.description = dto.description;
		entity.isArchive = false;
		return entity;
	}

	public static toUpdateEntity(entity: PermissionEntity, dto: Partial<UpdatePermissionRequestDto>): PermissionEntity {
		const updated = new PermissionEntity(entity);
		updated.slug = dto.slug;
		updated.description = dto.description;
		updated.isArchive = !dto.active;
		return updated;
	}
}
