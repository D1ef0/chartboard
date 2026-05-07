# Frontend — Análisis de datos con IA

Interfaz web para análisis de datos asistido por IA. El usuario sube un archivo CSV o XLSX, opcionalmente escribe una instrucción para el analista, un modelo de lenguaje analiza las columnas y devuelve sugerencias de visualización, y el usuario compone un dashboard interactivo con gráficos.

Soporta español e inglés con selección por URL (`/es`, `/en`). Totalmente responsiva (mobile y desktop).

---

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| React | 19.2.5 | UI |
| React Router | 7.15.0 | Framework (SPA mode + routing) |
| TypeScript | 5.9.3 | Tipado estático |
| TailwindCSS | 4.2.2 | Estilos |
| i18next + react-i18next | — | Internacionalización (ES / EN) |
| Zustand | 5.0.13 | Estado global del cliente |
| TanStack React Query | 5.100.9 | Caché de datos de gráficos |
| Recharts | 3.8.1 | Renderizado de gráficos |
| Framer Motion | 12.38.0 | Animaciones |
| React Dropzone | 15.0.0 | Zona de arrastre para archivos |
| Vite | 8.0.3 | Bundler (vía plugin de React Router) |

---

## Estructura

```
front/
├── app/
│   ├── root.tsx                    # Layout raíz, provider de React Query
│   ├── routes.ts                   # Declaración de rutas
│   ├── app.css                     # Estilos globales (Tailwind + tokens CSS)
│   ├── i18n/
│   │   ├── index.ts                # Init i18next sincrónico (lee lang desde URL)
│   │   └── locales/
│   │       ├── es.json             # Traducciones español
│   │       └── en.json             # Traducciones inglés
│   ├── routes/
│   │   ├── index.tsx               # / → redirect a /es
│   │   ├── lang-layout.tsx         # /:lang — valida idioma, sincroniza i18n
│   │   └── home.tsx                # /:lang/ — flujo completo de la app
│   ├── components/
│   │   ├── shell/
│   │   │   └── StatusBar.tsx       # Barra de estado + switcher ES/EN
│   │   ├── upload/
│   │   │   ├── FileUploader.tsx    # Zona drag-and-drop (CSV / XLSX, máx. 10 MB)
│   │   │   ├── LoadingState.tsx    # Indicador de progreso animado
│   │   │   └── PromptInput.tsx     # Instrucción opcional al analista + presets
│   │   ├── analysis/
│   │   │   ├── SuggestionsGrid.tsx # Grid de tarjetas de sugerencias + side rail
│   │   │   └── SuggestionCard.tsx  # Tarjeta individual de sugerencia
│   │   └── dashboard/
│   │       ├── DashboardGrid.tsx   # Grid de gráficos activos
│   │       ├── ChartRenderer.tsx   # Selector de componente según chart_type
│   │       └── charts/
│   │           ├── BarChartComponent.tsx
│   │           ├── LineChartComponent.tsx
│   │           ├── PieChartComponent.tsx
│   │           └── ScatterChartComponent.tsx
│   ├── lib/
│   │   ├── api.ts                  # Funciones fetch hacia la API backend
│   │   ├── store.ts                # Store de Zustand (file_id, sugerencias, gráficos activos)
│   │   └── utils.ts                # Helpers: cn(), formatNumber(), CHART_COLORS
│   └── types/
│       └── index.ts                # Interfaces TypeScript compartidas
├── public/
│   └── sample.csv                  # Dataset de ejemplo (100 filas, ventas 2024)
├── .env.example
├── Dockerfile
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Variables de entorno

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

| Variable | Requerida | Descripción |
|---|---|---|
| `VITE_API_URL` | No | URL base de la API (default: `http://localhost:8000`) |

---

## Desarrollo local

### Requisitos previos

- Node.js 20 o superior
- npm 10 o superior
- La API backend corriendo en `http://localhost:8000` (ver `../api/README.md`)

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno (opcional, el default apunta a localhost:8000)
cp .env.example .env

# 3. Levantar el servidor de desarrollo con HMR
npm run dev
```

La app queda disponible en `http://localhost:5173`.

Por defecto redirige a `/es`. Para probar en inglés: `http://localhost:5173/en`.

### Otros comandos

```bash
# Verificar tipos TypeScript
npm run typecheck

# Build de producción
npm run build

# Servir el build localmente
npm run start
```

---

## Producción con Docker

El Dockerfile hace un build en dos etapas: compila los assets con Node 20 y sirve la carpeta estática con `serve`.

```bash
# Construir la imagen
docker build -t app-front .

# Correr el contenedor
docker run -p 3000:3000 app-front
```

Si la API no está en `localhost:8000`, pasa la variable en tiempo de build (Vite la embebe en el bundle):

```bash
docker build --build-arg VITE_API_URL=https://api.tu-dominio.com -t app-front .
```

La variable `PORT` del CMD permite cambiar el puerto sin reconstruir:

```bash
docker run -p 4000:4000 -e PORT=4000 app-front
```

---

## Flujo de la aplicación

```
1. FileUploader   →  POST /api/upload    →  guarda file_id en Zustand
2. PromptInput    →  instrucción opcional del usuario (o skip)
3. SuggestionsGrid →  POST /api/analyze  →  muestra tarjetas de sugerencias
4. SuggestionCard →  POST /api/chart-data →  agrega datos y renderiza gráfico
5. DashboardGrid  →  compone el dashboard con los gráficos fijados
```

## Internacionalización

El idioma se selecciona a nivel de URL. La raíz `/` redirige automáticamente a `/es`.

| URL | Idioma |
|---|---|
| `/es` | Español |
| `/en` | Inglés |

El switcher ES / EN en la barra de estado navega entre idiomas sin recargar la página ni perder el estado de la sesión.
