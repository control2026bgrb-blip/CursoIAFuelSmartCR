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
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();
    
    // If error is not "not found", it's a real error
    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error checking existing user:", checkError);
      return res.status(500).json({ 
        error: "Database error: " + checkError.message,
        code: checkError.code,
        hint: checkError.hint
      });
    }
    
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
      return res.status(500).json({ 
        error: "Failed to create user: " + error.message,
        code: error.code,
        hint: error.hint,
        details: error.details
      });
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
    if (!supabase) {
      return res.status(500).json({ error: "Database not available" });
    }

    const { userId } = req.params;
    const { data: userVehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error("Get vehicles error:", error);
      return res.status(500).json({ error: "Database error: " + error.message });
    }
    
    res.json({ vehicles: userVehicles });
  } catch (error) {
    console.error("Get vehicles error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/vehicles", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: "Database not available" });
    }

    const vehicleData = insertVehicleSchema.parse(req.body);
    const { userId } = req.body;
    
    // If this is the first vehicle or marked as default, unset other defaults
    if (vehicleData.isDefault) {
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({ is_default: false })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error("Error unsetting default vehicles:", updateError);
      }
    }
    
    const { data: newVehicle, error } = await supabase
      .from('vehicles')
      .insert({
        ...vehicleData,
        user_id: userId,
        fuel_type: vehicleData.fuelType,
        tank_capacity: vehicleData.tankCapacity,
        is_default: vehicleData.isDefault,
      })
      .select()
      .single();
    
    if (error) {
      console.error("Create vehicle error:", error);
      return res.status(500).json({ error: "Database error: " + error.message });
    }
    
    res.status(201).json({ vehicle: newVehicle });
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
    if (!supabase) {
      return res.status(500).json({ error: "Database not available" });
    }

    const { id } = req.params;
    const vehicleData = insertVehicleSchema.parse(req.body);
    const { userId } = req.body;
    
    // If setting as default, unset other defaults
    if (vehicleData.isDefault) {
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({ is_default: false })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error("Error unsetting default vehicles:", updateError);
      }
    }
    
    const { data: updatedVehicle, error } = await supabase
      .from('vehicles')
      .update({
        ...vehicleData,
        fuel_type: vehicleData.fuelType,
        tank_capacity: vehicleData.tankCapacity,
        is_default: vehicleData.isDefault,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      console.error("Update vehicle error:", error);
      return res.status(500).json({ error: "Database error: " + error.message });
    }
    
    res.json({ vehicle: updatedVehicle });
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
    if (!supabase) {
      return res.status(500).json({ error: "Database not available" });
    }

    const { id } = req.params;
    const { userId } = req.body;
    
    const { data: deletedVehicle, error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      console.error("Delete vehicle error:", error);
      return res.status(500).json({ error: "Database error: " + error.message });
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
    if (!supabase) {
      return res.status(500).json({ error: "Database not available" });
    }

    const { userId } = req.params;
    
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, password')
      .eq('id', userId)
      .single();
    
    if (userError) {
      if (userError.code === 'PGRST116') {
        return res.status(404).json({ error: "User not found" });
      }
      console.error("Get user error:", userError);
      return res.status(500).json({ error: "Database error: " + userError.message });
    }
    
    let { data: notifications, error: notifError } = await supabase
      .from('user_notifications')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    // Create default notifications if they don't exist
    if (notifError && notifError.code === 'PGRST116') {
      const { data: newNotifications, error: createError } = await supabase
        .from('user_notifications')
        .insert({
          user_id: userId,
          fuel_reminders: true,
          price_alerts: true,
          maintenance_alerts: true,
        })
        .select()
        .single();
      
      if (createError) {
        console.error("Create notifications error:", createError);
        return res.status(500).json({ error: "Database error: " + createError.message });
      }
      
      notifications = newNotifications;
    } else if (notifError) {
      console.error("Get notifications error:", notifError);
      return res.status(500).json({ error: "Database error: " + notifError.message });
    }
    
    // Return user data with defaults for missing fields
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email || "",
      name: user.name || "",
      currency: user.currency || "CRC",
      units: user.units || "metric"
    };

    res.json({ 
      user: userResponse,
      notifications: notifications || {
        fuel_reminders: true,
        price_alerts: true,
        maintenance_alerts: true
      }
    });
  } catch (error) {
    console.error("Get user settings error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/user/:userId/settings", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: "Database not available" });
    }

    const { userId } = req.params;
    const { user: userData, notifications: notificationData } = req.body;
    
    // Update user data
    if (userData) {
      const { error: userError } = await supabase
        .from('users')
        .update({ 
          ...userData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (userError) {
        console.error("Update user error:", userError);
        return res.status(500).json({ error: "Database error: " + userError.message });
      }
    }
    
    // Update notifications
    if (notificationData) {
      const { error: notifError } = await supabase
        .from('user_notifications')
        .update({ 
          fuel_reminders: notificationData.fuelReminders,
          price_alerts: notificationData.priceAlerts,
          maintenance_alerts: notificationData.maintenanceAlerts,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (notifError) {
        console.error("Update notifications error:", notifError);
        return res.status(500).json({ error: "Database error: " + notifError.message });
      }
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
    if (!supabase) {
      return res.status(500).json({ error: "Database not available" });
    }

    const { userId } = req.params;
    const { data: records, error } = await supabase
      .from('fuel_records')
      .select(`
        id,
        vehicle_id,
        liters,
        price_per_liter,
        total_cost,
        odometer,
        station,
        date,
        notes,
        created_at,
        vehicles!inner(name)
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error("Get fuel records error:", error);
      return res.status(500).json({ error: "Database error: " + error.message });
    }
    
    // Transform the data to match expected format
    const transformedRecords = records.map(record => ({
      id: record.id,
      vehicleId: record.vehicle_id,
      liters: record.liters,
      pricePerLiter: record.price_per_liter,
      totalCost: record.total_cost,
      odometer: record.odometer,
      station: record.station,
      date: record.date,
      notes: record.notes,
      createdAt: record.created_at,
      vehicleName: record.vehicles?.name
    }));
    
    res.json({ records: transformedRecords });
  } catch (error) {
    console.error("Get fuel records error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/fuel-records", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: "Database not available" });
    }

    const recordData = insertFuelRecordSchema.parse(req.body);
    const { userId } = req.body;
    
    const { data: newRecord, error } = await supabase
      .from('fuel_records')
      .insert({
        user_id: userId,
        vehicle_id: recordData.vehicleId,
        liters: recordData.liters,
        price_per_liter: recordData.pricePerLiter,
        total_cost: recordData.totalCost,
        odometer: recordData.odometer,
        station: recordData.station,
        date: recordData.date,
        notes: recordData.notes,
      })
      .select()
      .single();
    
    if (error) {
      console.error("Create fuel record error:", error);
      return res.status(500).json({ error: "Database error: " + error.message });
    }
    
    res.status(201).json({ record: newRecord });
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
    if (!supabase) {
      return res.status(500).json({ error: "Database not available" });
    }

    const { id } = req.params;
    const recordData = insertFuelRecordSchema.parse(req.body);
    const { userId } = req.body;
    
    const { data: updatedRecord, error } = await supabase
      .from('fuel_records')
      .update({
        vehicle_id: recordData.vehicleId,
        liters: recordData.liters,
        price_per_liter: recordData.pricePerLiter,
        total_cost: recordData.totalCost,
        odometer: recordData.odometer,
        station: recordData.station,
        date: recordData.date,
        notes: recordData.notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: "Fuel record not found" });
      }
      console.error("Update fuel record error:", error);
      return res.status(500).json({ error: "Database error: " + error.message });
    }
    
    res.json({ record: updatedRecord });
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
    if (!supabase) {
      return res.status(500).json({ error: "Database not available" });
    }

    const { id } = req.params;
    const { userId } = req.body;
    
    const { data: deletedRecord, error } = await supabase
      .from('fuel_records')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: "Fuel record not found" });
      }
      console.error("Delete fuel record error:", error);
      return res.status(500).json({ error: "Database error: " + error.message });
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

// Check database structure
app.get("/api/db-structure", async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ error: "Database not available" });
    }

    // Check what columns exist in users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    // Check what tables exist
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_names');

    res.json({
      users_sample: users?.[0] || "No users found",
      users_error: usersError?.message,
      available_tables: tables || "Could not fetch tables",
      tables_error: tablesError?.message
    });
  } catch (error) {
    res.json({ error: error.message });
  }
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
          SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
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
        error_details: error.details,
        hint: error.hint,
        env_check: {
          SUPABASE_URL: !!process.env.SUPABASE_URL,
          SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
          SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          service_key_preview: process.env.SUPABASE_SERVICE_ROLE_KEY ? 
            process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 50) + "..." : "undefined"
        }
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
        SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY
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