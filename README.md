# 🔍 Buscador de Obras Sociales

Aplicación web para buscar obras sociales argentinas por nombre completo o sigla.

## ✨ Características

- 🎯 **Búsqueda en tiempo real** mientras escribes
- 🔤 **Búsqueda por nombre completo o siglas** (ej: OSDE, IOMA, Swiss Medical)
- 📋 **Múltiples siglas por obra social** separadas por comas
- 🏷️ **Clasificación por tipo**: SINDICAL, PREPAGA o ESTATAL
- 💡 **Sugerencias automáticas** con coincidencias
- 📱 **Diseño responsive** adaptable a dispositivos móviles
- 🎨 **Interfaz moderna y atractiva**

## 🚀 Uso

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

Si necesitas actualizar el archivo Excel:

1. Reemplaza el archivo `LISTAOSSSSALUD.xlsx` con el nuevo
2. Ejecuta el script de conversión:
```powershell
npm install
npm run convert
```

Esto generará un nuevo archivo `obras-sociales.json` actualizado.

## 📁 Estructura del proyecto

```
buscadoros/
├── index.html              # Página principal
├── styles.css              # Estilos y diseño
├── script.js               # Lógica de búsqueda
├── obras-sociales.json     # Base de datos JSON
├── LISTAOSSSSALUD.xlsx     # Archivo Excel original
├── convert-excel.js        # Script de conversión
├── package.json            # Dependencias
└── README.md              # Esta documentación
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
