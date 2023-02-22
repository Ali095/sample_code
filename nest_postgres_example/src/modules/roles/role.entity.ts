import {
	Entity, Column, ManyToMany, JoinTable,
} from "typeorm";
import { PermissionEntity } from "../permissions/permission.entity";
import { BaseEntity } from "../../database/abstract.entity";

@Entity({ name: "roles" })
export class RoleEntity extends BaseEntity {
	constructor(role?: Partial<RoleEntity>) {
		super();
		Object.assign(this, role);
	}

	@Column({
		name: "name",
		type: "varchar",
		unique: true,
		nullable: false,
		length: 50,
	})
	name: string;

	@ManyToMany(() => PermissionEntity, (permission) => permission.id, {
		lazy: true,
		cascade: true,
	})
	@JoinTable({
		// schema: "zapier",
		name: "roles_permissions",
		joinColumn: {
			name: "role_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "permission_id",
			referencedColumnName: "id",
		},
	})
	permissions: Promise<PermissionEntity[]>;
}
