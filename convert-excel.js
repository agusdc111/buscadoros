const XLSX = require('xlsx');
const fs = require('fs');

// Leer el archivo Excel con opciones para preservar todo el texto
const workbook = XLSX.readFile('LISTAOSSSSALUD.xlsx', { 
    type: 'buffer',
    cellText: false,
    cellDates: false
});

const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convertir a JSON con raw: false para obtener el texto formateado completo
const data = XLSX.utils.sheet_to_json(worksheet, { 
    defval: '',
    raw: false,  // Esto asegura que obtengamos el texto formateado
    blankrows: false
});

// Procesar los datos para el formato que necesitamos
const obrasSociales = data.map(row => {
    // Obtener la sigla completa, asegurando que se preserve todo el texto
    let siglaCompleta = row.sigla || '';
    
    // Si la sigla está vacía, intentar obtenerla directamente de la celda
    if (!siglaCompleta && row.__rowNum__) {
        const cellAddress = XLSX.utils.encode_cell({ r: row.__rowNum__, c: 2 }); // Columna C (sigla)
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
            siglaCompleta = String(cell.v);
        }
    }
    
    return {
        nombre: row.denominacion || '',
        sigla: siglaCompleta,
        tipo: row.STATUS || 'NO ESPECIFICADO',
        provincia: row.PROVINCIA || ''
    };
}).filter(obra => obra.nombre && obra.nombre.trim() !== ''); // Filtrar filas vacías

// Guardar como JSON
fs.writeFileSync('obras-sociales.json', JSON.stringify(obrasSociales, null, 2), 'utf-8');

console.log(`✅ Conversión exitosa: ${obrasSociales.length} obras sociales procesadas`);
console.log('📁 Archivo generado: obras-sociales.json');
