# 🔍 Buscador de Obras Sociales

Aplicación web para buscar obras sociales argentinas por nombre completo o sigla. Consulta datos desde un servidor VPS con fallback local.

## ✨ Características

- 🎯 **Búsqueda en tiempo real** mientras escribes
- 🔤 **Búsqueda por nombre completo o siglas** (ej: OSDE, IOMA, Swiss Medical)
- 📋 **Múltiples siglas por obra social** separadas por comas
- 🏷️ **Clasificación por tipo**: SINDICAL, PREPAGA o ESTATAL
- 💡 **Sugerencias automáticas** con coincidencias priorizadas
- 📱 **Diseño responsive** adaptable a todos los dispositivos
- 🌙 **Modo oscuro** con diseño moderno
- 🌐 **Consulta desde VPS** con fallback automático a cache local
- 🔄 **Reconexión automática** cada 30 segundos si hay error
- 📊 **Indicador de conexión** en tiempo real
- 🧹 **Botón de limpiar búsqueda**

## 🚀 Uso

### Abrir localmente
Abre el archivo `index.html` en tu navegador.

### Con servidor local (recomendado)
```powershell
# Con Python 3
python -m http.server 8000

# Con Node.js
npx http-server

# Con PHP
php -S localhost:8000
```

Luego abre: `http://localhost:8000`

## 🛠️ Configuración del VPS

### 1. En el servidor VPS

```bash
# Subir archivos al VPS
cd operadoresobjetivocc-main
scp server.js root@tu-servidor:/ruta/del/proyecto/
scp obras-sociales.json root@tu-servidor:/ruta/del/proyecto/

# Conectar al VPS
ssh root@tu-servidor
cd /ruta/del/proyecto

# Instalar dependencias
npm install express cors

# Ejecutar con PM2 (recomendado para producción)
npm install -g pm2
pm2 start server.js --name api-obras-sociales
pm2 save
pm2 startup
```

### 2. Configurar la URL

En `script.js`, línea 7, cambia:
```javascript
const API_BASE = 'https://ssh.ccomisiones.com';
```

Por tu dominio o IP:
```javascript
const API_BASE = 'http://tu-ip:3000';
// o
const API_BASE = 'https://tu-dominio.com';
```

### 3. Opcional: Configurar Nginx

Si tienes un dominio, configura Nginx como proxy inverso:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📁 Estructura del proyecto

```
buscadoros/
├── index.html                 # Página principal del buscador
├── styles.css                 # Estilos (modo oscuro, responsive)
├── script.js                  # Lógica de búsqueda y conexión VPS
├── obras-sociales.json        # Base de datos (348 obras sociales)
├── operadoresobjetivocc-main/ # Servidor VPS y editores
│   ├── server.js              # API Express (endpoints /obras-sociales y /products)
│   ├── editor.html            # 🆕 Editor de obras sociales (NUEVO)
│   ├── editor-styles.css      # 🆕 Estilos del editor de obras sociales
│   ├── editor-script.js       # 🆕 Lógica del editor de obras sociales
│   ├── index.html             # Editor de operadores en línea
│   ├── script.js              # Lógica del editor de operadores
│   └── styles.css             # Estilos del editor de operadores
├── .gitignore                 # Archivos ignorados por Git
└── README.md                  # Esta documentación
```

## 🎨 Editor de Obras Sociales

### Características del Editor

El nuevo editor (`operadoresobjetivocc-main/editor.html`) te permite:

- ✏️ **Agregar nuevas obras sociales** con formulario validado
- 🔄 **Editar obras existentes** inline
- 🗑️ **Eliminar obras sociales** con confirmación
- 🔍 **Buscar y filtrar** por nombre, sigla o tipo
- 📊 **Ver estadísticas** en tiempo real
- 💾 **Guardar cambios** directamente en el servidor VPS
- 🌐 **Indicador de conexión** al servidor
- 📱 **100% responsive** para móvil y PC

### Acceder al Editor

```bash
# Localmente
http://localhost:8000/operadoresobjetivocc-main/editor.html

# En producción
https://tu-dominio.com/operadoresobjetivocc-main/editor.html
```

### Uso del Editor

1. **Agregar obra social**: Click en "Nueva Obra Social"
2. **Editar**: Click en el ícono de lápiz de cualquier obra
3. **Eliminar**: Click en el ícono de papelera
4. **Filtrar**: Usa los botones de filtro (Todas, Sindicales, Prepagas, Estatales)
5. **Buscar**: Escribe en el campo de búsqueda
6. **Guardar**: Click en "Guardar Cambios" para enviar al servidor

## 🌐 API Endpoints

### GET /obras-sociales
Obtiene todas las obras sociales
```bash
curl https://tu-dominio.com/obras-sociales
```

### POST /obras-sociales
Actualiza la base de datos completa
```bash
curl -X POST https://tu-dominio.com/obras-sociales \
  -H "Content-Type: application/json" \
  -d @obras-sociales.json
```

### GET /products
Obtiene operadores (para el editor)
```bash
curl https://tu-dominio.com/products
```

### POST /products
Actualiza operadores (para el editor)
```bash
curl -X POST https://tu-dominio.com/products \
  -H "Content-Type: application/json" \
  -d @products.json
```

## 🎯 Formato de datos

### obras-sociales.json
Array de objetos con esta estructura:
```json
[
  {
    "nombre": "OBRA SOCIAL DEL PERSONAL DE LA INDUSTRIA DEL VIDRIO",
    "sigla": "OSPIV,VIDRIO,OBREROS VIDRIO",
    "tipo": "SINDICAL",
    "provincia": "CAPITAL FEDERAL"
  }
]
```

**Importante**: Las siglas múltiples se separan con comas sin espacios adicionales.

## 💻 Tecnologías utilizadas

- HTML5
- CSS3 (Glassmorphism, animaciones, gradientes)
- JavaScript Vanilla
- Express.js (servidor VPS)
- CORS (seguridad)

## 📝 Ejemplos de búsqueda

- **Por sigla**: "OSDE", "PAMI", "IOMA"
- **Por nombre**: "Swiss Medical", "Galeno"
- **Parcial**: "mutual", "obra social"

## 🔒 Seguridad

- CORS configurado en el servidor
- Sin autenticación (público)
- Ideal para uso interno o con autenticación adicional

## 📄 Licencia

Libre para uso personal y comercial.

## ✨ Características

- 🎯 **Búsqueda en tiempo real** mientras escribes
- 🔤 **Búsqueda por nombre completo o siglas** (ej: OSDE, IOMA, Swiss Medical)
- 📋 **Múltiples siglas por obra social** separadas por comas
- 🏷️ **Clasificación por tipo**: SINDICAL, PREPAGA o ESTATAL
- 💡 **Sugerencias automáticas** con coincidencias priorizadas
- 📱 **Diseño responsive** adaptable a dispositivos móviles
- 🎨 **Interfaz moderna en modo oscuro**
- 🌐 **Soporte para VPS**: Consulta datos desde servidor remoto
- 🔄 **Fallback automático**: Si el VPS no responde, usa cache local
- 📊 **Indicador de conexión**: Muestra el estado del servidor en tiempo real

## 🚀 Versiones disponibles

### Versión Local
Usa el archivo `obras-sociales.json` localmente:
- `index.html` + `script.js` + `styles.css`

### Versión VPS (Recomendada)
Consulta datos desde un servidor VPS:
- `index-vps.html` + `script-vps.js` + `styles-vps.css`

## 🛠️ Configuración del VPS

### 1. En el servidor VPS

```bash
# Subir archivos al VPS
scp server.js root@tu-servidor:/ruta/del/proyecto/
scp obras-sociales.json root@tu-servidor:/ruta/del/proyecto/

# Conectar al VPS
ssh root@tu-servidor

# Instalar dependencias
cd /ruta/del/proyecto
npm install express cors

# Ejecutar el servidor (usar PM2 para producción)
npm install -g pm2
pm2 start server.js --name obras-sociales-api
pm2 save
pm2 startup
```

### 2. Configurar dominio (opcional pero recomendado)

Si tienes un dominio, configura Nginx como proxy inverso:

```nginx
server {
    listen 80;
    server_name ssh.ccomisiones.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Actualizar la URL en el código

En `script-vps.js`, cambia:
```javascript
const API_BASE = 'https://ssh.ccomisiones.com';
```

Por tu dominio o IP:
```javascript
const API_BASE = 'http://tu-ip:3000';
// o
const API_BASE = 'https://tu-dominio.com';
```

## 🎯 Uso Local (sin VPS)

### Opción 1: Abrir directamente
Simplemente abre el archivo `index.html` en tu navegador web.

### Opción 2: Servidor local (recomendado)
```powershell
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server

# Con PHP
php -S localhost:8000
```

Luego abre en tu navegador: `http://localhost:8000`

## 🔄 Actualizar datos

### Método 1: Archivo local
Si necesitas actualizar el archivo Excel:

1. Reemplaza el archivo `LISTAOSSSSALUD.xlsx` con el nuevo
2. Ejecuta el script de conversión:
```powershell
npm install
npm run convert
```

### Método 2: API del VPS
Envía una petición POST al endpoint:

```javascript
fetch('https://ssh.ccomisiones.com/obras-sociales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevosDatos)
});
```

## 📁 Estructura del proyecto

```
buscadoros/
├── index.html                  # Versión local
├── index-vps.html             # Versión VPS (mejorada)
├── styles.css                 # Estilos versión local
├── styles-vps.css             # Estilos versión VPS (mejorados)
├── script.js                  # Lógica versión local
├── script-vps.js              # Lógica versión VPS con indicador de conexión
├── obras-sociales.json        # Base de datos (348 obras sociales)
├── LISTAOSSSSALUD.xlsx        # Archivo Excel original
├── convert-excel.js           # Script de conversión Excel → JSON
├── package.json               # Dependencias
├── operadoresobjetivocc-main/ # Carpeta con servidor VPS
│   ├── server.js              # Servidor Express (soporta ambos endpoints)
│   ├── products.json          # Datos de operadores
│   └── obras-sociales.json    # Datos de obras sociales (copiar aquí)
└── README.md                  # Esta documentación
```

## 🌐 API Endpoints (VPS)

### GET /obras-sociales
Obtiene todas las obras sociales
```bash
curl https://ssh.ccomisiones.com/obras-sociales
```

### POST /obras-sociales
Actualiza la base de datos completa
```bash
curl -X POST https://ssh.ccomisiones.com/obras-sociales \
  -H "Content-Type: application/json" \
  -d @obras-sociales.json
```

### GET /products
Obtiene operadores (endpoint original)
```bash
curl https://ssh.ccomisiones.com/products
```

### POST /products
Actualiza operadores (endpoint original)
```bash
curl -X POST https://ssh.ccomisiones.com/products \
  -H "Content-Type: application/json" \
  -d @products.json
```

## 🎯 Formato de datos

El archivo Excel debe tener las siguientes columnas:
- **denominacion**: Nombre completo de la obra social
- **sigla**: Siglas separadas por comas (ej: "OSVARA,IGUALDAD,IGUALDAD SALUD")
- **STATUS**: Tipo de obra social (SINDICAL, PREPAGA, ESTATAL)
- **PROVINCIA**: Provincia donde opera

## 💻 Tecnologías utilizadas

- HTML5
- CSS3 (con gradientes y animaciones)
- JavaScript (Vanilla)
- XLSX (para conversión de Excel)

## 📝 Ejemplos de búsqueda

- **Por nombre**: "OSDE", "Swiss Medical", "IOMA"
- **Por sigla**: "PAMI", "OSBA", "OSECAC"
- **Parcial**: "mutual", "obra social"

## 🎨 Personalización

Puedes personalizar los colores en `styles.css`:
- `.type-sindical`: Obras sociales sindicales (rosa/rojo)
- `.type-prepaga`: Obras sociales prepagas (azul/cyan)
- `.type-estatal`: Obras sociales estatales (verde/turquesa)

## 📄 Licencia

Libre para uso personal y comercial.
