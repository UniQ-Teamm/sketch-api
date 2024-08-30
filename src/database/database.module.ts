import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { DrizzleModule } from '@/libs/drizzle/drizzle.module';
import { LoggerService } from '@/logger/custom.logger';
import { DbCustomLogger } from '@/logger/db-custom.logger';
import * as schema from './drizzle/schema';

@Module({
  imports: [
    DrizzleModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const pgConfig = {
          host: configService.get<string>('DATABASE_HOST') || 'localhost',
          port: configService.get<number>('DATABASE_PORT') || 5432,
          user: configService.get<string>('DATABASE_USERNAME') || 'postgres',
          password:
            configService.get<string>('DATABASE_PASSWORD') || 'password',
          database: configService.get<string>('DATABASE_DB_NAME') || 'example',
          ssl: false,
        };

        const pool = new Pool(pgConfig);
        const client = drizzle(pool, {
          logger: new DbCustomLogger(new LoggerService()),
          schema: schema,
        });

        const cbClient = async () => {
          await client.execute(sql.raw(`select 1`));
          return client;
        };

        return {
          client: cbClient,
        };
        // return withReplicas(client, [ ]);
      },
    }),
  ],
})
export class DatabaseModule {}
