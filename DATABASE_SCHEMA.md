# 📊 Esquema de Base de Datos - FuelSmart CR

## Resumen

Base de datos PostgreSQL alojada en Supabase con 14 tablas principales para gestionar:
- Usuarios y autenticación
- Vehículos y flotas
- Registros de combustible
- Gamificación y recompensas
- Alertas predictivas
- Gasolineras y marketplace
- Mantenimiento vehicular

---

## 📋 Tablas Creadas

### 1. **users** - Usuarios del Sistema
Almacena información de los usuarios registrados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR (UUID) | ID único del usuario (PK) |
| username | TEXT | Nombre de usuario único |
| password | TEXT | Contraseña hasheada |
| email | TEXT | Correo electrónico |
| full_name | TEXT | Nombre completo |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

---

### 2. **vehicles** - Vehículos
Información de los vehículos registrados por los usuarios.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR (UUID) | ID único del vehículo (PK) |
| user_id | VARCHAR | ID del propietario (FK → users) |
| name | TEXT | Nombre del vehículo |
| plate | TEXT | Placa del vehículo |
| type | ENUM | Tipo: gasoline, diesel, electric, hybrid, plugin_hybrid |
| brand | TEXT | Marca del vehículo |
| model | TEXT | Modelo del vehículo |
| year | INTEGER | Año del vehículo |
| tank_capacity | DECIMAL | Capacidad del tanque (litros o kWh) |
| average_efficiency | DECIMAL | Eficiencia promedio (L/100km o kWh/100km) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

---

### 3. **fuel_records** - Registros de Combustible
Historial de cargas de combustible o electricidad.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR (UUID) | ID único del registro (PK) |
| user_id | VARCHAR | ID del usuario (FK → users) |
| vehicle_id | VARCHAR | ID del vehículo (FK → vehicles) |
| date | TIMESTAMP | Fecha y hora de la carga |
| liters | DECIMAL | Cantidad de litros o kWh |
| price_per_liter | DECIMAL | Precio por litro/kWh (₡) |
| total_cost | DECIMAL | Costo total (₡) |
| odometer | INTEGER | Kilometraje al momento de la carga |
| station_name | TEXT | Nombre de la gasolinera |
| station_location | TEXT | Ubicación de la gasolinera |
| notes | TEXT | Notas adicionales |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

---

### 4. **gamification** - Sistema de Gamificación
Puntos, niveles y rachas de los usuarios.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR (UUID) | ID único (PK) |
| user_id | VARCHAR | ID del usuario (FK → users, UNIQUE) |
| total_points | INTEGER | Puntos totales acumulados |
| level | INTEGER | Nivel actual del usuario |
| current_streak | INTEGER | Racha actual (días consecutivos) |
| longest_streak | INTEGER | Racha más larga alcanzada |
| last_activity_date | TIMESTAMP | Última actividad registrada |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

---

### 5. **achievements** - Logros Disponibles
Catálogo de logros que los usuarios pueden desbloquear.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR (UUID) | ID único del logro (PK) |
| name | TEXT | Nombre del logro |
| description | TEXT | Descripción del logro |
| icon | TEXT | Icono o imagen del logro |
| points_required | INTEGER | Puntos necesarios para desbloquear |
| created_at | TIMESTAMP | Fecha de creación |

---

### 6. **user_achievements** - Logros Desbloqueados
Relación entre usuarios y logros desbloqueados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR (UUID) | ID único (PK) |
| user_id | VARCHAR | ID del usuario (FK → users) |
| achievement_id | VARCHAR | ID del logro (FK → achievements) |
| unlocked_at | TIMESTAMP | Fecha de desbloqueo |

---

### 7. **rewards** - Recompensas Disponibles
Catálogo de recompensas que se pueden canjear con puntos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR (UUID) | ID único de la recompensa (PK) |
| name | TEXT | Nombre de la recompensa |
| description | TEXT | Descripción de la recompensa |
| points_cost | INTEGER | Costo en puntos |
| category | TEXT | Categoría (descuento, servicio, etc.) |
| image_url | TEXT | URL de la imagen |
| is_active | BOOLEAN | Si está disponible para canje |
| created_at | TIMESTAMP | Fecha de creación |

**Ejemplos de recompensas:**
- 10% Descuento en Combustible (500 puntos)
- Cambio de Aceite Gratis (1500 puntos)
- Lavado de Auto (300 puntos)

---

### 8. **user_rewards** - Recompensas Canjeadas
Historial de recompensas canjeadas por los usuarios.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR (UUID) | ID único (PK) |
| user_id | VARCHAR | ID del usuario (FK → users) |
| reward_id | VARCHAR | ID de la recompensa (FK → rewards) |
| redeemed_at | TIMESTAMP | Fecha de canje |
| used_at | TIMESTAMP | Fecha de uso |
| is_used | BOOLEAN | Si ya fue utilizada |

---

### 9. **alerts** - Alertas Predictivas
Notificaciones y alertas generadas por el sistema de IA.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR (UUID) | ID único de la alerta (PK) |
| user_id | VARCHAR | ID del usuario (FK → users) |
| vehicle_id | VARCHAR | ID del vehículo (FK → vehicles, nullable) |
| type | ENUM | Tipo: anomaly, maintenance, price, tip, prediction |
| priority | ENUM | Prioridad: low, medium, high, critical |
| title | TEXT | Título de la alerta |
| message | TEXT | Mensaje detallado |
| is_read | BOOLEAN | Si fue leída |
| created_at | TIMESTAMP | Fecha de creación |

**Tipos de alertas:**
- **anomaly**: Consumo anormal detectado
- **maintenance**: Recordatorio de mantenimiento
- **price**: Alerta de precios bajos
- **tip**: Consejo de eco-conducción
- **prediction**: Predicción de IA

---

### 10. **gas_stations** - Gasolineras
Información de gasolineras y estaciones de carga.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR (UUID) | ID único de la gasolinera (PK) |
| name | TEXT | Nombre de la gasolinera |
| address | TEXT | Dirección completa |
| latitude | DECIMAL | Latitud (coordenadas GPS) |
| longitude | DECIMAL | Longitud (coordenadas GPS) |
| current_price | DECIMAL | Precio actual por litro (₡) |
| rating | DECIMAL | Calificación (0-5) |
| amenities | TEXT | Servicios disponibles |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

---

### 11. **maintenance_records** - Registros de Mantenimiento
Historial de mantenimientos realizados a los vehículos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR (UUID) | ID único del registro (PK) |
| user_id | VARCHAR | ID del usuario (FK → users) |
| vehicle_id | VARCHAR | ID del vehículo (FK → vehicles) |
| type | ENUM | Tipo: oil_change, tire_rotation, brake_service, battery, general_inspection, other |
| description | TEXT | Descripción del servicio |
| cost | DECIMAL | Costo del servicio (₡) |
| odometer | INTEGER | Kilometraje al momento del servicio |
| service_date | TIMESTAMP | Fecha del servicio |
| next_service_odometer | INTEGER | Próximo servicio (km) |
| next_service_date | TIMESTAMP | Próxima fecha de servicio |
| serviced_by | TEXT | Taller o mecánico |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

---

### 12. **fleets** - Flotas de Vehículos
Gestión de flotas para empresas o múltiples vehículos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR (UUID) | ID único de la flota (PK) |
| owner_id | VARCHAR | ID del propietario (FK → users) |
| name | TEXT | Nombre de la flota |
| description | TEXT | Descripción de la flota |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

---

### 13. **fleet_vehicles** - Vehículos en Flotas
Relación muchos a muchos entre flotas y vehículos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR (UUID) | ID único (PK) |
| fleet_id | VARCHAR | ID de la flota (FK → fleets) |
| vehicle_id | VARCHAR | ID del vehículo (FK → vehicles) |
| added_at | TIMESTAMP | Fecha de agregación a la flota |

---

## 🔗 Relaciones entre Tablas

```
users (1) ──→ (N) vehicles
users (1) ──→ (N) fuel_records
users (1) ──→ (1) gamification
users (1) ──→ (N) alerts
users (1) ──→ (N) user_achievements
users (1) ──→ (N) user_rewards
users (1) ──→ (N) fleets

vehicles (1) ──→ (N) fuel_records
vehicles (1) ──→ (N) maintenance_records
vehicles (1) ──→ (N) alerts

fleets (1) ──→ (N) fleet_vehicles
vehicles (1) ──→ (N) fleet_vehicles

achievements (1) ──→ (N) user_achievements
rewards (1) ──→ (N) user_rewards
```

---

## 📊 Estadísticas del Esquema

- **Total de tablas**: 13 principales
- **Enums definidos**: 4
  - `vehicle_type`: 5 opciones
  - `alert_type`: 5 opciones
  - `alert_priority`: 4 opciones
  - `maintenance_type`: 6 opciones
- **Relaciones**: 15 foreign keys
- **Índices**: Automáticos en PKs y FKs

---

## 🚀 Uso del Storage

Todos los métodos CRUD están disponibles en `server/storage.ts`:

```typescript
import { storage } from "./storage";

// Ejemplo: Crear un vehículo
const vehicle = await storage.createVehicle({
  userId: "user-id",
  name: "Toyota Corolla",
  plate: "SJO-123",
  type: "gasoline",
  brand: "Toyota",
  model: "Corolla",
  year: 2020,
});

// Ejemplo: Obtener registros de combustible
const records = await storage.getFuelRecordsByVehicleId(vehicle.id);

// Ejemplo: Crear alerta
const alert = await storage.createAlert({
  userId: "user-id",
  vehicleId: vehicle.id,
  type: "anomaly",
  priority: "high",
  title: "Consumo Anormal Detectado",
  message: "Tu vehículo está consumiendo 20% más de lo normal",
});
```

---

## 🔄 Sincronización

Para aplicar cambios al esquema:

```bash
# Sincronizar esquema con Supabase
npm run db:push

# Probar conexión
npm run db:test
```

---

## 📝 Notas Importantes

1. **UUIDs**: Todos los IDs son UUIDs generados automáticamente
2. **Timestamps**: `created_at` y `updated_at` se manejan automáticamente
3. **Cascadas**: Las eliminaciones en cascada están configuradas para mantener integridad
4. **Decimales**: Precios y cantidades usan DECIMAL para precisión
5. **Enums**: Los tipos están validados a nivel de base de datos

---

## 🎯 Próximos Pasos

1. Implementar endpoints API en `server/routes.ts`
2. Agregar autenticación con Passport.js
3. Crear seeds para datos de prueba
4. Implementar lógica de gamificación
5. Configurar sistema de alertas con IA

---

**Última actualización**: 4 de diciembre de 2025
**Estado**: ✅ Todas las tablas creadas y sincronizadas
