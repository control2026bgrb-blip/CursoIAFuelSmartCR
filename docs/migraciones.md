# Guía de Migraciones de Base de Datos

## 🗄️ Estado Actual de la Base de Datos

### ⚠️ Importante: Estado Real
**Las tablas pueden no existir aún en Supabase debido a problemas de conexión local.**

### Esquemas Definidos
Los siguientes esquemas están definidos en `shared/schema.ts` pero necesitan ser aplicados:

```typescript
// Usuarios con información extendida
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

// Vehículos del usuario
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

// Preferencias de notificaciones
export const userNotifications = pgTable("user_notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  fuelReminders: boolean("fuel_reminders").default(true),
  priceAlerts: boolean("price_alerts").default(true),
  maintenanceAlerts: boolean("maintenance_alerts").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

## 🚀 Métodos de Migración

### Método 1: Via Vercel (Recomendado)
Usar el endpoint de migración en producción:

```bash
# Después de desplegar
curl -X POST https://tu-app.vercel.app/api/migrate
```

### Método 2: Supabase Dashboard
1. Ir a https://supabase.com/dashboard
2. Abrir tu proyecto
3. Ir a SQL Editor
4. Ejecutar el SQL manualmente:

```sql
-- Crear tabla de usuarios
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

-- Crear tabla de vehículos
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

-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS user_notifications (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fuel_reminders BOOLEAN DEFAULT true,
  price_alerts BOOLEAN DEFAULT true,
  maintenance_alerts BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Método 3: Drizzle Kit (Cuando funcione la conexión local)
```bash
# Generar archivos de migración
npm run db:generate

# Aplicar migraciones
npm run db:migrate

# Abrir Drizzle Studio
npm run db:studio
```

## 🔧 Comandos Disponibles

### Scripts de Package.json
```json
{
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit push", 
  "db:studio": "drizzle-kit studio"
}
```

### Archivo migrate.bat (Windows)
```batch
@echo off
echo Running database migrations...
echo.

REM Load environment variables from .env file
for /f "delims=" %%x in (.env) do (set "%%x")

REM Generate migration files from schema changes
echo Generating migration files...
npx drizzle-kit generate

REM Apply migrations to database
echo Applying migrations to database...
npx drizzle-kit push

echo.
echo ✅ Migration completed successfully!
pause
```

## 🐛 Problemas Conocidos

### Conexión Local a Supabase
**Error**: `getaddrinfo ENOTFOUND api.pooler.supabase.com`

**Posibles Causas**:
- Firewall bloqueando puerto 6543
- DNS no resuelve el hostname
- VPN o proxy interfiriendo
- Restricciones de red corporativa

**Soluciones**:
1. Usar Vercel para migraciones
2. Usar Supabase Dashboard directamente
3. Verificar configuración de red
4. Probar desde otra conexión

### Variables de Entorno
**Problema**: `.env` no se carga correctamente

**Solución**:
```javascript
// En server/api-dev.ts
import path from "path";
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });
```

## ✅ Verificación de Migraciones

### Comprobar Tablas Creadas
```sql
-- Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Ver estructura de tabla específica
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users';
```

### Probar Funcionalidad
1. Registrar un usuario nuevo
2. Agregar un vehículo
3. Configurar preferencias
4. Verificar que los datos persisten

## 🔄 Futuras Migraciones

### Para Agregar Nuevas Tablas
1. Editar `shared/schema.ts`
2. Ejecutar `npm run db:generate`
3. Revisar archivos en `migrations/`
4. Ejecutar `npm run db:migrate`

### Ejemplo: Tabla de Registros de Combustible
```typescript
export const fuelRecords = pgTable("fuel_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  vehicleId: varchar("vehicle_id").notNull().references(() => vehicles.id),
  liters: decimal("liters").notNull(),
  pricePerLiter: decimal("price_per_liter").notNull(),
  totalCost: decimal("total_cost").notNull(),
  odometer: integer("odometer"),
  station: text("station"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```