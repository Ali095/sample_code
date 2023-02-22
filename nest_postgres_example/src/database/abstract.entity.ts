import {
  Column,
  CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn,
} from "typeorm";

export abstract class BaseEntityWithoutId {
  constructor(data?: Partial<BaseEntityWithoutId>) {
    Object.assign(this, data);
  }

  @CreateDateColumn({
    type: "timestamp without time zone",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp without time zone",
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: "time without time zone",
    name: "deleted_at",
  })

  @Column({
    type: "boolean",
    name: "is_archive",
    nullable: false,
    default: false,
  })
  isArchive: boolean;
}

export abstract class BaseEntity extends BaseEntityWithoutId {
  constructor(data?: Partial<BaseEntity>) {
    super(data);
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn({ name: "id", type: "integer" })
  id: number;
}
