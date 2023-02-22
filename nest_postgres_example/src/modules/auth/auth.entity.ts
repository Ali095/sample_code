import { Column, Entity } from "typeorm";
import { UserAuthStatus } from "./_types";
import { BaseEntity } from "../../database/abstract.entity";

@Entity({ name: "users_authentication" })
export class UserAuthenticationEntity extends BaseEntity {
	@Column({ unique: true, nullable: false })
	public email: string;

	@Column({ unique: true, nullable: false })
	public username: string;

	@Column({ nullable: false })
	public password: string;

	@Column({ nullable: false, default: false })
	public emailVerified: boolean;

	@Column({
		type: "enum",
		enum: UserAuthStatus,
		nullable: false,
		default: UserAuthStatus.Active,
	})
	status: UserAuthStatus;

	@Column({ nullable: true })
	public emailConfirmationToken: string;

	@Column({
		type: "timestamp without time zone",
		nullable: true,
	})
	public emailTokenTime: Date;

	@Column({ nullable: true })
	public passwordRecoveryToken: string;

	@Column({
		type: "timestamp without time zone",
		nullable: true,
	})
	public recoveryTokenTime: Date;

	@Column({
		type: "timestamp without time zone",
		nullable: true,
	})
	public lastLoggedIn: Date;
}
