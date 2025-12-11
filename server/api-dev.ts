import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users, insertUserSchema } from "../shared/schema.js";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from root directory
import path from "path";
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const app = express();
const PORT = 3001;

// Manual CORS middleware (more reliable than cors package)
app.use((req, res, next) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Database connection
console.log("🔍 Environment check:");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("DATABASE_URL preview:", process.env.DATABASE_URL ? 
  process.env.DATABASE_URL.substring(0, 20) + "..." : "undefined");

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables");
  console.error("Make sure .env file exists and contains DATABASE_URL");
  process.exit(1);
}

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
    console.log("📝 Registration attempt:", req.body.username);
    
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
    
    console.log("✅ User created:", newUser[0].username);
    
    // Return user without password
    const { password: _, ...userResponse } = newUser[0];
    res.status(201).json({ user: userResponse });
    
  } catch (error) {
    console.error("❌ Registration error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// User login
app.post("/api/auth/login", async (req, res) => {
  try {
    console.log("🔐 Login attempt:", req.body.username);
    
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
    
    console.log("✅ Login successful:", user.username);
    
    // Return user without password
    const { password: _, ...userResponse } = user;
    res.json({ user: userResponse });
    
  } catch (error) {
    console.error("❌ Login error:", error);
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
    console.error("❌ Get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    cors: "enabled",
    environment: "development"
  });
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "CORS is working!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  console.log(`📡 Database: ${process.env.DATABASE_URL?.split('@')[1]}`);
  console.log(`🔧 Environment: DEVELOPMENT`);
  console.log(`📋 Available endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   GET  http://localhost:${PORT}/api/users`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
});