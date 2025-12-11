import express from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users, vehicles, userNotifications, insertUserSchema, insertVehicleSchema, insertNotificationSchema } from "../shared/schema.js";
import { eq, and } from "drizzle-orm";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database connection
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// Validation schemas
const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

// User registration
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = insertUserSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user in database
    const newUser = await db.insert(users).values({
      username,
      password: hashedPassword,
    }).returning();
    
    // Return user without password
    const { password: _, ...userResponse } = newUser[0];
    res.status(201).json({ user: userResponse });
    
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// User login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    
    // Find user in database
    const userResult = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (userResult.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const user = userResult[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Return user without password
    const { password: _, ...userResponse } = user;
    res.json({ user: userResponse });
    
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all users (for testing)
app.get("/api/users", async (req, res) => {
  try {
    const allUsers = await db.select({
      id: users.id,
      username: users.username,
    }).from(users);
    res.json({ users: allUsers });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Vehicles endpoints
app.get("/api/vehicles/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userVehicles = await db.select().from(vehicles).where(eq(vehicles.userId, userId));
    res.json({ vehicles: userVehicles });
  } catch (error) {
    console.error("Get vehicles error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/vehicles", async (req, res) => {
  try {
    const vehicleData = insertVehicleSchema.parse(req.body);
    const { userId } = req.body;
    
    // If this is the first vehicle or marked as default, unset other defaults
    if (vehicleData.isDefault) {
      await db.update(vehicles)
        .set({ isDefault: false })
        .where(eq(vehicles.userId, userId));
    }
    
    const newVehicle = await db.insert(vehicles).values({
      ...vehicleData,
      userId,
    }).returning();
    
    res.status(201).json({ vehicle: newVehicle[0] });
  } catch (error) {
    console.error("Create vehicle error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/vehicles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const vehicleData = insertVehicleSchema.parse(req.body);
    const { userId } = req.body;
    
    // If setting as default, unset other defaults
    if (vehicleData.isDefault) {
      await db.update(vehicles)
        .set({ isDefault: false })
        .where(eq(vehicles.userId, userId));
    }
    
    const updatedVehicle = await db.update(vehicles)
      .set({ ...vehicleData, updatedAt: new Date() })
      .where(and(eq(vehicles.id, id), eq(vehicles.userId, userId)))
      .returning();
    
    if (updatedVehicle.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    
    res.json({ vehicle: updatedVehicle[0] });
  } catch (error) {
    console.error("Update vehicle error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/vehicles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const deletedVehicle = await db.delete(vehicles)
      .where(and(eq(vehicles.id, id), eq(vehicles.userId, userId)))
      .returning();
    
    if (deletedVehicle.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Delete vehicle error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User settings endpoints
app.get("/api/user/:userId/settings", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      name: users.name,
      currency: users.currency,
      units: users.units,
    }).from(users).where(eq(users.id, userId)).limit(1);
    
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    let notifications = await db.select().from(userNotifications).where(eq(userNotifications.userId, userId)).limit(1);
    
    // Create default notifications if they don't exist
    if (notifications.length === 0) {
      const newNotifications = await db.insert(userNotifications).values({
        userId,
        fuelReminders: true,
        priceAlerts: true,
        maintenanceAlerts: true,
      }).returning();
      notifications = newNotifications;
    }
    
    res.json({ 
      user: user[0],
      notifications: notifications[0]
    });
  } catch (error) {
    console.error("Get user settings error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/user/:userId/settings", async (req, res) => {
  try {
    const { userId } = req.params;
    const { user: userData, notifications: notificationData } = req.body;
    
    // Update user data
    if (userData) {
      await db.update(users)
        .set({ 
          ...userData,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
    }
    
    // Update notifications
    if (notificationData) {
      await db.update(userNotifications)
        .set({ 
          ...notificationData,
          updatedAt: new Date()
        })
        .where(eq(userNotifications.userId, userId));
    }
    
    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Update user settings error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Basic API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working on Vercel!" });
});

// Migration endpoint (for testing on Vercel)
app.post("/api/migrate", async (req, res) => {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        name TEXT,
        currency TEXT DEFAULT 'CRC',
        units TEXT DEFAULT 'metric',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Create vehicles table
    await sql`
      CREATE TABLE IF NOT EXISTS vehicles (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        year TEXT NOT NULL,
        fuel_type TEXT NOT NULL DEFAULT 'Gasolina',
        tank_capacity DECIMAL,
        efficiency DECIMAL,
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Create user_notifications table
    await sql`
      CREATE TABLE IF NOT EXISTS user_notifications (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        fuel_reminders BOOLEAN DEFAULT true,
        price_alerts BOOLEAN DEFAULT true,
        maintenance_alerts BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    res.json({ 
      message: "Migration completed successfully",
      tables: ["users", "vehicles", "user_notifications"]
    });
  } catch (error) {
    console.error("Migration error:", error);
    res.status(500).json({ 
      error: "Migration failed", 
      details: error.message 
    });
  }
});

// Catch all API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;