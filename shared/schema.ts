import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  name: text("name"),
  currency: text("currency").default("CRC"),
  units: text("units").default("metric"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  year: text("year").notNull(),
  fuelType: text("fuel_type").notNull().default("Gasolina"),
  tankCapacity: decimal("tank_capacity"),
  efficiency: decimal("efficiency"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userNotifications = pgTable("user_notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  fuelReminders: boolean("fuel_reminders").default(true),
  priceAlerts: boolean("price_alerts").default(true),
  maintenanceAlerts: boolean("maintenance_alerts").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(userNotifications).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type UserNotification = typeof userNotifications.$inferSelect;
export type InsertUserNotification = z.infer<typeof insertNotificationSchema>;
