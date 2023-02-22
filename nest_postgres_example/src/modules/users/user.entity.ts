import { UserAuthenticationEntity } from "src/modules/auth/auth.entity";
import { PermissionEntity } from "src/modules/permissions/permission.entity";
import { RoleEntity } from "src/modules/roles/role.entity";
import {
	Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn,
} from "typeorm";
import { BaseEntityWithoutId } from "../../database/abstract.entity";

@Entity({ name: "users" })
export class UserEntity extends BaseEntityWithoutId {
	constructor(user?: Partial<UserEntity>) {
		super(user);
		Object.assign(this, user);
	}

	@PrimaryColumn()
	public id: number;

	@OneToOne(() => UserAuthenticationEntity, (auth) => auth.id, { lazy: true, cascade: true })
	@JoinColumn({ name: "user_id", referencedColumnName: "id" })
	@Column({ unique: true, nullable: false })
	public userId: UserAuthenticationEntity;

	@Column({ nullable: true })
	public firstName: string;

	@Column({ nullable: true })
	public lastName: string;

	@Column({ nullable: true })
	public company: string;

	@Column({ nullable: true })
	public timezone: string;

	@Column({ nullable: true })
	public profilePicture: string;

	@ManyToMany(() => RoleEntity, (role) => role.id, { lazy: true, cascade: true })
	@JoinTable({
		name: "users_roles",
		joinColumn: {
			name: "user_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "role_id",
			referencedColumnName: "id",
		},
	})
	roles: Promise<RoleEntity[]>;

	@ManyToMany(() => PermissionEntity, (permission) => permission.id, { lazy: true, cascade: true })
	@JoinTable({
		name: "users_permissions",
		joinColumn: {
			name: "user_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "permission_id",
			referencedColumnName: "id",
		},
	})
	permissions: Promise<PermissionEntity[]>;
}
