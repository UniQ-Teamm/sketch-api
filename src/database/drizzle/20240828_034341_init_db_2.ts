import { sql } from 'drizzle-orm';
import type { MigrationArgs } from '@llong2195/drizzle-migrations';

export async function up({ db }: MigrationArgs<'postgresql'>): Promise<void> {
  // Migration code
}

export async function down({ db }: MigrationArgs<'postgresql'>): Promise<void> {
  // Migration code
}
