# Movie Database - Arquitectura SOA

Aplicación Next.js con arquitectura orientada a servicios (SOA) que consume la API de películas de devsapihub.com.

## 🏗️ Arquitectura SOA

La aplicación está diseñada con separación de responsabilidades en capas:

### 1. **Capa de Configuración** (`/src/config`)
- `api.config.ts`: Configuración centralizada de la API, endpoints, cache y seguridad

### 2. **Capa de Tipos** (`/src/types`)
- `movie.types.ts`: Interfaces y tipos TypeScript para películas y respuestas de API

### 3. **Capa de Servicios de API** (`/src/services/api`)
- `http-client.service.ts`: Cliente HTTP con:
  - Rate limiting (30 requests/min)
  - Timeout automático (10s)
  - Retry con backoff exponencial
  - Sanitización de entrada
  - Manejo de errores centralizado
- `movie-api.service.ts`: Servicio de acceso a endpoints de películas

### 4. **Capa de Cache** (`/src/services/cache`)
- `cache.service.ts`: Sistema de cache en memoria con TTL de 5 minutos

### 5. **Capa de Lógica de Negocio** (`/src/services/movie`)
- `movie.service.ts`: Lógica de negocio para:
  - Orchestration de servicios
  - Filtrado y ordenamiento
  - Transformación de datos
  - Formateo de fechas e imágenes
  - Validaciones de negocio

### 6. **Capa de Presentación** (`/src/components`)
- Componentes React desacoplados y reutilizables
- `MovieCard`, `MovieGrid`, `MovieFilters`, `Pagination`, `ErrorNotification`

### 7. **Capa de Páginas** (`/src/app`)
- Páginas Next.js que orquestan componentes y servicios

## 🔒 Características de Seguridad

- ✅ Rate limiting (30 req/min por endpoint)
- ✅ Timeout de requests (10 segundos)
- ✅ Sanitización de URLs
- ✅ Validación de entrada
- ✅ Manejo seguro de errores
- ✅ Cache para reducir llamadas a API

## 🚀 Características

- 📱 Responsive design
- 🎨 Interfaz moderna con Tailwind CSS
- 🔍 Búsqueda de películas
- 📄 Paginación inteligente
- 🏷️ Filtros por categoría (Popular, Top Rated, Now Playing, Upcoming)
- ⚡ Cache automático
- 🔄 Retry automático en errores
- 📊 Manejo de estados de carga y error
- ⭐ Sistema de valoración visual

## 📦 Instalación

```bash
npm install
```

## 🏃 Ejecución

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000/movies`

## 🛠️ Tecnologías

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- SOA Architecture Pattern

## 📚 API

La aplicación consume la API de: `https://devsapihub.com/api-movies`

### Endpoints utilizados:
- `/popular` - Películas populares
- `/top_rated` - Películas mejor valoradas
- `/now_playing` - Películas en cartelera
- `/upcoming` - Próximos estrenos
- `/search` - Búsqueda de películas
- `/{id}` - Detalle de película

## 🎯 Principios SOA Implementados

1. **Separación de responsabilidades**: Cada capa tiene una responsabilidad única
2. **Reutilización**: Servicios desacoplados y componentes reutilizables
3. **Escalabilidad**: Fácil agregar nuevos servicios o endpoints
4. **Mantenibilidad**: Código organizado y fácil de mantener
5. **Testabilidad**: Servicios independientes fáciles de testear
6. **Seguridad**: Múltiples capas de validación y protección

## 📂 Estructura de Directorios

```
src/
├── app/              # Páginas Next.js
├── components/       # Componentes React
│   ├── movies/      # Componentes específicos de películas
│   └── ui/          # Componentes UI genéricos
├── config/          # Configuración
├── services/        # Servicios (SOA)
│   ├── api/        # Servicios de API
│   ├── cache/      # Servicios de cache
│   └── movie/      # Servicios de lógica de negocio
└── types/           # Tipos TypeScript
```
