# Configuración de Supabase para FuelSmart CR

## Paso 1: Crear un proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta (si no tienes una)
2. Crea un nuevo proyecto
3. Guarda la contraseña de la base de datos que elijas

## Paso 2: Obtener las credenciales de conexión

### Opción A: Connection String (Recomendado)

1. En tu proyecto de Supabase, ve a **Settings** (⚙️) > **Database**
2. En la sección **Connection String**, selecciona la pestaña **URI**
3. Copia la cadena de conexión (se verá así):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
4. Reemplaza `[YOUR-PASSWORD]` con la contraseña que elegiste al crear el proyecto

### Opción B: Connection Pooling (Para producción)

1. En **Settings** > **Database**, ve a **Connection Pooling**
2. Copia la **Connection string** en modo **Transaction**
3. Esta opción es mejor para aplicaciones en producción

## Paso 3: Configurar variables de entorno

1. Abre el archivo `.env` en la raíz del proyecto
2. Reemplaza `DATABASE_URL` con tu cadena de conexión:
   ```env
   DATABASE_URL=postgresql://postgres:tu-password@db.tu-proyecto.supabase.co:5432/postgres
   ```

### Opcional: Configurar Supabase Client

Si quieres usar el cliente de Supabase para autenticación o storage:

1. En **Settings** > **API**, copia:
   - **Project URL**
   - **anon public key**

2. Agrégalos al archivo `.env`:
   ```env
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_ANON_KEY=tu-anon-key
   ```

## Paso 4: Ejecutar migraciones

Hay dos formas de crear las tablas en Supabase:

### Opción A: Usando Drizzle Kit (Recomendado)

```bash
npm run db:push
```

Este comando sincronizará automáticamente tu esquema con Supabase.

### Opción B: Manualmente en Supabase

1. Ve a tu proyecto en Supabase
2. Abre el **SQL Editor**
3. Copia y pega el contenido de `migrations/0000_initial_schema.sql`
4. Ejecuta la consulta

## Paso 5: Verificar la conexión

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Si todo está configurado correctamente, verás el mensaje:
   ```
   serving on port 5000
   ```

3. Verifica en Supabase que la tabla `users` se haya creado:
   - Ve a **Table Editor** en tu proyecto
   - Deberías ver la tabla `users`

## Solución de problemas

### Error: "DATABASE_URL is not set"
- Verifica que el archivo `.env` existe y tiene la variable `DATABASE_URL`
- Asegúrate de que no hay espacios extra en la cadena de conexión

### Error de conexión
- Verifica que la contraseña en `DATABASE_URL` sea correcta
- Asegúrate de que tu IP esté permitida (Supabase permite todas las IPs por defecto)
- Verifica que el proyecto de Supabase esté activo

### Error: "relation 'users' does not exist"
- Ejecuta las migraciones con `npm run db:push`
- O crea la tabla manualmente usando el SQL Editor

## Próximos pasos

Una vez configurado Supabase, puedes:

1. Crear más tablas para vehículos, consumo de combustible, etc.
2. Agregar autenticación con Supabase Auth
3. Usar Supabase Storage para imágenes
4. Implementar Row Level Security (RLS) para seguridad

## Recursos útiles

- [Documentación de Supabase](https://supabase.com/docs)
- [Drizzle ORM con Supabase](https://orm.drizzle.team/docs/get-started-postgresql)
- [Supabase Database](https://supabase.com/docs/guides/database)
