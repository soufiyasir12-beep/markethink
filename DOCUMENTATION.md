# 📖 MarkeThink — Documentación de la Plataforma

¡Bienvenido a **MarkeThink**, la plataforma avanzada de automatización agéntica de marketing! Este documento contiene la guía técnica, arquitectura y especificaciones funcionales del proyecto, centrándose especialmente en el **Dashboard** y su interacción en tiempo real.

---

## 🚀 1. Descripción General del Proyecto

MarkeThink es un ecosistema diseñado para conectar **agentes autónomos de Inteligencia Artificial (IA)** (que generan campañas y recursos multimedia de marketing) con un **Dashboard interactivo premium** donde los equipos de marketing digital pueden supervisar, editar y aprobar dichos recursos antes de su publicación final.

---

## 🛠️ 2. Arquitectura Tecnológica (Stack)

La plataforma está construida utilizando tecnologías modernas de desarrollo web:

1. **Frontend**:
   - **Next.js 15 (App Router)**: Renderizado optimizado y arquitectura de componentes de servidor/cliente.
   - **TypeScript**: Tipado estricto y prevención de errores en compilación.
   - **Tailwind CSS v4**: Estilos e interfaces de usuario rápidos con configuraciones nativas basadas en CSS.
   - **Framer Motion**: Animaciones fluidas, transiciones de páginas e interacciones premium de micro-feedback.
   - **@dnd-kit/core**: Sistema drag-and-drop accesible y nativo de alto rendimiento para el Kanban.

2. **Backend**:
   - **Supabase**: Base de datos Postgres relacional, autenticación de usuarios y suscripción WebSocket en tiempo real.

---

## 🗄️ 3. Modelo de Datos y Base de Datos (Supabase)

El esquema relacional consta de dos tablas principales ubicadas en el esquema `public`:

### 3.1 Tabla `campaigns` (Campañas)
Almacena el contexto principal de cada campaña de marketing.

| Campo | Tipo | Restricciones / Valor por defecto | Descripción |
|---|---|---|---|
| `id` | UUID | `gen_random_uuid()` (Primary Key) | Identificador único de la campaña. |
| `title` | VARCHAR(255) | `NOT NULL` | Título descriptivo de la campaña. |
| `brand_name` | VARCHAR(100) | `NOT NULL` | Nombre de la marca asociada. |
| `briefing` | TEXT | `NULLABLE` | Contexto inicial de la campaña para la IA. |
| `status` | VARCHAR(50) | `'pending_review'` (Check: `pending_review`, `approved`, `published`) | Estado en el flujo de trabajo. |
| `created_at` | TIMESTAMPTZ | `timezone('utc'::text, now()) NOT NULL` | Fecha de creación. |

### 3.2 Tabla `marketing_assets` (Recursos)
Almacena los recursos multimedia (copys, banners, videos, landings) generados por el agente de IA para cada campaña.

| Campo | Tipo | Restricciones / Valor por defecto | Descripción |
|---|---|---|---|
| `id` | UUID | `gen_random_uuid()` (Primary Key) | Identificador único del recurso. |
| `campaign_id` | UUID | `NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE` | Llave foránea que asocia el recurso a su campaña. |
| `asset_type` | VARCHAR(50) | `NOT NULL` (Check: `landing_page`, `reel_vertical`, `banner`, `yt_long`) | Categoría del recurso. |
| `title` | VARCHAR(255) | `NULLABLE` | Título del recurso individual. |
| `copy_text` | TEXT | `NULLABLE` | Texto descriptivo, copys para redes o guiones de video. |
| `drive_url` | TEXT | `NULLABLE` | URL pública de Google Drive para imágenes/videos. |
| `vercel_url` | TEXT | `NULLABLE` | URL opcional para previsualización directa de landings desplegadas. |
| `created_at` | TIMESTAMPTZ | `timezone('utc'::text, now()) NOT NULL` | Fecha de creación del recurso. |

---

## 🔒 4. Seguridad y Row Level Security (RLS)

Para garantizar que los datos estén completamente protegidos, RLS está habilitado en ambas tablas:

* **Acceso de Usuarios (Dashboard)**: Los usuarios finales se autentican mediante **Supabase Auth** (Email/Password). Tienen políticas activas que les permiten leer e interactuar (actualizar copies, cambiar estados) únicamente si están autenticados.
* **Acceso del Agente de IA**: El orquestador o agente externo realiza las inserciones y las actualizaciones masivas de forma automatizada mediante la API Key `service_role` de Supabase, la cual se salta de forma nativa las restricciones de RLS y garantiza un canal seguro server-to-server.

---

## 🖥️ 5. Módulos y Diseño del Dashboard

El Dashboard se encuentra en la ruta `/dashboard` (protegida por el middleware de Supabase). Consta de las siguientes partes clave coordinadas por el componente cliente `DashboardShell`:

```
+-------------------------------------------------------------+
|  LOGO  |  Breadcrumb / Tablero Kanban       [En Tiempo Real] |
|        +----------------------------------------------------+
|  Menu  |  PENDIENTE DE REVISIÓN | APROBADO | PUBLICADO     |
|  - Dnd |  +-------------------+ +--------+ +-------------+ |
|  - List|  | Card Campaña A    | | Card B | | Card C      | |
|  - Lib |  | - Brand Badge     | |        | |             | |
|  - Sett|  | - Asset Tags      | |        | |             | |
|        |  +-------------------+ +--------+ +-------------+ |
| Profile|                                                    |
+-------------------------------------------------------------+
```

### 5.1 Barra de Navegación Lateral (Sidebar)
* **Diseño**: Colapsable dinámicamente con transiciones animadas.
* **Secciones**:
  * **Tablero Kanban**: Flujo de trabajo visual con drag-and-drop.
  * **Campañas (Lista)**: Vista tabular clásica y compacta de campañas.
  * **Biblioteca de Assets**: Galería filtrada de todos los recursos generados ordenados por tipo de contenido.
  * **Configuración**: Muestra credenciales del proyecto e instrucciones para integrar agentes externos.
* **Perfil de Usuario**: Muestra el email del agente logueado y un botón de cierre de sesión al pie.

### 5.2 Cabecera Dinámica (Header)
Muestra breadcrumbs contextuales del menú activo y un **indicador de conexión WebSocket en tiempo real** que pulsa en verde cuando se establece el canal con la base de datos de Supabase.

### 5.3 Tablero Kanban con Drag & Drop
* **Flujo**: Tres columnas con contadores dinámicos actualizados en tiempo real.
* **Interacción**: Arrastrar una tarjeta de campaña a otra columna actualiza de inmediato el campo `status` en la base de datos mediante una petición PATCH de Supabase.
* **Animaciones**: Las tarjetas se recolocan suavemente mediante transiciones de física de resortes (`spring` de Framer Motion) al soltarse o al actualizarse externamente.

### 5.4 Panel de Detalles (Campaign Drawer)
Al hacer clic sobre una campaña, se desliza desde el lateral derecho un drawer con:
* **Ficha de la Campaña**: Título, marca, estado actual e historial.
* **Briefing**: Descripción del objetivo de marketing configurado para la IA.
* **Recursos Generados**: Listado de tarjetas de recursos individuales con acciones específicas:
  * **Aprobación individual**: Control de flujo del recurso.
  * **Previsualización en tiempo real**: Botón para abrir el preview.

### 5.5 Edición de Copies Inline en Caliente
Dentro del Drawer de Campaña, cualquier texto de copy o descripción se puede editar en caliente:
1. El usuario hace clic sobre el texto descriptivo.
2. Este se transforma instantáneamente en un cuadro de texto (`textarea`).
3. Al modificar el texto y pulsar **"Guardar"**, se realiza un UPDATE asíncrono a Supabase y se actualiza el estado local en milisegundos.

### 5.6 Previsualización Adaptativa (Preview System)
El componente `PreviewModal` renderiza un visor a pantalla completa adaptándose según el tipo de recurso seleccionado:
* **landing_page**: Utiliza un `<iframe>` para cargar interactivamente el sitio web configurado en `vercel_url`.
* **banner**: Renderiza una etiqueta `<img>` cargando la imagen directamente a través del conversor de Drive.
* **reel_vertical** y **yt_long**: Monta un reproductor `<video>` con controles nativos HTML5 reproduciendo la URL directa.

### 5.7 Conversor de Enlaces de Google Drive
Los agentes inyectan enlaces estándar de compartir de Google Drive. La utilidad `src/lib/utils/drive.ts` se encarga de:
1. Extraer el ID único del archivo mediante expresiones regulares.
2. Devolver la URL del CDN de Google para renderizado directo:
   * **Imágenes**: `https://lh3.googleusercontent.com/d/{ID}`
   * **Vídeos**: `https://docs.google.com/uc?export=download&id={ID}`

---

## 📡 6. Flujo de Datos y Suscripción Realtime

El dashboard escucha la base de datos de Supabase constantemente por WebSockets:

1. **INSERT/UPDATE/DELETE en `campaigns`**:
   - El dashboard añade la nueva tarjeta al Kanban automáticamente sin refrescar la página.
   - Dispara una notificación tipo Toast emergente en la esquina inferior derecha: `"Nueva campaña creada por la IA"`.
2. **INSERT/UPDATE/DELETE en `marketing_assets`**:
   - Agrega o actualiza instantáneamente los recursos embebidos dentro de cada campaña.
   - Dispara una notificación tipo Toast informando del recurso generado por la IA (ej. `"Nuevo asset generado: banner"`).

---

## 🚀 7. Guía de Despliegue en Vercel

1. **Preparación**: Sube el código a tu repositorio de GitHub.
2. **Importar a Vercel**:
   - Conéctate a Vercel, haz clic en **"Add New"** → **"Project"** y selecciona tu repositorio `markethink`.
3. **Variables de Entorno**:
   - Durante la configuración del proyecto en Vercel, copia los valores de tu `.env.local` e introduce:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Desplegar**: Haz clic en **"Deploy"**. Vercel compilará la aplicación y la desplegará bajo un subdominio `.vercel.app` listo para producción.
