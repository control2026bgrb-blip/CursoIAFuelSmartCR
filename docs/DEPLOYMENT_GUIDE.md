# 🚀 Guía de Despliegue - FuelSmart CR

## ✅ Estado del Proyecto
**¡Tu proyecto ya está completamente configurado para Vercel!**

### Archivos de Configuración Listos:
- ✅ `vercel.json` - Configuración optimizada para Vercel
- ✅ `package.json` - Scripts de build y despliegue
- ✅ `.vercelignore` - Archivos a excluir del despliegue
- ✅ `.env.example` - Template de variables de entorno
- ✅ Build script optimizado para producción

## 📋 Preparación para Despliegue

### 1. Scripts Configurados

Tu `package.json` ya tiene los scripts necesarios:

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "tsx script/build.ts",
    "start": "NODE_ENV=production node dist/index.cjs",
    "postinstall": "npm run build",
    "vercel-build": "npm run build"
  }
}
```

### 2. Variables de Entorno Requeridas

```env
DATABASE_URL=postgresql://postgres.mbrosledywcjzfngxvul:PasadoPresente25@aws-0-us-west-2.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://mbrosledywcjzfngxvul.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1icm9zbGVkeXdjanpmbmd4dnVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4Nzc2MTIsImV4cCI6MjA4MDQ1MzYxMn0.fPkY-oBPYS_g9Nq2Pjhgeva4k2UbnIYb2_4a9FxB9gY
SESSION_SECRET=fuelsmart-cr-production-secret-2025
NODE_ENV=production
PORT=5000
```

---

## 🌟 Opción 1: Vercel (Recomendado)

### ✅ Por qué Vercel:
- Más fácil de configurar
- Despliegue automático desde GitHub
- SSL gratis
- CDN global
- Soporte nativo para Node.js + React

### 📋 Pasos Detallados:

#### 1. Subir a GitHub
```bash
# En tu terminal, dentro del proyecto:
git init
git add .
git commit -m "FuelSmart CR - Ready for deployment"
git branch -M main

# Crear repo en GitHub y conectar:
git remote add origin https://github.com/TU_USUARIO/fuelsmart-cr.git
git push -u origin main
```

#### 2. Configurar Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Click "Sign up" con GitHub
3. Click "New Project"
4. Importa tu repositorio `fuelsmart-cr`
5. Vercel detectará automáticamente la configuración

#### 3. Configurar Variables de Entorno
En el dashboard de Vercel:
1. Ve a tu proyecto
2. Settings → Environment Variables
3. Agrega cada variable:

```
DATABASE_URL = postgresql://postgres.mbrosledywcjzfngxvul:PasadoPresente25@aws-0-us-west-2.pooler.supabase.com:6543/postgres
SUPABASE_URL = https://mbrosledywcjzfngxvul.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1icm9zbGVkeXdjanpmbmd4dnVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4Nzc2MTIsImV4cCI6MjA4MDQ1MzYxMn0.fPkY-oBPYS_g9Nq2Pjhgeva4k2UbnIYb2_4a9FxB9gY
SESSION_SECRET = fuelsmart-cr-production-secret-2025
NODE_ENV = production
```

#### 4. Deploy
1. Click "Deploy"
2. Espera 2-3 minutos
3. ¡Tu app estará en línea!

**URL final:** `https://fuelsmart-cr-tu-usuario.vercel.app`

---

## 🚂 Opción 2: Railway

### ✅ Por qué Railway:
- $5 USD gratis al mes
- Muy bueno para aplicaciones Node.js
- Fácil configuración
- Logs en tiempo real

### 📋 Pasos:

#### 1. Subir a GitHub (igual que Vercel)

#### 2. Configurar Railway
1. Ve a [railway.app](https://railway.app)
2. "Login with GitHub"
3. "New Project" → "Deploy from GitHub repo"
4. Selecciona tu repositorio

#### 3. Configurar Variables
1. Ve a tu proyecto en Railway
2. Variables tab
3. Agrega las mismas variables de entorno

#### 4. Deploy Automático
Railway desplegará automáticamente y te dará una URL.

---

## 🎨 Opción 3: Render

### ✅ Por qué Render:
- Plan gratuito generoso
- SSL automático
- Buena documentación

### 📋 Pasos:

#### 1. Subir a GitHub (igual que anteriores)

#### 2. Configurar Render
1. Ve a [render.com](https://render.com)
2. "Get Started for Free"
3. Conecta GitHub
4. "New Web Service"
5. Selecciona tu repo

#### 3. Configuración del Servicio
```
Name: fuelsmart-cr
Environment: Node
Build Command: npm install && npm run build
Start Command: npm start
```

#### 4. Variables de Entorno
Agrega las mismas variables en la sección "Environment"

---

## 🔧 Configuraciones Adicionales

### Crear archivo vercel.json (para Vercel)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "server/index.ts"
    }
  ]
}
```

### Actualizar .gitignore
```
node_modules
dist
.DS_Store
server/public
vite.config.ts.*
*.tar.gz

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
build/
.vercel/
```

---

## 🎯 Recomendación Final

**Para tu caso, recomiendo Vercel porque:**

1. ✅ **Más fácil**: Configuración automática
2. ✅ **Gratis**: Plan generoso sin límites estrictos
3. ✅ **Rápido**: Despliegue en minutos
4. ✅ **Confiable**: Usado por millones de desarrolladores
5. ✅ **Automático**: Cada push a GitHub despliega automáticamente

---

## 📱 Después del Despliegue

### Crear Admin en Producción
Una vez desplegado, ejecuta:
```bash
# En tu terminal local, apuntando a producción:
DATABASE_URL=tu_url_de_produccion npm run admin:create
```

### Probar la Aplicación
1. Ve a tu URL de producción
2. Login con:
   - Usuario: `Administrador`
   - Contraseña: `administrador2025`
3. ¡Listo!

---

## 🆘 Solución de Problemas

### Error de Build
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que `npm run build` funcione localmente

### Error de Variables de Entorno
- Verifica que todas las variables estén configuradas
- No incluyas espacios extra en los valores

### Error de Base de Datos
- Verifica que la URL de Supabase sea correcta
- Asegúrate de que Supabase permita conexiones desde cualquier IP

---

**¡Con esta guía tendrás tu FuelSmart CR en línea en menos de 30 minutos!** 🚀