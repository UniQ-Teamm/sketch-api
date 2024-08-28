import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  out: './src/database/drizzle',
  schema: './src/entities/*.ts',
  introspect: {
    casing: 'camel',
  },
  dbCredentials: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_DB_NAME || 'example',
    ssl: false,
  },
  // Print all statements
  verbose: true,
  breakpoints: true,
  // Always ask for confirmation
  strict: true,
  migrations: {
    schema: 'public',
  },
});
