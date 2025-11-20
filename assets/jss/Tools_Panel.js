// Panel de herramientas
const toolPanel = document.getElementById("sidebar");
const toggleToolsButton = document.getElementById("collapse-toggle");
toggleToolsButton.addEventListener("click", () => {
    toolPanel.classList.toggle("open");
});

// Asignar una fila
document.getElementById("assign-row").addEventListener("click", () => {
    const row = prompt("Ingrese el número de fila a asignar (0 a " + (currentRows - 1) + "):");
    if (row >= 0 && row < currentRows) {
        for (let i = 0; i < currentCols; i++) {
            const seat = document.querySelector(`[data-row="${row}"][data-col="${i}"]`);
            seat.classList.add("occupied");
        }
        updateCount();
    } else {
        alert("Fila no válida.");
    }
});

// Asignar una columna
document.getElementById("assign-column").addEventListener("click", () => {
    const col = prompt("Ingrese el número de columna a asignar (0 a " + (currentCols - 1) + "):");
    if (col >= 0 && col < currentCols) {
        for (let i = 0; i < currentRows; i++) {
            const seat = document.querySelector(`[data-row="${i}"][data-col="${col}"]`);
            seat.classList.add("occupied");
        }
        updateCount();
    } else {
        alert("Columna no válida.");
    }
});

// Crear una fila
document.getElementById("create-row").addEventListener("click", () => {
    if (currentRows < 20) {
        currentRows++;
        createAuditorium();
    } else {
        alert("El número máximo de filas es 20.");
    }
});

// Crear una columna
document.getElementById("create-column").addEventListener("click", () => {
    if (currentCols < 20) {
        currentCols++;
        createAuditorium();
    } else {
        alert("El número máximo de columnas es 20.");
    }
});

// Eliminar una fila
document.getElementById("delete-row").addEventListener("click", () => {
    const row = prompt("Ingrese el número de fila a eliminar (0 a " + (currentRows - 1) + "):");
    if (row >= 0 && row < currentRows) {
        const seatsInRow = document.querySelectorAll(`[data-row="${row}"]`);
        seatsInRow.forEach(seat => seat.remove());
        currentRows--;
        createAuditorium();
    } else {
        alert("Fila no válida.");
    }
});

// Eliminar una columna
document.getElementById("delete-column").addEventListener("click", () => {
    const col = prompt("Ingrese el número de columna a eliminar (0 a " + (currentCols - 1) + "):");
    if (col >= 0 && col < currentCols) {
        const seatsInCol = document.querySelectorAll(`[data-col="${col}"]`);
        seatsInCol.forEach(seat => seat.remove());
        currentCols--;
        createAuditorium();
    } else {
        alert("Columna no válida.");
    }
});

// LLenar una Fila Completa
document.getElementById("fillRow").addEventListener("click", fillRow);
function fillRow() {
    const rowIndex = prompt(`Ingrese el número de la fila (1-${rows}):`);
    if (!rowIndex || rowIndex < 1 || rowIndex > rows) {
        alert("Fila no válida.");
        return;
    }
    const rowSeats = [...auditorium.children].filter(seat => seat.dataset.row == rowIndex - 1);
    rowSeats.forEach(seat => {
        if (!seat.classList.contains("occupied")) {
            seat.classList.add("occupied");
        }
    });
    updateCount();
}

// LLenar una Columna Completa
document.getElementById("fillColumn").addEventListener("click", fillColumn);
function fillColumn() {
    const colIndex = prompt(`Ingrese el número de la columna (1-${cols}):`);
    if (!colIndex || colIndex < 1 || colIndex > cols) {
        alert("Columna no válida.");
        return;
    }
    const colSeats = [...auditorium.children].filter(seat => seat.dataset.col == colIndex - 1);
    colSeats.forEach(seat => {
        if (!seat.classList.contains("occupied")) {
            seat.classList.add("occupied");
        }
    });
    updateCount();
}

// Exportar Registro
document.getElementById("exportSeats").addEventListener("click", exportSeats);
function exportSeats() {
    const seats = [...auditorium.children].map(seat => ({
        row: seat.dataset.row,
        col: seat.dataset.col,
        occupied: seat.classList.contains("occupied")
    }));
    const blob = new Blob([JSON.stringify(seats, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "disposicion_asientos.json";
    link.click();
}

// Función para importar la disposición de los asientos desde un archivo JSON
document.getElementById("importButton").addEventListener("click", () => {
    document.getElementById("importSeats").click(); // Simula el clic en el input de carga de archivo
});

// Manejo de la carga del archivo JSON
document.getElementById("importSeats").addEventListener("change", event => {
    const file = event.target.files[0]; // Obtener el archivo cargado
    if (file) {
        const reader = new FileReader(); // Crear un objeto FileReader para leer el archivo
        reader.onload = e => {
            const data = JSON.parse(e.target.result); // Parsear el archivo JSON
            resetSeats(); // Resetear todos los asientos antes de aplicar la disposición
            data.forEach(seatData => {
                const seat = auditorium.querySelector(`[data-row='${seatData.row}'][data-col='${seatData.col}']`); // Buscar el asiento correspondiente
                if (seat && seatData.occupied) { // Si el asiento está ocupado
                    seat.classList.add("occupied");
                }
            });
            updateCount(); // Actualizar los contadores
        };
        reader.readAsText(file); // Leer el archivo como texto
    }
});

// Reservar Sección
function reserveSeats() {
    const startRow = prompt("Ingrese la fila inicial (1-10):");
    const endRow = prompt("Ingrese la fila final (1-10):");
    const startCol = prompt("Ingrese la columna inicial (1-10):");
    const endCol = prompt("Ingrese la columna final (1-10):");

    if (!startRow || !endRow || !startCol || !endCol) {
        alert("Entrada no válida.");
        return;
    }

    for (let i = startRow - 1; i < endRow; i++) {
        for (let j = startCol - 1; j < endCol; j++) {
            const seat = [...auditorium.children].find(seat => seat.dataset.row == i && seat.dataset.col == j);
            if (seat && !seat.classList.contains("occupied")) {
                seat.classList.add("occupied");
            }
        }
    }
    updateCount();
}

// Reiniciar Asientos
function resetSeats() {
    occupiedSeats = 0;
    auditorium.querySelectorAll(".seat").forEach(seat => seat.classList.remove("occupied"));
    updateCount();
}


document.getElementById("resetSeats").addEventListener("click", resetSeats);

document.getElementById("reserveSeats").addEventListener("click", reserveSeats);

// Ejecutar la creación del auditorio
createAuditorium();
// Colapsar o expandir la barra lateral
document.getElementById("collapse-toggle").addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("collapsed");

    const icon = document.querySelector("#collapse-toggle i");
    icon.classList.toggle("fa-angle-double-left");
    icon.classList.toggle("fa-angle-double-right");
});
