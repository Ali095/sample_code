import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { PermissionEntity } from "./permission.entity";
import { PermissionsController } from "./permissions.controller";
import { PermissionsRepository } from "./permissions.repository";
import { PermissionsService } from "./permissions.service";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([PermissionEntity])],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsRepository],
})
export class PermissionsModule { }
