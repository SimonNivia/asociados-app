# Gestión de Asociados

App React para gestionar socios de asociaciones, clubes y cooperativas.

## Funcionalidades

- **Dashboard** con métricas en tiempo real y gráficos comparativos
- **Listado de socios** con búsqueda, filtros por estado y pago, edición y eliminación
- **Formulario** para registrar nuevos socios con validación
- **Edición** en modal directo desde la tabla
- **Persistencia local** con `localStorage` (los datos se mantienen al recargar)
- **Dark mode** automático según preferencia del sistema

## Campos por socio

| Campo | Tipo |
|---|---|
| Nombre completo | Texto |
| DNI | Número (7-9 dígitos) |
| Email | Email |
| Teléfono | Texto |
| Categoría | Titular / Adherente / Juvenil / Honorario |
| Cuota mensual | Número |
| Estado | Activo / Inactivo |
| Estado de pago | Al día / Moroso |
| Fecha de ingreso | Fecha |

---

## Instalación y uso local

### Requisitos
- Node.js 18+ (https://nodejs.org)

### Pasos

```bash
# 1. Descomprimir el ZIP
unzip asociados-app.zip
cd asociados-app

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
npm run dev
```

Abrí http://localhost:5173 en el navegador.

---

## Deploy en producción

### Opción A — Netlify (recomendado, gratis)

1. Crear cuenta en https://netlify.com
2. Instalar Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
3. Build y deploy:
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Opción B — Vercel (gratis)

1. Crear cuenta en https://vercel.com
2. Instalar Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Deploy:
   ```bash
   vercel --prod
   ```

### Opción C — GitHub Pages

1. Instalar plugin:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Agregar en `package.json` bajo `scripts`:
   ```json
   "deploy": "gh-pages -d dist"
   ```
3. Build y deploy:
   ```bash
   npm run build
   npm run deploy
   ```

### Opción D — Servidor propio (Nginx / Apache)

```bash
npm run build
# Subir el contenido de /dist al servidor web
```

En Nginx:
```nginx
server {
    listen 80;
    root /var/www/asociados-app/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Notas técnicas

- Los datos se guardan en `localStorage` del navegador. No requiere base de datos.
- Para datos compartidos entre múltiples usuarios, se necesita un backend (Node/Express + DB).
- Stack: React 18, Vite 5, Chart.js 4

## Próximas mejoras posibles

- Exportar a Excel (xlsx)
- Importar desde CSV
- Backend con base de datos para datos compartidos
- Autenticación con usuario y contraseña
- Envío de avisos de cuota por email
