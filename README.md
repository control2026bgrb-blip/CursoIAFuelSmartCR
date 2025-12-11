# FuelSmart CR 🚗⛽

> **Aplicación inteligente para el control de combustible en Costa Rica**  
> Desarrollada como prueba de concepto con asistencia de IA

## 🎯 ¿Qué es FuelSmart CR?

FuelSmart CR es una aplicación web moderna que ayuda a conductores y empresas en Costa Rica a controlar y optimizar sus gastos de combustible. El proyecto demuestra cómo la IA puede acelerar dramáticamente el desarrollo de software, reduciendo 6 semanas de trabajo a 3 horas.

### Problema que Resuelve
- **Falta de control** en gastos de combustible (hasta 30% de sobrecostos)
- **Pérdida de documentos** y recibos importantes
- **Desconocimiento** de patrones de consumo y eficiencia
- **Dificultad** para optimizar rutas y horarios de carga

### Solución Propuesta
- **Registro automático** via OCR de recibos y códigos QR
- **Análisis inteligente** de patrones de consumo
- **Alertas personalizadas** de precios y mantenimiento
- **Gamificación** para incentivar conducción eficiente

## 🚀 Demo en Vivo

**URL**: [https://tu-app.vercel.app](https://tu-app.vercel.app)

### Funcionalidades Implementadas ✅
- Sistema completo de usuarios (registro/login)
- Gestión de vehículos (agregar, editar, eliminar)
- Configuración de preferencias y notificaciones
- Base de datos persistente en Supabase
- Despliegue en producción con Vercel

### Mockups/Prototipos 🎨
- Captura OCR de recibos de gasolina
- Análisis de consumo con gráficos interactivos
- Sistema de gamificación y logros
- Integración con APIs de gasolineras

## 🛠️ Stack Tecnológico

```
Frontend:  React + TypeScript + Vite + Tailwind CSS
Backend:   Node.js + Express (Serverless)
Database:  Supabase (PostgreSQL)
ORM:       Drizzle con migraciones automáticas
Deploy:    Vercel
UI:        Shadcn/ui components
```

## 📊 Impacto de la IA en el Desarrollo

| Aspecto | Tradicional | Con IA | Mejora |
|---------|-------------|--------|---------|
| **Tiempo total** | 6-8 semanas | 3 horas | **95% más rápido** |
| **Configuración inicial** | 4-6 horas | 30 min | 90% más rápido |
| **APIs y base de datos** | 1-2 semanas | 2-3 horas | 85% más rápido |
| **Interfaces de usuario** | 3-4 días | 4-5 horas | 80% más rápido |
| **Calidad del código** | Variable | Empresarial | Consistente |

## 🏃‍♂️ Inicio Rápido

### Prerrequisitos
- Node.js 18+
- Cuenta en Supabase
- Cuenta en Vercel (para deploy)

### Instalación Local
```bash
# Clonar repositorio
git clone [url-del-repo]
cd fuelsmartcr

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# Ejecutar en desarrollo
npm run dev
```

### Despliegue en Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod

# Configurar variables de entorno en Vercel dashboard
```

## 📁 Estructura del Proyecto

```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes UI reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── lib/           # Configuración API y utilidades
│   │   └── hooks/         # Custom React hooks
├── api/                   # Backend serverless (Vercel)
├── server/                # Servidor de desarrollo local
├── shared/                # Esquemas y tipos compartidos
├── docs/                  # Documentación completa
└── migrations/            # Migraciones de base de datos
```

## 📚 Documentación

- **[Presentación Completa](docs/presentacion-completa.md)** - Slides para presentar el proyecto
- **[Resumen Técnico](docs/resumen-tecnico.md)** - Detalles de arquitectura y APIs
- **[Guía de Desarrollo con IA](docs/guia-desarrollo-ia.md)** - Lecciones aprendidas
- **[Migraciones de BD](docs/migraciones.md)** - Configuración de base de datos

## 🎯 Roadmap

### Fase 1 (Meses 1-3): MVP Funcional
- [ ] Implementar OCR real para recibos
- [ ] Sistema de análisis de consumo
- [ ] Alertas inteligentes por email/SMS
- [ ] Integración con 2-3 gasolineras

### Fase 2 (Meses 4-6): Inteligencia
- [ ] Análisis predictivo con IA
- [ ] Recomendaciones de rutas optimizadas
- [ ] Sistema de gamificación completo
- [ ] App móvil (React Native)

### Fase 3 (Meses 7-12): Escalamiento
- [ ] Módulo empresarial para flotas
- [ ] Marketplace de servicios automotrices
- [ ] Integración con seguros y bancos
- [ ] Expansión regional (Centroamérica)

## 💰 Modelo de Negocio

### Freemium Individual
- **Básico**: Gratis (1 vehículo, funciones básicas)
- **Premium**: ₡2,500/mes (vehículos ilimitados, IA avanzada)

### Suscripción Empresarial
- **Pequeña**: ₡15,000/mes (hasta 10 vehículos)
- **Mediana**: ₡35,000/mes (hasta 50 vehículos)
- **Enterprise**: Personalizado (50+ vehículos)

## 🤝 Contribuir

Este es un proyecto de prueba de concepto, pero las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

## 📞 Contacto

- **Email**: [tu-email@ejemplo.com]
- **LinkedIn**: [tu-perfil-linkedin]
- **Demo**: [https://tu-app.vercel.app]

---

**🚀 FuelSmart CR - Transformando el control de combustible en Costa Rica con el poder de la IA**