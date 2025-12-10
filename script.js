// Base de datos de obras sociales
let obrasSociales = [];

// Cargar datos
async function cargarDatos() {
    try {
        const response = await fetch('obras-sociales.json');
        obrasSociales = await response.json();
        actualizarEstadisticas();
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        document.getElementById('stats').innerHTML = '<p>Error al cargar la base de datos. Por favor, asegúrate de tener el archivo obras-sociales.json</p>';
    }
}

// Actualizar estadísticas
function actualizarEstadisticas() {
    const stats = document.getElementById('stats');
    stats.innerHTML = `<p>Base de datos con ${obrasSociales.length} obras sociales disponibles</p>`;
}

// Normalizar texto para búsqueda (quitar acentos, mayúsculas, etc.)
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

// Buscar obras sociales
function buscarObrasSociales(termino) {
    if (!termino || termino.length < 2) {
        return [];
    }

    const terminoNormalizado = normalizarTexto(termino);
    
    return obrasSociales.filter(obra => {
        // Buscar en el nombre
        const nombreNormalizado = normalizarTexto(obra.nombre);
        if (nombreNormalizado.includes(terminoNormalizado)) {
            return true;
        }
        
        // Buscar en las siglas (separadas por comas)
        if (obra.sigla) {
            const siglas = obra.sigla.split(',').map(s => normalizarTexto(s.trim()));
            return siglas.some(sigla => sigla.includes(terminoNormalizado));
        }
        
        return false;
    });
}

// Mostrar sugerencias
function mostrarSugerencias(resultados) {
    const suggestionsDiv = document.getElementById('suggestions');
    
    if (resultados.length === 0) {
        suggestionsDiv.classList.remove('show');
        return;
    }
    
    suggestionsDiv.innerHTML = '';
    
    // Limitar a 8 sugerencias
    const limitadas = resultados.slice(0, 8);
    
    limitadas.forEach(obra => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        
        const nombre = document.createElement('div');
        nombre.className = 'suggestion-name';
        nombre.textContent = obra.nombre;
        
        const siglas = document.createElement('div');
        siglas.className = 'suggestion-siglas';
        siglas.textContent = obra.sigla || 'Sin siglas registradas';
        
        item.appendChild(nombre);
        item.appendChild(siglas);
        
        item.addEventListener('click', () => {
            mostrarResultado(obra);
            document.getElementById('searchInput').value = obra.nombre;
            suggestionsDiv.classList.remove('show');
        });
        
        suggestionsDiv.appendChild(item);
    });
    
    suggestionsDiv.classList.add('show');
}

// Mostrar resultado seleccionado
function mostrarResultado(obra) {
    const resultsDiv = document.getElementById('results');
    
    // Determinar clase de tipo
    let tipoClase = '';
    let tipoTexto = obra.tipo || 'NO ESPECIFICADO';
    
    if (tipoTexto.toUpperCase().includes('SINDICAL')) {
        tipoClase = 'type-sindical';
    } else if (tipoTexto.toUpperCase().includes('PREPAGA')) {
        tipoClase = 'type-prepaga';
    } else if (tipoTexto.toUpperCase().includes('ESTATAL')) {
        tipoClase = 'type-estatal';
    } else if (tipoTexto === 'NO ESPECIFICADO' || tipoTexto === '') {
        // Para casos sin tipo definido, intentar determinar por nombre
        const nombreUpper = obra.nombre.toUpperCase();
        if (nombreUpper.includes('OSDE') || nombreUpper.includes('SWISS') || nombreUpper.includes('MEDICUS') || nombreUpper.includes('GALENO')) {
            tipoClase = 'type-prepaga';
            tipoTexto = 'PREPAGA';
        } else if (nombreUpper.includes('PAMI') || nombreUpper.includes('IOMA') || nombreUpper.includes('PROFE')) {
            tipoClase = 'type-estatal';
            tipoTexto = 'ESTATAL';
        } else {
            tipoClase = 'type-sindical';
        }
    }
    
    resultsDiv.innerHTML = `
        <div class="result-card">
            <div class="result-name">${obra.nombre}</div>
            <div class="result-type ${tipoClase}">${tipoTexto}</div>
            ${obra.sigla ? `
                <div class="result-siglas">
                    <div class="result-siglas-title">También conocida como:</div>
                    <div class="result-siglas-list">${obra.sigla}</div>
                </div>
            ` : ''}
        </div>
    `;
    
    resultsDiv.classList.add('show');
}

// Mostrar "sin resultados"
function mostrarSinResultados() {
    const resultsDiv = document.getElementById('results');
    
    resultsDiv.innerHTML = `
        <div class="no-results">
            <div class="no-results-icon">🔍</div>
            <div class="no-results-title">No se encontraron resultados</div>
            <div class="no-results-text">Intenta buscar con otro nombre o sigla</div>
        </div>
    `;
    
    resultsDiv.classList.add('show');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const suggestionsDiv = document.getElementById('suggestions');
    
    // Búsqueda mientras se escribe
    searchInput.addEventListener('input', (e) => {
        const termino = e.target.value;
        
        if (termino.length < 2) {
            suggestionsDiv.classList.remove('show');
            return;
        }
        
        const resultados = buscarObrasSociales(termino);
        mostrarSugerencias(resultados);
    });
    
    // Búsqueda al presionar Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            realizarBusqueda();
        }
    });
    
    // Búsqueda al hacer clic en el botón
    searchButton.addEventListener('click', realizarBusqueda);
    
    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            suggestionsDiv.classList.remove('show');
        }
    });
});

// Realizar búsqueda completa
function realizarBusqueda() {
    const termino = document.getElementById('searchInput').value;
    const suggestionsDiv = document.getElementById('suggestions');
    
    if (termino.length < 2) {
        return;
    }
    
    const resultados = buscarObrasSociales(termino);
    
    suggestionsDiv.classList.remove('show');
    
    if (resultados.length > 0) {
        mostrarResultado(resultados[0]);
    } else {
        mostrarSinResultados();
    }
}
