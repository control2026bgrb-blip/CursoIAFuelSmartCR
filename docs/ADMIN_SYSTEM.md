# 🛡️ Sistema de Administración - FuelSmart CR

## ✅ Implementación Completada

**Fecha**: 4 de diciembre de 2025
**Estado**: ✅ FUNCIONAL

---

## 🎯 Funcionalidades Implementadas

### 1. Sistema de Roles
- ✅ Enum de roles: `user` y `admin`
- ✅ Campo `role` agregado a la tabla `users`
- ✅ Rol por defecto: `user`
- ✅ Migración aplicada a Supabase

### 2. Usuario Administrador por Defecto
- ✅ Script de creación automática
- ✅ Usuario creado en la base de datos

**Credenciales del Administrador:**
```
Username: Administrador
Email: control2026bgrb@gmail.com
Password: administrador2025
Role: admin
```

### 3. Middleware de Seguridad
- ✅ `requireAdmin` - Verifica que el usuario sea administrador
- ✅ Protección de rutas administrativas
- ✅ Mensajes de error apropiados

### 4. API de Administración
- ✅ GET `/api/admin/users` - Listar todos los usuarios
- ✅ GET `/api/admin/users/:id` - Obtener usuario específico
- ✅ POST `/api/admin/users` - Crear nuevo usuario
- ✅ PUT `/api/admin/users/:id` - Actualizar usuario
- ✅ DELETE `/api/admin/users/:id` - Eliminar usuario

### 5. Frontend de Administración
- ✅ Página de gestión de usuarios (`/admin/users`)
- ✅ Tabla con todos los usuarios
- ✅ Formularios de creación y edición
- ✅ Confirmación de eliminación
- ✅ Badges de roles (Admin/Usuario)
- ✅ Protección de ruta (solo admins)

### 6. Integración en Sidebar
- ✅ Sección "Administración" visible solo para admins
- ✅ Opción "Gestión de Usuarios"
- ✅ Icono de escudo para identificar admin

---

## 📊 Archivos Creados/Modificados

### Backend
1. **`shared/schema.ts`** - Agregado enum `userRoleEnum` y campo `role`
2. **`server/storage.ts`** - Agregados métodos CRUD de usuarios
3. **`server/admin-middleware.ts`** - Middleware de verificación de admin
4. **`server/routes.ts`** - 5 endpoints de administración
5. **`script/create-admin.ts`** - Script para crear admin

### Frontend
6. **`client/src/lib/api.ts`** - API de administración
7. **`client/src/hooks/useAdminUsers.ts`** - Hook de gestión de usuarios
8. **`client/src/pages/AdminUsers.tsx`** - Página de administración
9. **`client/src/App.tsx`** - Ruta protegida `/admin/users`
10. **`client/src/components/AppSidebar.tsx`** - Menú de admin

### Configuración
11. **`package.json`** - Script `admin:create`

---

## 🔐 Seguridad Implementada

### Protección de Rutas Backend
```typescript
app.get("/api/admin/users", requireAuth, requireAdmin, async (req, res) => {
  // Solo accesible por administradores autenticados
});
```

### Protección de Rutas Frontend
```typescript
function AdminRoute({ component: Component }) {
  // Verifica autenticación
  if (!isAuthenticated) return <Redirect to="/login" />;
  
  // Verifica rol de admin
  if (user?.role !== "admin") return <Redirect to="/" />;
  
  return <Component />;
}
```

### Validaciones
- ✅ No se puede eliminar la propia cuenta de admin
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Validación de datos con Zod
- ✅ Autorización en cada endpoint

---

## 🚀 Cómo Usar

### Crear el Usuario Administrador
```bash
npm run admin:create
```

Este comando:
1. Verifica si el admin ya existe
2. Si no existe, lo crea con las credenciales por defecto
3. Muestra las credenciales en consola

### Iniciar Sesión como Admin
1. Ir a http://localhost:5000/login
2. Ingresar credenciales:
   - Usuario: `Administrador`
   - Contraseña: `administrador2025`
3. Click en "Iniciar Sesión"

### Acceder a Gestión de Usuarios
1. Una vez autenticado como admin
2. En el sidebar, verás la sección "Administración"
3. Click en "Gestión de Usuarios"
4. Accederás a `/admin/users`

---

## 📱 Funcionalidades de la Página de Administración

### Ver Usuarios
- Tabla con todos los usuarios registrados
- Información mostrada:
  - Username
  - Nombre completo
  - Email
  - Rol (con badge)
  - Fecha de registro
- Contador total de usuarios

### Crear Usuario
1. Click en botón "Crear Usuario"
2. Completar formulario:
   - **Usuario** (requerido)
   - **Contraseña** (requerido)
   - **Email** (opcional)
   - **Nombre Completo** (opcional)
   - **Rol** (Usuario o Administrador)
3. Click en "Crear Usuario"
4. El usuario se crea con gamificación inicializada

### Editar Usuario
1. Click en icono de lápiz en la fila del usuario
2. Modificar datos:
   - Username
   - Email
   - Nombre completo
   - Rol
   - **Nueva Contraseña** (opcional - dejar vacío para no cambiar)
3. Click en "Guardar Cambios"

### Eliminar Usuario
1. Click en icono de papelera
2. Confirmar eliminación
3. El usuario y todos sus datos relacionados se eliminan (cascada)

**Nota**: No se puede eliminar usuarios con rol de admin desde la interfaz (botón deshabilitado)

---

## 🎨 Interfaz de Usuario

### Badges de Roles
- **Admin**: Badge morado con icono de escudo
- **Usuario**: Badge gris con icono de usuario

### Iconos
- 🛡️ Shield - Administración
- ✏️ Pencil - Editar
- 🗑️ Trash - Eliminar
- ➕ Plus - Crear nuevo

### Diálogos
- **Crear**: Formulario completo
- **Editar**: Formulario con datos pre-cargados
- **Eliminar**: Confirmación con información del usuario

---

## 🔄 Flujo de Trabajo

### Flujo de Creación de Usuario
```
1. Admin hace click en "Crear Usuario"
   ↓
2. Completa formulario
   ↓
3. Frontend valida datos
   ↓
4. POST /api/admin/users
   ↓
5. Backend verifica que el usuario sea admin
   ↓
6. Backend hashea la contraseña
   ↓
7. Backend crea usuario en BD
   ↓
8. Backend crea gamificación para el usuario
   ↓
9. Frontend actualiza lista de usuarios
   ↓
10. Toast de confirmación
```

### Flujo de Eliminación
```
1. Admin hace click en eliminar
   ↓
2. Diálogo de confirmación
   ↓
3. Admin confirma
   ↓
4. DELETE /api/admin/users/:id
   ↓
5. Backend verifica que el usuario sea admin
   ↓
6. Backend verifica que no se elimine a sí mismo
   ↓
7. Backend elimina usuario (cascada a datos relacionados)
   ↓
8. Frontend actualiza lista
   ↓
9. Toast de confirmación
```

---

## 📊 Endpoints de Administración

### GET /api/admin/users
**Descripción**: Obtiene todos los usuarios del sistema

**Autenticación**: Requerida (Admin)

**Respuesta**:
```json
{
  "users": [
    {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "fullName": "string",
      "role": "admin|user",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

### POST /api/admin/users
**Descripción**: Crea un nuevo usuario

**Autenticación**: Requerida (Admin)

**Body**:
```json
{
  "username": "string (required)",
  "password": "string (required)",
  "email": "string (optional)",
  "fullName": "string (optional)",
  "role": "user|admin (optional, default: user)"
}
```

### PUT /api/admin/users/:id
**Descripción**: Actualiza un usuario existente

**Autenticación**: Requerida (Admin)

**Body**:
```json
{
  "username": "string (optional)",
  "password": "string (optional)",
  "email": "string (optional)",
  "fullName": "string (optional)",
  "role": "user|admin (optional)"
}
```

### DELETE /api/admin/users/:id
**Descripción**: Elimina un usuario

**Autenticación**: Requerida (Admin)

**Validaciones**:
- No se puede eliminar la propia cuenta

---

## 🎯 Casos de Uso

### Caso 1: Crear Usuario para un Empleado
1. Admin inicia sesión
2. Va a Gestión de Usuarios
3. Click en "Crear Usuario"
4. Completa:
   - Usuario: `juan.perez`
   - Contraseña: `temporal123`
   - Email: `juan@empresa.com`
   - Nombre: `Juan Pérez`
   - Rol: `Usuario`
5. Usuario creado y puede iniciar sesión

### Caso 2: Promover Usuario a Admin
1. Admin busca al usuario en la tabla
2. Click en editar
3. Cambia rol de "Usuario" a "Administrador"
4. Guarda cambios
5. Usuario ahora tiene acceso a funciones de admin

### Caso 3: Resetear Contraseña de Usuario
1. Admin edita el usuario
2. Ingresa nueva contraseña en el campo
3. Guarda cambios
4. Usuario puede iniciar sesión con nueva contraseña

### Caso 4: Eliminar Usuario Inactivo
1. Admin identifica usuario a eliminar
2. Click en eliminar
3. Confirma en el diálogo
4. Usuario y todos sus datos se eliminan

---

## ⚠️ Consideraciones Importantes

### Seguridad
- ✅ Solo admins pueden acceder a `/admin/users`
- ✅ Todas las rutas están protegidas con middleware
- ✅ Las contraseñas nunca se muestran en las respuestas
- ✅ No se puede eliminar la propia cuenta de admin

### Datos Relacionados
Al eliminar un usuario, se eliminan automáticamente (cascada):
- Vehículos del usuario
- Registros de combustible
- Datos de gamificación
- Alertas
- Recompensas canjeadas
- Registros de mantenimiento
- Flotas creadas

### Recomendaciones
1. **Cambiar contraseña del admin** después del primer login
2. **Crear usuarios con contraseñas temporales** y pedirles que las cambien
3. **No eliminar usuarios** a menos que sea absolutamente necesario
4. **Hacer backup** antes de eliminar usuarios con muchos datos

---

## 🧪 Testing

### Probar Creación de Admin
```bash
npm run admin:create
```

### Probar Login como Admin
1. Ir a http://localhost:5000/login
2. Usuario: `Administrador`
3. Contraseña: `administrador2025`

### Probar Acceso a Gestión de Usuarios
1. Login como admin
2. Verificar que aparece sección "Administración" en sidebar
3. Click en "Gestión de Usuarios"
4. Verificar que se muestra la tabla de usuarios

### Probar Protección de Rutas
1. Login como usuario normal
2. Intentar acceder a `/admin/users`
3. Debe redirigir a `/` (dashboard)

---

## 📈 Estadísticas

### Código Agregado
- **Backend**: ~200 líneas
- **Frontend**: ~400 líneas
- **Total**: ~600 líneas

### Archivos
- **Creados**: 5
- **Modificados**: 6
- **Total**: 11

### Funcionalidades
- **Endpoints**: 5
- **Hooks**: 1
- **Páginas**: 1
- **Middleware**: 1

---

## 🎉 Conclusión

El sistema de administración está completamente funcional con:
- ✅ Usuario administrador por defecto creado
- ✅ Protección de rutas backend y frontend
- ✅ CRUD completo de usuarios
- ✅ Interfaz intuitiva y segura
- ✅ Validaciones y seguridad implementadas

**El administrador puede ahora gestionar todos los usuarios del sistema de forma segura y eficiente.**

---

**Última Actualización**: 4 de diciembre de 2025
**Estado**: ✅ Funcional y Probado
**Credenciales Admin**: Ver sección "Usuario Administrador por Defecto"
