# 🚀 Guía Rápida: Configuración de Supabase

## ✅ Pasos Completados

Ya he configurado tu proyecto para usar Supabase como base de datos:

- ✅ Instalada dependencia `postgres`
- ✅ Actualizado `storage.ts` para usar PostgreSQL
- ✅ Creado archivo de migración SQL
- ✅ Configurado Drizzle ORM
- ✅ Agregado script de prueba de conexión

## 📋 Lo que necesitas hacer

### 1. Crear proyecto en Supabase (5 minutos)

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"
4. Completa:
   - **Name**: FuelSmart CR (o el nombre que prefieras)
   - **Database Password**: Elige una contraseña segura (¡guárdala!)
   - **Region**: Elige la más cercana a Costa Rica (ej: South America)
5. Espera 2-3 minutos mientras se crea el proyecto

### 2. Obtener la cadena de conexión

1. En tu proyecto de Supabase, ve a **Settings** (⚙️ en la barra lateral)
2. Selecciona **Database**
3. Busca la sección **Connection String**
4. Selecciona la pestaña **URI**
5. Copia la cadena completa (se ve así):
   ```
   postgresql://postgres.[ref]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
6. Reemplaza `[PASSWORD]` con la contraseña que elegiste en el paso 1

### 3. Configurar el archivo .env

1. Abre el archivo `.env` en la raíz del proyecto
2. Pega tu cadena de conexión:
   ```env
   DATABASE_URL=postgresql://postgres.xxxxx:tu-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

### 4. Crear las tablas en Supabase

Tienes dos opciones:

#### Opción A: Automática (Recomendada)

```bash
npm run db:push
```

#### Opción B: Manual

1. En Supabase, ve a **SQL Editor**
2. Copia el contenido de `migrations/0000_initial_schema.sql`
3. Pégalo en el editor
4. Haz clic en "Run"

### 5. Probar la conexión

```bash
npm run db:test
```

Si todo está bien, verás:
```
✅ Database connection successful
✅ User created: { id: '...', username: '...', password: '...' }
✅ All tests passed!
```

### 6. Reiniciar el servidor

Detén el servidor actual (Ctrl+C) y reinícialo:

```bash
npm run dev
```

Deberías ver:
```
✅ Database connection successful
serving on port 5000
```

## 🎉 ¡Listo!

Ahora tu aplicación está usando Supabase. Los datos se guardarán en una base de datos real en la nube.

## 🔍 Verificar en Supabase

1. Ve a tu proyecto en Supabase
2. Abre **Table Editor**
3. Deberías ver la tabla `users`
4. Después de ejecutar `npm run db:test`, verás un usuario de prueba

## 📚 Próximos pasos

Ahora puedes:

1. **Agregar más tablas** para vehículos, consumo de combustible, etc.
2. **Implementar autenticación** usando Supabase Auth
3. **Agregar Row Level Security (RLS)** para proteger los datos
4. **Usar Supabase Storage** para guardar imágenes

## ❓ Problemas comunes

### "DATABASE_URL is not set"
- Verifica que el archivo `.env` existe
- Asegúrate de que la variable `DATABASE_URL` está correctamente escrita

### "Error: connect ECONNREFUSED"
- Verifica que la cadena de conexión es correcta
- Asegúrate de que reemplazaste `[PASSWORD]` con tu contraseña real
- Verifica que tu proyecto de Supabase está activo

### "relation 'users' does not exist"
- Ejecuta `npm run db:push` para crear las tablas
- O créalas manualmente en el SQL Editor

## 📞 Ayuda

Si tienes problemas:
1. Revisa la [documentación de Supabase](https://supabase.com/docs)
2. Verifica que tu proyecto esté activo en el dashboard
3. Asegúrate de que la contraseña en `.env` sea correcta
