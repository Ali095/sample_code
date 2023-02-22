import { UserAuthenticationEntity } from "src/modules/auth/auth.entity";
import { generateHexColor } from "src/common/helpers";
import { PermissionEntity } from "../../permissions/permission.entity";
import { PermissionDto, PermissionMapper } from "../../permissions/_types";
import { RoleEntity } from "../../roles/role.entity";
import { RoleMapper } from "../../roles/_types";
import { CreateUserRequestDto, UpdateUserRequestDto } from "./user.request.dtos";
import { UserResponseDto } from "./user.response.dtos";
import { UserEntity } from "../user.entity";

async function fetchUserPermissions(entity: UserEntity): Promise<PermissionDto[]> {
	const userPermissions: PermissionDto[] = await Promise.all(
		(await entity.permissions).map(PermissionMapper.toInternalDto),
	);

	await Promise.all((await entity.roles).map(async (role) => {
		await Promise.all((await role.permissions).map((permission) => {
			const per: PermissionDto = PermissionMapper.toInternalDto(permission);
			if (!userPermissions.find((p) => p.slug === per.slug)) userPermissions.push(per);
			return permission;
		}));
	}));

	return userPermissions;
}

export class UserMapper {
	public static async toDto(entity: UserEntity): Promise<UserResponseDto> {
		const dto = new UserResponseDto();

		dto.id = entity.id;
		dto.firstName = entity.firstName;
		dto.lastName = entity.lastName;
		dto.company = entity.company;
		dto.timezone = entity.timezone;
		return dto;
	}

	public static async toDtoWithRelations(entity: UserEntity): Promise<UserResponseDto> {
		const userAuthData: UserAuthenticationEntity = await entity.userId;

		const dto = new UserResponseDto();
		dto.id = entity.id;
		dto.email = userAuthData.email;
		dto.emailVerified = userAuthData.emailVerified;
		dto.status = userAuthData.status;
		dto.username = userAuthData.username;
		dto.createdAt = userAuthData.createdAt?.toISOString();
		dto.updatedAt = userAuthData.updatedAt?.toISOString();
		dto.firstName = entity.firstName;
		dto.lastName = entity.lastName;
		dto.company = entity.company;
		dto.timezone = entity.timezone;
		dto.profilePicture = entity.profilePicture;
		dto.lastLoggedIn = userAuthData.lastLoggedIn?.toISOString();
		dto.roles = await Promise.all((await entity.roles).map(RoleMapper.toInternalDto));
		dto.permissions = await fetchUserPermissions(entity);
		return dto;
	}

	public static toCreateEntity(userId: number, dto: CreateUserRequestDto): UserEntity {
		const entity = new UserEntity();
		entity.id = userId;
		entity.profilePicture = `https://ui-avatars.com/api/?name=${dto.firstName}+${dto.lastName}&size=512&background=${generateHexColor()}&font-size=0.45`;
		entity.userId = new UserAuthenticationEntity({ id: userId });
		Object.keys(dto).forEach((key) => {
			switch (key) {
				case "permissions":
					entity.permissions = Promise.resolve(dto.permissions.map((id) => new PermissionEntity({ id })));
					break;

				case "roles":
					entity.roles = Promise.resolve(dto.roles.map((id) => new RoleEntity({ id })));
					break;

				default:
					entity[key] = dto[key];
					break;
			}
		});
		return entity;
	}

	public static toUpdateEntity(entity: UserEntity, dto: Partial<UpdateUserRequestDto>): UserEntity {
		const updatedEntity = new UserEntity(entity);

		Object.keys(dto).forEach((key) => {
			switch (key) {
				case "permissions":
					updatedEntity.permissions = Promise.resolve(dto.permissions.map((id) => new PermissionEntity({ id })));
					break;

				case "roles":
					updatedEntity.roles = Promise.resolve(dto.roles.map((id) => new RoleEntity({ id })));
					break;

				default:
					if (dto[key] !== undefined) { updatedEntity[key] = dto[key]; }
					break;
			}
		});
		return updatedEntity;
	}
}
