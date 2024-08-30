import { sql } from 'drizzle-orm';
import type { MigrationArgs } from '@llong2195/drizzle-migrations';

export async function up({ db }: MigrationArgs<'postgresql'>): Promise<void> {
  await db.execute(sql`
          CREATE TABLE IF NOT EXISTS "user_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar NOT NULL,
	"type" smallint DEFAULT 0 NOT NULL,
	"status" smallint DEFAULT 1 NOT NULL,
	"ip_address" varchar,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar,
	"password" varchar,
	"email" varchar NOT NULL,
	"social_id" varchar NOT NULL,
	"provider_type" smallint DEFAULT 0 NOT NULL,
	"role_id" uuid,
	"birth_day" date,
	"gender" smallint DEFAULT 1 NOT NULL,
	"phone" varchar,
	"avatar" varchar,
	"status" smallint DEFAULT 1 NOT NULL,
	"verify_otp" smallint DEFAULT 0 NOT NULL,
	"verify_kyc" smallint DEFAULT 0 NOT NULL,
	"remember_token" smallint DEFAULT 0 NOT NULL,
	"last_active" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);

CREATE INDEX IF NOT EXISTS "idx_user_token_token" ON "user_token" USING btree ("token");
CREATE INDEX IF NOT EXISTS "idx_user_token_user_id" ON "user_token" USING btree ("user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "unq_user_email" ON "user" USING btree ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "unq_user_social_id" ON "user" USING btree ("social_id");
CREATE UNIQUE INDEX IF NOT EXISTS "unq_user_phone" ON "user" USING btree ("phone");
        `);
}

export async function down({ db }: MigrationArgs<'postgresql'>): Promise<void> {
  await db.execute(sql`
          DROP TABLE "user_token";
DROP TABLE "user";
        `);
}
