import express from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { users, vehicles, userNotifications, fuelRecords, insertUserSchema, insertVehicleSchema, insertNotificationSchema, insertFuelRecordSchema } from "../shared/schema.js";
import { eq, and, desc } from "drizzle-orm";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database connection using Supabase client
console.log("🔍 Environment check:");
console.log("SUPABASE_URL exists:", !!process.env.SUPABASE_URL);
console.log("SUPABASE_ANON_KEY exists:", !!process.env.SUPABASE_ANON_KEY);
console.log("SUPABASE_SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

let supabase;
try {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Use service role key for server-side operations (bypasses RLS)
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    console.log("✅ Supabase client initialized with service role");
  } else if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    // Fallback to anon key
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    console.log("✅ Supabase client initialized with anon key");
  } else {
    console.error("❌ Missing SUPABASE_URL or keys");
  }
} catch (error) {
  console.error("❌ Supabase initialization error:", error.message);
}

// Validation schemas
const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

// User registration using Supabase client
app.post("/api/auth/register", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: "Database not available" });
    }

    const { username, password } = insertUserSchema.parse(req.body);
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();
    
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user in database
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        username,
        password: hashedPassword,
      })
      .select()
      .single();
    
    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: "Failed to create user: " + error.message });
    }
    
    // Return user without password
    const { password: _, ...userResponse } = newUser;
    res.status(201).json({ user: userResponse });
    
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Database error: " + error.message });
  }
});

// User login using Supabase client
app.post("/api/auth/login", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: "Database not available" });
    }

    const { username, password } = loginSchema.parse(req.body);
    
    // Find user in database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
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
    res.status(500).json({ error: "Database error: " + error.message });
  }
});

// Get all users (for testing)
app.get("/api/users", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: "Database not available" });
    }

    const { data: allUsers, error } = await supabase
      .from('users')
      .select('id, username');
    
    if (error) {
      console.error("Get users error:", error);
      return res.status(500).json({ error: "Database error: " + error.message });
    }
    
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

// Fuel records endpoints
app.get("/api/fuel-records/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const records = await db.select({
      id: fuelRecords.id,
      vehicleId: fuelRecords.vehicleId,
      liters: fuelRecords.liters,
      pricePerLiter: fuelRecords.pricePerLiter,
      totalCost: fuelRecords.totalCost,
      odometer: fuelRecords.odometer,
      station: fuelRecords.station,
      date: fuelRecords.date,
      notes: fuelRecords.notes,
      createdAt: fuelRecords.createdAt,
      vehicleName: vehicles.name,
    })
    .from(fuelRecords)
    .leftJoin(vehicles, eq(fuelRecords.vehicleId, vehicles.id))
    .where(eq(fuelRecords.userId, userId))
    .orderBy(desc(fuelRecords.date));
    
    res.json({ records });
  } catch (error) {
    console.error("Get fuel records error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/fuel-records", async (req, res) => {
  try {
    const recordData = insertFuelRecordSchema.parse(req.body);
    const { userId } = req.body;
    
    const newRecord = await db.insert(fuelRecords).values({
      ...recordData,
      userId,
    }).returning();
    
    res.status(201).json({ record: newRecord[0] });
  } catch (error) {
    console.error("Create fuel record error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/fuel-records/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const recordData = insertFuelRecordSchema.parse(req.body);
    const { userId } = req.body;
    
    const updatedRecord = await db.update(fuelRecords)
      .set({ ...recordData, updatedAt: new Date() })
      .where(and(eq(fuelRecords.id, id), eq(fuelRecords.userId, userId)))
      .returning();
    
    if (updatedRecord.length === 0) {
      return res.status(404).json({ error: "Fuel record not found" });
    }
    
    res.json({ record: updatedRecord[0] });
  } catch (error) {
    console.error("Update fuel record error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/fuel-records/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const deletedRecord = await db.delete(fuelRecords)
      .where(and(eq(fuelRecords.id, id), eq(fuelRecords.userId, userId)))
      .returning();
    
    if (deletedRecord.length === 0) {
      return res.status(404).json({ error: "Fuel record not found" });
    }
    
    res.json({ message: "Fuel record deleted successfully" });
  } catch (error) {
    console.error("Delete fuel record error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Basic API routes
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    database: !!process.env.DATABASE_URL ? "configured" : "missing",
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/api/test", async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ 
        message: "API is working but Supabase not initialized",
        database: false,
        env_check: {
          SUPABASE_URL: !!process.env.SUPABASE_URL,
          SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
          NODE_ENV: process.env.NODE_ENV
        }
      });
    }

    // Try a simple database query using Supabase client
    console.log("Attempting Supabase query...");
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log("Supabase query error:", error);
      return res.json({
        message: "Supabase client working but query failed",
        database: false,
        error: error.message,
        error_code: error.code,
        error_details: error.details
      });
    }
    
    console.log("Supabase query successful");
    
    res.json({ 
      message: "API and Supabase are working!",
      database: true,
      query_result: "success"
    });
  } catch (error) {
    console.error("Supabase test error:", error);
    
    res.json({ 
      message: "API working but Supabase error",
      database: false,
      error: error.message,
      error_name: error.name,
      env_check: {
        SUPABASE_URL: !!process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY
      }
    });
  }
});

// Migration endpoint using Supabase SQL
app.post("/api/migrate", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: "Supabase not initialized" });
    }

    // Create tables using Supabase RPC or direct SQL
    const migrations = [
      `CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        name TEXT,
        currency TEXT DEFAULT 'CRC',
        units TEXT DEFAULT 'metric',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );`,
      
      `CREATE TABLE IF NOT EXISTS vehicles (
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
      );`,
      
      `CREATE TABLE IF NOT EXISTS user_notifications (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        fuel_reminders BOOLEAN DEFAULT true,
        price_alerts BOOLEAN DEFAULT true,
        maintenance_alerts BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );`,
      
      `CREATE TABLE IF NOT EXISTS fuel_records (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id VARCHAR NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        liters DECIMAL NOT NULL,
        price_per_liter DECIMAL NOT NULL,
        total_cost DECIMAL NOT NULL,
        odometer DECIMAL,
        station TEXT,
        date TIMESTAMP NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );`
    ];

    // Execute each migration
    for (const migration of migrations) {
      const { error } = await supabase.rpc('exec_sql', { sql: migration });
      if (error) {
        console.error("Migration error:", error);
        return res.status(500).json({ 
          error: "Migration failed", 
          details: error.message 
        });
      }
    }

    res.json({ 
      message: "Migration completed successfully using Supabase",
      tables: ["users", "vehicles", "user_notifications", "fuel_records"]
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