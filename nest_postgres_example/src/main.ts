/* eslint-disable global-require */

import { NestFactory, Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import helmet from "helmet";
import { ConfigMapper, SwaggerConfig } from "./config";
import { Secrets } from "./config/interfaces";
import { AppModule } from "./app.module";
import { TransformInterceptor } from "./_interceptors/transform.interceptor";
import { ResponseInterceptor } from "./_interceptors/response.interceptor";
import { TimeoutInterceptor } from "./_interceptors/timeout.interceptor";

const defaultOrigins: string[] = ["http://localhost:3001", "http://localhost:3000"];

async function bootstrap() {
    const logger = new Logger("Bootstraping", { timestamp: true });
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    app.use(helmet());
    app.enableCors({ origin: defaultOrigins, credentials: true });
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: "1",
        prefix: "v",
    });

    const configService = app.get(ConfigService);
    const appConfig = configService.get<Secrets>(ConfigMapper.appConfig);

    app.setGlobalPrefix(appConfig.APIPrefix);
    app.useGlobalInterceptors(
        new TransformInterceptor(),
        new ResponseInterceptor(new Reflector()),
        new TimeoutInterceptor(),
    );

    app.useGlobalPipes(new ValidationPipe({
        validatorPackage: require("class-validator"),
        transformerPackage: require("class-transformer"),
        // whitelist: true,
        forbidUnknownValues: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));

    SwaggerConfig(app, "1");

    await app.listen(appConfig.port);
    logger.log(`App is running in "${appConfig.nodeEnv}" mode, and it is listening at: http://localhost:${appConfig.port}/${appConfig.APIPrefix}/`);
}
bootstrap();
