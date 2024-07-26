import helmet from '@fastify/helmet';
import FastifyMultipart from '@fastify/multipart';
import {
  ForbiddenException,
  INestApplication,
  LogLevel,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

import { AppModule } from '@/app.module';
import { I18nService } from '@/components/i18n.service';
import { ValidationConfig } from '@/configs/validation.config';
import { EnvEnum } from '@/enums/app.enum';
import { LoggerService } from '@/logger/custom.logger';
import { isEnv } from '@/utils/util';
import { ValidatorsModule } from '@/validators/validators.module';
import fastify from 'fastify';

async function bootstrap() {
  let logLevelsDefault: LogLevel[] = [
    'log',
    'error',
    'warn',
    'debug',
    'verbose',
  ];

  if (isEnv(EnvEnum.Production) || isEnv(EnvEnum.Staging)) {
    const logLevel = process.env.LOG_LEVEL || 'error,debug,verbose';
    logLevelsDefault = logLevel.split(',') as LogLevel[];
  }

  const instance = fastify();
  instance.addHook('onRequest', (request, reply, done) => {
    reply['setHeader'] = function (key, value) {
      return this.raw.setHeader(key, value);
    };
    reply['writeHead'] = function (key, value) {
      return this.raw.writeHead(key, value);
    };
    reply['end'] = function () {
      this.raw.end();
    };
    done();
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: logLevelsDefault,
    },
  );
  // ------------- Config ---------------
  const configService = app.get(ConfigService);
  const PORT: number = configService.get<number>('PORT');
  const LISTEN_ON: string = configService.get<string>('LISTEN_ON') || '0.0.0.0';
  const DOMAIN_WHITELIST: string[] = (
    configService.get<string>('DOMAIN_WHITELIST') || '*'
  ).split(',');
  // -------------------------------------------

  // -------------- Middleware --------------
  app.register(FastifyMultipart as any);
  // -------------------------------------------

  // -------------- Global filter/pipes --------------
  app.useGlobalPipes(new ValidationPipe(ValidationConfig));
  app.setGlobalPrefix(configService.get<string>('API_PREFIX'));
  // -------------------------------------------

  // -------------- Setup Cors --------------
  if (isEnv(EnvEnum.Dev)) {
    app.enableCors({
      origin: '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });
    // -----------Setup Swagger-------------
    await ConfigDocument(app);
    // -------------------------------------------
  } else {
    await app.register(helmet as any);
    if (!DOMAIN_WHITELIST.indexOf('*')) {
      app.enableCors({
        origin: (origin, callback) => {
          if (DOMAIN_WHITELIST.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(
              new ForbiddenException(
                `The CORS policy for this site does not allow access from the specified Origin.`,
              ),
              false,
            );
          }
        },
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
      });
    } else {
      app.enableCors({
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
      });
    }
  }
  // -------------------------------------------

  // -----------------Validator-----------------
  useContainer(app.select(ValidatorsModule), { fallbackOnErrors: true });
  // -------------------------------------------

  // -----------Component init-------------
  I18nService.init();
  // -------------------------------------------

  // -----------Setup Redis Adapter-------------
  // await initAdapters(app);
  // -------------------------------------------

  await app.listen(PORT, LISTEN_ON, async () => {
    LoggerService.log(
      `==========================================================`,
    );
    LoggerService.log(`Server is running on port : ${PORT}`, 'Server');
    LoggerService.log(
      `Application is running on : ${await app.getUrl()}`,
      'Application',
    );
    if (isEnv(EnvEnum.Dev)) {
      LoggerService.log(`Docs is running on : ${await app.getUrl()}/docs`);
    }
    LoggerService.log(
      `==========================================================`,
    );
  });
}

async function ConfigDocument(app: INestApplication): Promise<void> {
  const config = new DocumentBuilder()
    .setTitle('Nestjs Drizzle')
    .setDescription('Nestjs Drizzle')
    .setExternalDoc('Nestjs Drizzle', 'https://docs.nestjs.com')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  LoggerService.log(
    `==========================================================`,
  );
  LoggerService.log(`Swagger Init: /docs`, ConfigDocument.name);
  LoggerService.log(
    `==========================================================`,
  );
}

bootstrap();
