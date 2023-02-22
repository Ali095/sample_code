import { Entity, Column } from "typeorm";
import { BaseEntity } from "../../database/abstract.entity";

@Entity({ name: "permissions" })
export class PermissionEntity extends BaseEntity {
	constructor(permission?: Partial<PermissionEntity>) {
		super(permission);
		Object.assign(this, permission);
	}

	@Column({
		name: "slug",
		type: "varchar",
		nullable: false,
		unique: true,
		length: 60,
	})
	slug: string;

	@Column({
		name: "description",
		type: "varchar",
		nullable: false,
		length: 160,
	})
	description: string;
}
