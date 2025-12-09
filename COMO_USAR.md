# 🚀 Cómo Usar FuelSmart CR

## 📋 Guía Rápida de Inicio

### 1. Iniciar la Aplicación

```bash
npm run dev
```

El servidor se iniciará en: **http://localhost:5000**

---

## 🔐 Primer Uso

### Paso 1: Acceder a la Aplicación

1. Abre tu navegador
2. Ve a: **http://localhost:5000**
3. Serás redirigido automáticamente a la página de login

### Paso 2: Crear una Cuenta

1. En la página de login, haz click en la pestaña **"Registrarse"**
2. Completa el formulario:
   - **Usuario**: Elige un nombre de usuario único
   - **Correo**: Tu email (opcional)
   - **Nombre Completo**: Tu nombre (opcional)
   - **Contraseña**: Elige una contraseña segura
3. Haz click en **"Crear Cuenta"**
4. ¡Listo! Serás redirigido al dashboard

### Paso 3: Explorar el Dashboard

Una vez dentro, verás:
- **Panel Principal**: Estadísticas de consumo
- **Sidebar**: Menú de navegación
- **Header**: Toggle de tema y menú

---

## 📱 Funcionalidades Disponibles

### 🚗 Gestión de Vehículos

**Agregar un Vehículo:**
1. En el dashboard, busca el botón **"Agregar"** en la sección "Mis Vehículos"
2. Completa la información:
   - Nombre del vehículo
   - Placa
   - Tipo (gasolina, diésel, eléctrico, híbrido)
   - Marca y modelo
   - Año
   - Capacidad del tanque
3. Guarda el vehículo

**Ver Vehículos:**
- Todos tus vehículos aparecen en el dashboard
- Click en un vehículo para ver detalles

### ⛽ Registrar Combustible

**Agregar un Registro:**
1. Ve a **"Agregar Registro"** en el menú
2. Selecciona el método de ingreso:
   - **OCR**: Escanea un recibo (próximamente)
   - **QR**: Escanea código QR (próximamente)
   - **OBD**: Conecta dispositivo OBD-II (próximamente)
   - **Manual**: Ingresa datos manualmente
3. Completa el formulario:
   - Vehículo
   - Fecha
   - Litros
   - Precio por litro
   - Total
   - Kilometraje
   - Gasolinera
4. Guarda el registro
5. **¡Recibirás 10 puntos automáticamente!**

### 🎮 Sistema de Gamificación

**Ver tus Puntos:**
1. Ve a **"Gamificación"** en el menú
2. Verás:
   - Puntos totales
   - Nivel actual
   - Racha de días
   - Tabla de clasificación

**Ganar Puntos:**
- +10 puntos por cada registro de combustible
- Puntos adicionales por conducción eficiente
- Bonos por rachas consecutivas

**Subir de Nivel:**
- Nivel 1: 0-199 puntos
- Nivel 2: 200-399 puntos
- Nivel 3: 400-599 puntos
- Y así sucesivamente...

**Canjear Recompensas:**
1. Ve a la sección de recompensas
2. Selecciona una recompensa
3. Verifica que tengas puntos suficientes
4. Haz click en **"Canjear"**
5. Tus puntos se deducirán automáticamente

### 🔔 Alertas

**Ver Alertas:**
1. Ve a **"Alertas"** en el menú
2. Verás todas tus alertas ordenadas por fecha
3. Las alertas no leídas aparecen destacadas

**Tipos de Alertas:**
- **Anomalías**: Consumo inusual detectado
- **Mantenimiento**: Recordatorios de servicio
- **Precios**: Alertas de precios bajos
- **Consejos**: Tips de eco-conducción
- **Predicciones**: Análisis predictivo con IA

**Marcar como Leída:**
- Click en una alerta para marcarla como leída

### 🏪 Marketplace

**Buscar Gasolineras:**
1. Ve a **"Marketplace"** en el menú
2. Verás gasolineras cercanas
3. Compara precios
4. Navega a la gasolinera seleccionada

**Información Disponible:**
- Nombre de la gasolinera
- Dirección
- Precio actual
- Distancia
- Calificación

### 🚛 Modo Flota

**Crear una Flota:**
1. Ve a **"Modo Flota"** en el menú
2. Click en **"Crear Flota"**
3. Ingresa nombre y descripción
4. Agrega vehículos a la flota

**Gestionar Flota:**
- Ver análisis consolidado
- Comparar eficiencia entre vehículos
- Generar reportes

---

## 🎯 Consejos y Trucos

### Maximizar Puntos

1. **Registra Regularmente**
   - Cada registro = 10 puntos
   - Mantén una racha diaria

2. **Conduce Eficientemente**
   - Reduce aceleraciones bruscas
   - Mantén velocidad constante
   - Planifica tus rutas

3. **Completa Desafíos**
   - Revisa desafíos semanales
   - Completa objetivos especiales

### Ahorrar Combustible

1. **Monitorea tu Consumo**
   - Revisa gráficos de consumo
   - Identifica patrones

2. **Compara Precios**
   - Usa el marketplace
   - Carga cuando los precios bajen

3. **Mantén tu Vehículo**
   - Registra mantenimientos
   - Sigue recomendaciones

### Usar Alertas

1. **Configura Preferencias**
   - Activa alertas importantes
   - Desactiva las que no necesites

2. **Actúa Rápido**
   - Revisa alertas diariamente
   - Responde a anomalías

---

## 🔧 Funciones Avanzadas

### API para Desarrolladores

Si eres desarrollador, puedes usar la API:

**Documentación**: Ver `API_DOCUMENTATION.md`

**Base URL**: `http://localhost:5000/api`

**Ejemplo de Uso:**
```javascript
// Login
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'tu_usuario',
    password: 'tu_contraseña'
  }),
  credentials: 'include'
})
```

### Exportar Datos

(Próximamente)
- Exportar registros a CSV
- Generar reportes PDF
- Sincronizar con otras apps

---

## ❓ Preguntas Frecuentes

### ¿Cómo cambio mi contraseña?
Actualmente no hay opción de cambio de contraseña. Próximamente en configuración.

### ¿Puedo usar la app en mi móvil?
Sí, la interfaz es responsive y funciona en móviles.

### ¿Mis datos están seguros?
Sí, las contraseñas están hasheadas y los datos están en Supabase con encriptación.

### ¿Puedo tener múltiples vehículos?
Sí, puedes agregar todos los vehículos que quieras.

### ¿Cómo funciona el sistema de puntos?
- Cada registro de combustible = 10 puntos
- Los puntos se acumulan automáticamente
- Usa puntos para canjear recompensas

### ¿Qué pasa si pierdo mi sesión?
Las sesiones duran 24 horas. Después deberás iniciar sesión nuevamente.

### ¿Puedo eliminar un registro?
Sí, puedes editar o eliminar cualquier registro que hayas creado.

---

## 🆘 Solución de Problemas

### No puedo iniciar sesión
1. Verifica tu usuario y contraseña
2. Asegúrate de estar registrado
3. Intenta registrarte de nuevo si olvidaste tu contraseña

### No veo mis vehículos
1. Verifica que hayas agregado vehículos
2. Refresca la página (F5)
3. Cierra sesión y vuelve a entrar

### Los puntos no se actualizan
1. Refresca la página
2. Ve a la sección de gamificación
3. Los puntos se actualizan automáticamente al agregar registros

### La página no carga
1. Verifica que el servidor esté corriendo (`npm run dev`)
2. Verifica la URL: http://localhost:5000
3. Limpia caché del navegador

---

## 📞 Soporte

### Documentación Adicional
- **RESUMEN_FINAL.md** - Resumen completo del proyecto
- **API_DOCUMENTATION.md** - Documentación de API
- **DATABASE_SCHEMA.md** - Esquema de base de datos

### Comandos Útiles
```bash
# Iniciar servidor
npm run dev

# Probar API
npm run api:test

# Probar base de datos
npm run db:test

# Sincronizar esquema
npm run db:push
```

---

## 🎉 ¡Disfruta FuelSmart CR!

Ahora estás listo para:
- ✅ Registrar tu consumo de combustible
- ✅ Ganar puntos y subir de nivel
- ✅ Ahorrar dinero con análisis inteligente
- ✅ Reducir tu huella de carbono
- ✅ Gestionar tu flota eficientemente

**¡Feliz conducción eficiente! 🚗💨**

---

**Versión**: 1.0
**Última Actualización**: 4 de diciembre de 2025
**Estado**: ✅ Funcional
