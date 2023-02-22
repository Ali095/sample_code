import { EncryptionHelper } from "src/common";
import {
	AuthTokenResponseDto, ChangePasswordRequestDto, SigninCredentialsDto, SignupCredentialsDto, UserAuthStatus,
} from "./_types";
import { UserAuthenticationEntity } from "./auth.entity";

export class AuthMapper {
	public static toCreateEntity(dto: SignupCredentialsDto): UserAuthenticationEntity {
		const entity = new UserAuthenticationEntity();
		entity.email = dto.email.toLowerCase();
		entity.username = dto.username || EncryptionHelper.addSalt(entity.email.split("@")[0]);
		entity.password = dto.password;
		entity.status = UserAuthStatus.Active;
		return entity;
	}

	public static toUpdateEntity(entity: UserAuthenticationEntity, dto: Partial<SignupCredentialsDto>): UserAuthenticationEntity {
		const updatedEntity = new UserAuthenticationEntity(entity);

		Object.keys(dto).forEach((key) => {
			if (dto[key] !== undefined) { updatedEntity[key] = dto[key]; }
		});
		return updatedEntity;
	}
}
