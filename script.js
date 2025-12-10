// ==========================
// 🔧 CONFIGURACIÓN
// ==========================

// ⚠️ Cambiar por tu IP o dominio del VPS
// IMPORTANTE: sin barra al final
const API_BASE = 'https://ssh.ccomisiones.com';

// Base de datos de obras sociales
let obrasSociales = [];

// Elementos del DOM
const statusEl = document.getElementById('connectionStatus');
const searchInput = document.getElementById('searchInput');
const clearButton = document.getElementById('clearButton');
const suggestionsDiv = document.getElementById('suggestions');
const resultsDiv = document.getElementById('results');
const statsDiv = document.getElementById('stats');

// ==========================
// 📡 ESTADO DE CONEXIÓN
// ==========================

function setConnectionStatus(status, message) {
    if (!statusEl) return;
    
    statusEl.className = 'connection-status';
    const statusText = statusEl.querySelector('.status-text');
    
    if (status === 'connected') {
        statusEl.classList.add('connected');
        statusText.textContent = message || 'Conectado al servidor';
    } else if (status === 'error') {
        statusEl.classList.add('error');
        statusText.textContent = message || 'Error de conexión';
    } else {
        statusText.textContent = message || 'Conectando...';
    }
}

// ==========================
// 📥 CARGAR DATOS DESDE VPS
// ==========================

async function cargarDatos() {
    try {
        console.log('🔄 Cargando obras sociales desde:', `${API_BASE}/obras-sociales`);
        setConnectionStatus('loading', 'Cargando...');
        
        const response = await fetch(`${API_BASE}/obras-sociales`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }
        
        obrasSociales = await response.json();
        console.log('✅ Obras sociales cargadas desde VPS:', obrasSociales.length);
        
        setConnectionStatus('connected', 'Servidor conectado');
        actualizarEstadisticas();
        
    } catch (error) {
        console.error('❌ Error al cargar desde VPS:', error);
        setConnectionStatus('error', 'Usando cache local');
        
        // Fallback: intentar cargar desde archivo local
        try {
            console.log('🔄 Intentando cargar desde archivo local...');
            const response = await fetch('obras-sociales.json');
            obrasSociales = await response.json();
            console.log('✅ Cargado desde archivo local:', obrasSociales.length);
            actualizarEstadisticas();
        } catch (localError) {
            console.error('❌ Error al cargar archivo local:', localError);
            statsDiv.innerHTML = '<div class="stats-content" style="color: #ef4444;">⚠️ Error al cargar la base de datos</div>';
        }
    }
}

// ==========================
// 📊 ACTUALIZAR ESTADÍSTICAS
// ==========================

function actualizarEstadisticas() {
    const total = obrasSociales.length;
    const sindicales = obrasSociales.filter(o => o.tipo && o.tipo.toUpperCase().includes('SINDICAL')).length;
    const prepagas = obrasSociales.filter(o => o.tipo && o.tipo.toUpperCase().includes('PREPAGA')).length;
    const estatales = obrasSociales.filter(o => o.tipo && o.tipo.toUpperCase().includes('ESTATAL')).length;
    
    statsDiv.innerHTML = `
        <div class="stats-content">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3h7v7H3z"></path>
                <path d="M14 3h7v7h-7z"></path>
                <path d="M14 14h7v7h-7z"></path>
                <path d="M3 14h7v7H3z"></path>
            </svg>
            <span>${total} obras sociales • ${sindicales} sindicales • ${prepagas} prepagas • ${estatales} estatales</span>
        </div>
    `;
}

// ==========================
// 🔍 NORMALIZAR TEXTO
// ==========================

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

// ==========================
// 🔎 BÚSQUEDA CON SCORING
// ==========================

function buscarObrasSociales(termino) {
    if (!termino || termino.length < 2) {
        return [];
    }

    const terminoNormalizado = normalizarTexto(termino);
    
    const resultados = obrasSociales.map(obra => {
        let score = 0;
        let coincide = false;
        
        const nombreNormalizado = normalizarTexto(obra.nombre);
        
        // Buscar en las siglas
        if (obra.sigla) {
            const siglas = obra.sigla.split(',').map(s => s.trim());
            
            for (const sigla of siglas) {
                const siglaNormalizada = normalizarTexto(sigla);
                
                if (siglaNormalizada === terminoNormalizado) {
                    score = 1000;
                    coincide = true;
                    break;
                }
                else if (siglaNormalizada.startsWith(terminoNormalizado)) {
                    score = Math.max(score, 500);
                    coincide = true;
                }
                else if (siglaNormalizada.includes(terminoNormalizado)) {
                    score = Math.max(score, 250);
                    coincide = true;
                }
            }
        }
        
        // Buscar en el nombre
        if (nombreNormalizado === terminoNormalizado) {
            score = Math.max(score, 800);
            coincide = true;
        }
        else if (nombreNormalizado.startsWith(terminoNormalizado)) {
            score = Math.max(score, 400);
            coincide = true;
        }
        else if (nombreNormalizado.includes(terminoNormalizado)) {
            score = Math.max(score, 100);
            coincide = true;
        }
        
        return { obra, score, coincide };
    })
    .filter(item => item.coincide)
    .sort((a, b) => b.score - a.score)
    .map(item => item.obra);
    
    return resultados;
}

// ==========================
// 💡 MOSTRAR SUGERENCIAS
// ==========================

function mostrarSugerencias(resultados) {
    if (resultados.length === 0) {
        suggestionsDiv.classList.remove('show');
        return;
    }
    
    suggestionsDiv.innerHTML = '';
    const limitadas = resultados.slice(0, 10);
    
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
            searchInput.value = obra.nombre;
            suggestionsDiv.classList.remove('show');
        });
        
        suggestionsDiv.appendChild(item);
    });
    
    suggestionsDiv.classList.add('show');
}

// ==========================
// 📋 MOSTRAR RESULTADO
// ==========================

function mostrarResultado(obra) {
    let tipoClase = '';
    let tipoTexto = obra.tipo || 'NO ESPECIFICADO';
    
    if (tipoTexto.toUpperCase().includes('SINDICAL')) {
        tipoClase = 'type-sindical';
    } else if (tipoTexto.toUpperCase().includes('PREPAGA')) {
        tipoClase = 'type-prepaga';
    } else if (tipoTexto.toUpperCase().includes('ESTATAL')) {
        tipoClase = 'type-estatal';
    } else if (tipoTexto === 'NO ESPECIFICADO' || tipoTexto === '') {
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
                    <div class="result-siglas-title">También conocida como</div>
                    <div class="result-siglas-list">${obra.sigla}</div>
                </div>
            ` : ''}
        </div>
    `;
    
    resultsDiv.classList.add('show');
}

// ==========================
// ❌ SIN RESULTADOS
// ==========================

function mostrarSinResultados() {
    resultsDiv.innerHTML = `
        <div class="no-results">
            <div class="no-results-icon">🔍</div>
            <div class="no-results-title">No se encontraron resultados</div>
            <div class="no-results-text">Intenta buscar con otro nombre o sigla</div>
        </div>
    `;
    
    resultsDiv.classList.add('show');
}

// ==========================
// 🎬 REALIZAR BÚSQUEDA
// ==========================

function realizarBusqueda() {
    const termino = searchInput.value;
    
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

// ==========================
// 🎯 EVENT LISTENERS
// ==========================

document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    
    // Búsqueda mientras se escribe
    searchInput.addEventListener('input', (e) => {
        const termino = e.target.value;
        
        // Mostrar/ocultar botón de limpiar
        clearButton.style.display = termino ? 'flex' : 'none';
        
        if (termino.length < 2) {
            suggestionsDiv.classList.remove('show');
            resultsDiv.classList.remove('show');
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
    
    // Botón limpiar
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        clearButton.style.display = 'none';
        suggestionsDiv.classList.remove('show');
        resultsDiv.classList.remove('show');
        searchInput.focus();
    });
    
    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            suggestionsDiv.classList.remove('show');
        }
    });
});

// ==========================
// 🔄 RECONEXIÓN AUTOMÁTICA
// ==========================

// Intentar reconectar cada 30 segundos si hay error
setInterval(() => {
    if (statusEl && statusEl.classList.contains('error')) {
        console.log('🔄 Intentando reconectar...');
        cargarDatos();
    }
}, 30000);
