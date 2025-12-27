// Variable global para el rol
let currentRole = localStorage.getItem("role") || "user";

function initAuditorio() {
    console.log("Inicializando mapa y herramientas...");
    
    let currentRows = 10;
    let currentCols = 10;
    const auditorium = document.getElementById("auditorium");

    if (!auditorium) return;

    // --- 1. FUNCIÓN PARA CREAR ASIENTOS ---
    function createAuditorium() {
        auditorium.innerHTML = '';
        auditorium.style.display = "grid";
        auditorium.style.gridTemplateColumns = `repeat(${currentCols}, auto)`;
        auditorium.style.gap = "5px";

        for (let i = 0; i < currentRows; i++) {
            for (let j = 0; j < currentCols; j++) {
                const seat = document.createElement("div");
                seat.className = "seat";
                seat.dataset.row = i;
                seat.dataset.col = j;
                
                // Evento directo al crear el elemento
                seat.onclick = function() {
                    this.classList.toggle("occupied");
                    updateCount();
                };
                
                auditorium.appendChild(seat);
            }
        }
        updateCount();
    }

    function updateCount() {
        const occupied = document.querySelectorAll(".seat.occupied").length;
        const total = currentRows * currentCols;
        const occEl = document.getElementById("occupiedCount");
        const avaEl = document.getElementById("availableCount");
        if (occEl) occEl.textContent = occupied;
        if (avaEl) avaEl.textContent = total - occupied;
    }

    // --- 2. VINCULACIÓN DE HERRAMIENTAS ---
    // Esta función interna asegura que el botón existe antes de asignarle el click
    const setupBtn = (id, action) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.onclick = (e) => {
                e.preventDefault();
                action(e);
            };
        }
    };

    // Botones de Filas y Columnas
    setupBtn("create-row", () => { currentRows++; createAuditorium(); });
    setupBtn("create-column", () => { currentCols++; createAuditorium(); });
    
    setupBtn("delete-row", () => {
        const row = prompt(`Eliminar fila (0 a ${currentRows - 1}):`);
        if (row !== null && row >= 0 && row < currentRows) {
            currentRows--;
            createAuditorium();
        }
    });

    // Llenar Fila
    setupBtn("fillRow", () => {
        const row = prompt(`Número de fila a llenar (1-${currentRows}):`);
        if (row > 0 && row <= currentRows) {
            document.querySelectorAll(`.seat[data-row="${row-1}"]`).forEach(s => s.classList.add("occupied"));
            updateCount();
        }
    });

    // Personalización
    setupBtn("toggle-panel", () => {
        const panel = document.getElementById("customization-panel");
        if (panel) panel.classList.toggle("open");
    });

    setupBtn("background-color", (e) => {
        document.body.style.backgroundColor = e.target.value;
    });

    // Ajuste de tamaño de asientos
    const seatSizeInput = document.getElementById("seat-size");
    if (seatSizeInput) {
        seatSizeInput.oninput = (e) => {
            const size = e.target.value + "px";
            document.querySelectorAll(".seat").forEach(s => {
                s.style.width = size;
                s.style.height = size;
            });
        };
    }

    setupBtn("resetSeats", () => {
        document.querySelectorAll(".seat").forEach(s => s.classList.remove("occupied"));
        updateCount();
    });

    // Ejecución inicial
    createAuditorium();
    toggleFeatures();
}

function toggleFeatures() {
    const adminIds = ["fillRow", "fillColumn", "exportSeats", "reserveSeats"];
    adminIds.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = (currentRole !== "admin");
    });
}