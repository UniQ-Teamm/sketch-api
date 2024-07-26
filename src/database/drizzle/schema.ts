import { bigint, date, index, pgTable, serial, smallint, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";



export const userToken = pgTable("user_token", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	token: varchar("token").notNull(),
	type: smallint("type").default(0).notNull(),
	status: smallint("status").default(1).notNull(),
	ipAddress: varchar("ip_address"),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		idxUserTokenToken: index("idx_user_token_token").using("btree", table.token),
		idxUserTokenUserId: index("idx_user_token_user_id").using("btree", table.userId),
	}
});

export const user = pgTable("user", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	fullName: varchar("full_name"),
	password: varchar("password"),
	email: varchar("email").notNull(),
	socialId: varchar("social_id").notNull(),
	providerType: smallint("provider_type").default(0).notNull(),
	roleId: uuid("role_id"),
	birthDay: date("birth_day"),
	gender: smallint("gender").default(1).notNull(),
	phone: varchar("phone"),
	avatar: varchar("avatar"),
	status: smallint("status").default(1).notNull(),
	verifyOtp: smallint("verify_otp").default(0).notNull(),
	verifyKyc: smallint("verify_kyc").default(0).notNull(),
	rememberToken: smallint("remember_token").default(0).notNull(),
	lastActive: timestamp("last_active", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
},
(table) => {
	return {
		unqUserEmail: uniqueIndex("unq_user_email").using("btree", table.email),
		unqUserPhone: uniqueIndex("unq_user_phone").using("btree", table.phone),
		unqUserSocialId: uniqueIndex("unq_user_social_id").using("btree", table.socialId),
	}
});

export const drizzleMigrations = pgTable("__drizzle_migrations", {
	id: serial("id").primaryKey().notNull(),
	hash: text("hash").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdAt: bigint("created_at", { mode: "number" }),
});