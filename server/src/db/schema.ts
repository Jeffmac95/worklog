import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
});

export const timeblocks = pgTable("timeblocks", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id),
    activity: text("activity").notNull(),
    timeSpent: integer("timeSpent").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
});