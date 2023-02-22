import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./guards";
import { RolesModule } from "./modules/roles/roles.module";
import { AllExceptionsFilter, ApiLogger } from "./common";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { configurationModule } from "./config/config.module";
import { PermissionsModule } from "./modules/permissions/permissions.module";
import { ExternalAppsModule } from "./external/external.module";

@Module({
    imports: [
        configurationModule,
        DatabaseModule,
        ExternalAppsModule,
        AuthModule,
        UsersModule,
        PermissionsModule,
        RolesModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(ApiLogger).forRoutes("*");
    }
}
