# Resumen Técnico - FuelSmart CR

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express (Serverless)
- **Base de Datos**: Supabase (PostgreSQL)
- **ORM**: Drizzle con migraciones automáticas
- **Despliegue**: Vercel
- **UI**: Tailwind CSS + Shadcn/ui

### Estructura del Proyecto
```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes UI reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── lib/           # Utilidades y configuración API
│   │   └── hooks/         # Custom React hooks
├── api/                   # Backend serverless
│   └── index.js          # Funciones API para Vercel
├── server/                # Desarrollo local
│   └── api-dev.ts        # Servidor de desarrollo
├── shared/                # Código compartido
│   └── schema.ts         # Esquemas de base de datos
└── docs/                  # Documentación
```

## 🗄️ Base de Datos

### Esquema Principal
```sql
-- Usuarios
CREATE TABLE users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT,
  name TEXT,
  currency TEXT DEFAULT 'CRC',
  units TEXT DEFAULT 'metric'
);

-- Vehículos
CREATE TABLE vehicles (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  year TEXT NOT NULL,
  fuel_type TEXT DEFAULT 'Gasolina',
  tank_capacity DECIMAL,
  efficiency DECIMAL,
  is_default BOOLEAN DEFAULT false
);

-- Notificaciones
CREATE TABLE user_notifications (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
  fuel_reminders BOOLEAN DEFAULT true,
  price_alerts BOOLEAN DEFAULT true,
  maintenance_alerts BOOLEAN DEFAULT true
);
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión

### Vehículos
- `GET /api/vehicles/:userId` - Obtener vehículos del usuario
- `POST /api/vehicles` - Crear nuevo vehículo
- `PUT /api/vehicles/:id` - Actualizar vehículo
- `DELETE /api/vehicles/:id` - Eliminar vehículo

### Configuración
- `GET /api/user/:userId/settings` - Obtener configuración
- `PUT /api/user/:userId/settings` - Actualizar configuración

## 🚀 Despliegue

### Entorno de Desarrollo
```bash
# Cliente
npm run dev

# API local (si es necesario)
npm run api:dev
```

### Entorno de Producción
```bash
# Despliegue automático en Vercel
vercel --prod
```

### Variables de Entorno
```env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
```

## 🔧 Herramientas de Desarrollo

### Migraciones de Base de Datos
```bash
# Generar migraciones
npm run db:generate

# Aplicar migraciones
npm run db:migrate

# Abrir Drizzle Studio
npm run db:studio
```

### Comandos Útiles
```bash
# Verificar tipos
npm run check

# Construir para producción
npm run build

# Probar API
npm run api:test
```

## 📊 Estado Actual

### ✅ Implementado
- Sistema completo de autenticación
- CRUD de vehículos con persistencia
- Configuración de usuario y notificaciones
- Despliegue en producción
- Base de datos relacional

### 🔄 En Desarrollo
- Integración OCR para recibos
- Análisis de consumo de combustible
- Sistema de alertas inteligentes
- Gamificación y logros

### 📋 Roadmap
- APIs de gasolineras
- Análisis predictivo con IA
- Módulo empresarial
- App móvil nativa