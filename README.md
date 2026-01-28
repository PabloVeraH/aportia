# HelpChain

Sistema de gestión de centros y donaciones (SSR).

## Descripción

HelpChain es una aplicación diseñada para gestionar el flujo de donaciones en múltiples centros operativos. Construida con una arquitectura **Server-Side Rendering (SSR)** para maximizar la compatibilidad, velocidad de carga inicial y SEO (si fuera público), manteniendo una interactividad moderna mediante "Progressive Enhancement".

## Stack Tecnológico

*   **Backend / Server**: [NestJS](https://nestjs.com/) (Node.js)
*   **Templating**: Handlebars (`hbs`)
*   **Estilos**: TailwindCSS (v3)
*   **Base de Datos & Auth**: [Supabase](https://supabase.com/) (Postgres + Auth + Edge Functions)
*   **Arquitectura**: Monolito Modular SSR.

## Requisitos Previos

*   Node.js v18+
*   Cuenta y Proyecto en Supabase

## Configuración

1.  **Clonar el repositorio**:
    ```bash
    git clone <repo-url>
    cd Aportia
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Variables de Entorno**:
    Crea un archivo `.env` en la raíz del proyecto basado en la configuración de Supabase:
    ```env
    PORT=3000
    SUPABASE_URL=https://<tu-proyecto>.supabase.co
    SUPABASE_ANON_KEY=<tu-anon-key>
    ```

## Ejecución

El proyecto requiere dos procesos simultáneos: el servidor NestJS y el compilador de TailwindCSS (en desarrollo).

### Desarrollo
```bash
# Inicia servidor + watcher de estilos
npm run start:dev

# En otra terminal (opcional si start:dev no cubre estilos, pero el script de build lo maneja)
npm run build:css:watch
```

### Producción
```bash
# Compila CSS y TypeScript
npm run build

# Inicia la aplicación
npm run start:prod
```

## Arquitectura del Proyecto

*   `/src/modules`: Módulos de dominio (Auth, Donations, Dashboard).
*   `/src/views`: Plantillas Handlebars.
    *   `/layouts`: `main.hbs` (Dashboard), `auth.hbs` (Login).
    *   `/partials`: Componentes reutilizables (Sidebar, Topbar).
*   `/public`: Assets estáticos y CSS compilado.
*   `/src/common`: Guardias, Interceptores y Filtros globales.

### Seguridad
*   **Auth**: Cookies `HttpOnly` (no accesibles por JS cliente).
*   **CSRF**: Protección habilitada en formularios POST.
*   **Contexto**: Interceptor global inyecta el Centro Activo y Rol del usuario en cada vista.
