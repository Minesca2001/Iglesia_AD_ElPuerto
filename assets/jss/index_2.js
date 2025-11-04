const togglePanel = document.getElementById("toggle-panel"); // Botón para mostrar/ocultar el panel de personalización
const panel = document.getElementById("customization-panel"); // Panel de personalización

// Evento para mostrar/ocultar el panel de personalización
togglePanel.addEventListener("click", () => {
    panel.classList.toggle("open"); // Alterna la clase "open" en el panel
});

// Evento para cambiar el color de fondo de la página
document.getElementById("background-color").addEventListener("input", (e) => {
    document.body.style.backgroundColor = e.target.value; // Cambia el color de fondo al valor seleccionado
});

// Evento para ajustar el tamaño de los asientos
document.getElementById("seat-size").addEventListener("input", (e) => {
    document.querySelectorAll(".seat").forEach(seat => {
        seat.style.width = `${e.target.value}px`; // Cambia el ancho del asiento
        seat.style.height = `${e.target.value}px`; // Cambia la altura del asiento
    });
});

// Evento para cambiar el color de los asientos disponibles
document.getElementById("seat-color").addEventListener("input", (e) => {
    document.querySelectorAll(".seat:not(.occupied)").forEach(seat => {
        seat.style.backgroundColor = e.target.value; // Cambia el color de los asientos no ocupados
    });
});

// Evento para cambiar el color de los asientos ocupados
document.getElementById("occupied-color").addEventListener("input", (e) => {
    document.querySelectorAll(".seat.occupied").forEach(seat => {
        seat.style.backgroundColor = e.target.value; // Cambia el color de los asientos ocupados
    });
});

// Evento para aleatorizar el estado de los asientos (ocupados o disponibles)
document.getElementById("randomize-seats").addEventListener("click", () => {
    document.querySelectorAll(".seat").forEach(seat => {
        seat.classList.toggle("occupied", Math.random() < 0.5); // Cambia aleatoriamente el estado del asiento
    });
    updateInfo(); // Actualiza la información sobre los asientos
});

// Evento para restablecer las personalizaciones
document.getElementById("reset-customizations").addEventListener("click", () => {
    // Restablece los colores y tamaños a sus valores predeterminados
    document.body.style.backgroundColor = "#f9f9f9";
    document.getElementById("seat-size").value = 30;
    document.getElementById("seat-color").value = "#90ee90";
    document.getElementById("occupied-color").value = "#ff4d4d";

    // Vuelve a crear el auditorio para aplicar las personalizaciones por defecto
    createAuditorium();
});