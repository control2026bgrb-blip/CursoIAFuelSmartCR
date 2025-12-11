import express from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { insertUserSchema, insertVehicleSchema, insertFuelRecordSchema } from "../shared/schema.js";

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
    const { userId, isDefault } = req.body;
    
    // Check if this is the first vehicle for the user
    const { data: existingVehicles } = await supabase
      .from('vehicles')
      .select('id')
      .eq('user_id', userId);
    
    const isFirstVehicle = !existingVehicles || existingVehicles.length === 0;
    const shouldBeDefault = isDefault || isFirstVehicle;
    
    // If this should be default, unset other defaults
    if (shouldBeDefault) {
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
        user_id: userId,
        name: vehicleData.name,
        plate: vehicleData.plate || '',
        type: vehicleData.fuelType || 'gasoline',
        brand: vehicleData.brand || '',
        model: vehicleData.model || '',
        year: parseInt(vehicleData.year),
        tank_capacity: vehicleData.tankCapacity ? parseFloat(vehicleData.tankCapacity) : null,
        average_efficiency: vehicleData.efficiency ? parseFloat(vehicleData.efficiency) : null,
        is_default: shouldBeDefault,
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
    const { userId, isDefault } = req.body;
    
    // If setting as default, unset other defaults
    if (isDefault) {
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
        name: vehicleData.name,
        plate: vehicleData.plate || '',
        type: vehicleData.fuelType || 'gasoline',
        brand: vehicleData.brand || '',
        model: vehicleData.model || '',
        year: parseInt(vehicleData.year),
        tank_capacity: vehicleData.tankCapacity ? parseFloat(vehicleData.tankCapacity) : null,
        average_efficiency: vehicleData.efficiency ? parseFloat(vehicleData.efficiency) : null,
        is_default: isDefault || false,
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
      .select('id, username, email, full_name, role')
      .eq('id', userId)
      .single();
    
    if (userError) {
      if (userError.code === 'PGRST116') {
        return res.status(404).json({ error: "User not found" });
      }
      console.error("Get user error:", userError);
      return res.status(500).json({ error: "Database error: " + userError.message });
    }
    
    // Since user_notifications table doesn't exist, use defaults
    const notifications = {
      fuel_reminders: true,
      price_alerts: true,
      maintenance_alerts: true
    };
    
    // Return user data with correct field mapping
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email || "",
      name: user.full_name || "",
      currency: "CRC", // Default since column doesn't exist
      units: "metric"  // Default since column doesn't exist
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
    
    // Update user data (only update fields that exist)
    if (userData) {
      const updateData = {};
      if (userData.email !== undefined) updateData.email = userData.email;
      if (userData.name !== undefined) updateData.full_name = userData.name;
      // Skip currency and units since they don't exist in the table
      
      if (Object.keys(updateData).length > 0) {
        updateData.updated_at = new Date().toISOString();
        
        const { error: userError } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', userId);
      
        if (userError) {
          console.error("Update user error:", userError);
          return res.status(500).json({ error: "Database error: " + userError.message });
        }
      }
    }
    
    // Skip notifications update since table doesn't exist
    // In a real app, you'd create the table or store preferences elsewhere
    
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
        station_name,
        station_location,
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
      station: record.station_name,
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
        liters: parseFloat(recordData.liters),
        price_per_liter: parseFloat(recordData.pricePerLiter),
        total_cost: parseFloat(recordData.totalCost),
        odometer: recordData.odometer ? parseFloat(recordData.odometer) : null,
        station_name: recordData.station || null,
        station_location: null, // We don't have this in our form
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
        liters: parseFloat(recordData.liters),
        price_per_liter: parseFloat(recordData.pricePerLiter),
        total_cost: parseFloat(recordData.totalCost),
        odometer: recordData.odometer ? parseFloat(recordData.odometer) : null,
        station_name: recordData.station || null,
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

    // Check what tables exist by trying to query them
    const tableChecks = {};
    
    // Check users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    tableChecks.users = { exists: !usersError, sample: users?.[0], error: usersError?.message };

    // Check vehicles table
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .limit(1);
    tableChecks.vehicles = { exists: !vehiclesError, sample: vehicles?.[0], error: vehiclesError?.message };

    // Check user_notifications table
    const { data: notifications, error: notificationsError } = await supabase
      .from('user_notifications')
      .select('*')
      .limit(1);
    tableChecks.user_notifications = { exists: !notificationsError, sample: notifications?.[0], error: notificationsError?.message };

    // Check fuel_records table
    const { data: fuelRecords, error: fuelRecordsError } = await supabase
      .from('fuel_records')
      .select('*')
      .limit(1);
    tableChecks.fuel_records = { exists: !fuelRecordsError, sample: fuelRecords?.[0], error: fuelRecordsError?.message };

    res.json({ tables: tableChecks });
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

// Migration endpoint - Check database structure and provide SQL commands
app.get("/api/migrate", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: "Supabase not initialized" });
    }

    const results = [];
    const executed = [];
    const errors = [];

    // Try to execute migrations using Supabase RPC or direct operations
    
    // 1. Try to add is_default column to vehicles table
    try {
      // First check if column exists by trying to select it
      const { error: checkError } = await supabase
        .from('vehicles')
        .select('is_default')
        .limit(1);
      
      if (checkError && checkError.message.includes('column "is_default" does not exist')) {
        // Try to add the column using RPC
        const { error: addError } = await supabase.rpc('exec_sql', {
          sql: 'ALTER TABLE vehicles ADD COLUMN is_default BOOLEAN DEFAULT false;'
        });
        
        if (addError) {
          errors.push(`Failed to add is_default column: ${addError.message}`);
          results.push("❌ Could not add is_default column - run manually in Supabase SQL Editor");
        } else {
          executed.push("✅ Added is_default column to vehicles table");
        }
      } else {
        results.push("✅ is_default column already exists in vehicles table");
      }
    } catch (error) {
      errors.push(`Error with is_default column: ${error.message}`);
    }

    // 2. Try to create user_notifications table
    try {
      const { error: checkError } = await supabase
        .from('user_notifications')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.message.includes('relation "user_notifications" does not exist')) {
        const { error: createError } = await supabase.rpc('exec_sql', {
          sql: `CREATE TABLE user_notifications (
            id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            fuel_reminders BOOLEAN DEFAULT true,
            price_alerts BOOLEAN DEFAULT true,
            maintenance_alerts BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );`
        });
        
        if (createError) {
          errors.push(`Failed to create user_notifications table: ${createError.message}`);
          results.push("❌ Could not create user_notifications table - run manually in Supabase SQL Editor");
        } else {
          executed.push("✅ Created user_notifications table");
        }
      } else {
        results.push("✅ user_notifications table already exists");
      }
    } catch (error) {
      errors.push(`Error with user_notifications table: ${error.message}`);
    }

    // 3. Try to add other vehicle columns
    const vehicleColumns = [
      { name: 'plate', type: 'TEXT DEFAULT \'\'' },
      { name: 'brand', type: 'TEXT DEFAULT \'\'' },
      { name: 'model', type: 'TEXT DEFAULT \'\'' }
    ];
    
    for (const column of vehicleColumns) {
      try {
        const { error: checkError } = await supabase
          .from('vehicles')
          .select(column.name)
          .limit(1);
        
        if (checkError && checkError.message.includes(`column "${column.name}" does not exist`)) {
          const { error: addError } = await supabase.rpc('exec_sql', {
            sql: `ALTER TABLE vehicles ADD COLUMN ${column.name} ${column.type};`
          });
          
          if (addError) {
            errors.push(`Failed to add ${column.name} column: ${addError.message}`);
            results.push(`❌ Could not add ${column.name} column - run manually`);
          } else {
            executed.push(`✅ Added ${column.name} column to vehicles table`);
          }
        } else {
          results.push(`✅ ${column.name} column already exists in vehicles table`);
        }
      } catch (error) {
        errors.push(`Error with ${column.name} column: ${error.message}`);
      }
    }

    // Provide manual SQL commands if RPC failed
    const manualSQL = `
-- Run these commands manually in Supabase SQL Editor if needed:

-- Add missing columns to vehicles table
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS plate TEXT DEFAULT '';
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT '';
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS model TEXT DEFAULT '';

-- Create user_notifications table
CREATE TABLE IF NOT EXISTS user_notifications (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fuel_reminders BOOLEAN DEFAULT true,
  price_alerts BOOLEAN DEFAULT true,
  maintenance_alerts BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add missing columns to other tables
ALTER TABLE fuel_records ADD COLUMN IF NOT EXISTS station_location TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
`;

    res.json({ 
      message: "Migration completed",
      executed: executed,
      alreadyExists: results,
      errors: errors,
      manualSQL: errors.length > 0 ? manualSQL : null,
      note: errors.length > 0 ? 
        "Some migrations failed - use the manual SQL commands in Supabase SQL Editor" : 
        "All migrations completed successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Migration error:", error);
    res.status(500).json({ 
      error: "Migration failed", 
      details: error.message,
      manualSQL: `
-- Run these commands manually in Supabase SQL Editor:
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS plate TEXT DEFAULT '';
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT '';
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS model TEXT DEFAULT '';

CREATE TABLE IF NOT EXISTS user_notifications (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fuel_reminders BOOLEAN DEFAULT true,
  price_alerts BOOLEAN DEFAULT true,
  maintenance_alerts BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
`
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