import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, decimal, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  plate: text("plate").default(""),
  type: text("type").default("gasoline"),
  brand: text("brand").default(""),
  model: text("model").default(""),
  year: integer("year").notNull(),
  tankCapacity: decimal("tank_capacity"),
  averageEfficiency: decimal("average_efficiency"),
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

export const fuelRecords = pgTable("fuel_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  vehicleId: varchar("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  liters: decimal("liters").notNull(),
  pricePerLiter: decimal("price_per_liter").notNull(),
  totalCost: decimal("total_cost").notNull(),
  odometer: decimal("odometer"),
  stationName: text("station_name"),
  stationLocation: text("station_location"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVehicleSchema = z.object({
  // Required fields
  name: z.string().min(1, "Vehicle name is required"),
  year: z.union([z.string(), z.number()]).transform(val => {
    const parsed = parseInt(val.toString());
    if (isNaN(parsed) || parsed < 1900 || parsed > new Date().getFullYear() + 2) {
      throw new Error("Invalid year");
    }
    return parsed;
  }),
  
  // Optional fields
  plate: z.string().optional(),
  brand: z.string().optional(), 
  model: z.string().optional(),
  fuelType: z.enum(["gasoline", "diesel", "electric", "hybrid"]).optional().default("gasoline"),
  tankCapacity: z.string().optional(),
  efficiency: z.string().optional(), // Map to 'average_efficiency' in database
});

export const insertNotificationSchema = createInsertSchema(userNotifications).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFuelRecordSchema = createInsertSchema(fuelRecords).omit({
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
export type FuelRecord = typeof fuelRecords.$inferSelect;
export type InsertFuelRecord = z.infer<typeof insertFuelRecordSchema>;
