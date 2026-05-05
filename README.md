# Aulix Frontend

Frontend de **Aulix**, una plataforma de aprendizaje online para explorar cursos, registrarse, matricularse, ver contenido y llevar seguimiento del progreso de las lecciones.

Este proyecto forma parte de una aplicación full-stack personal construida con un enfoque serio de producto. El backend se desarrolla con **Spring Boot** y expone la API consumida por este frontend.

## Stack

- Next.js 16 con App Router
- React 19
- TypeScript
- Tailwind CSS 4
- TanStack React Query
- Zustand
- Axios
- React Hook Form
- Zod
- Sonner
- Lucide React
- React Player

## Requisitos

- Node.js 20 o superior recomendado
- npm
- Backend de Aulix ejecutándose localmente o una URL remota compatible

## Configuración

Crea un archivo `.env.local` en la raíz del proyecto con la URL del backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Si no se define esta variable, la aplicación usa por defecto:

```txt
http://localhost:8000/api
```

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

La aplicación queda disponible en:

```txt
http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Estructura Principal

```txt
src/
├─ app/                 Rutas y layouts de Next.js
├─ components/          Componentes reutilizables de dominio, layout y UI
├─ hooks/               Lógica de autenticación, cursos, matrícula y progreso
├─ lib/                 Cliente API, auth, React Query y utilidades
├─ store/               Estado global con Zustand
├─ types/               Tipos compartidos del dominio
└─ proxy.ts             Protección básica de rutas autenticadas
```

Dentro de `components/` se separan responsabilidades por contexto:

- `components/layout`: navegación y proveedores globales.
- `components/ui`: componentes base como botones e inputs.
- `components/courses`: tarjetas, acordeones, navegación de lecciones y piezas del reproductor de cursos.

## Funcionalidades

- Landing page pública
- Registro e inicio de sesión
- Catálogo de cursos
- Detalle público de curso
- Matrícula en cursos
- Dashboard de cursos del estudiante
- Reproductor de lecciones
- Seguimiento de progreso por lección
- Notificaciones toast para acciones principales

## Colores Y Temas

Los colores de marca están centralizados en `src/app/globals.css` como variables CSS y expuestos a Tailwind mediante `@theme inline`.

Tokens principales:

- `brand`: color primario de la plataforma.
- `brand-accent`: color secundario para gradientes y acentos visuales.
- `success`, `danger` y `warning`: colores semánticos para estados.

Ejemplos de uso en componentes:

```tsx
className="bg-brand-600 text-white hover:bg-brand-700"
className="bg-gradient-to-br from-brand-900 to-brand-accent-900"
className="text-danger-600"
```

Para soportar temas o personalización por tenant, la idea es cambiar los valores de las variables `--brand-*` y `--brand-accent-*` sin reemplazar clases en los componentes.

## API Esperada

El frontend consume endpoints relacionados con:

- Autenticación: login y registro
- Cursos publicados
- Matrículas del usuario
- Progreso de lecciones

La URL base se configura con `NEXT_PUBLIC_API_URL`.

## Notas Del Proyecto

- La autenticación actual usa JWT almacenado en cliente y una cookie para proteger rutas desde `proxy.ts`.
- React Query administra caché, reintentos e invalidación de datos remotos.
- Tailwind CSS concentra la mayor parte del diseño directamente en los componentes.
- El proyecto está orientado inicialmente a un MVP, pero con intención de evolucionar hacia una aplicación mantenible y robusta.
