const rows = 10; // Número de filas
const cols = 10; // Número de columnas
let currentRows = rows;
let currentCols = cols;
const auditorium = document.getElementById("auditorium"); // Contenedor del Auditorio

// Crear el auditorio con los asientos
function createAuditorium() {
    auditorium.innerHTML = ''; // Limpiar el auditorio antes de crear nuevos asientos
    for (let i = 0; i < currentRows; i++) {
        for (let j = 0; j < currentCols; j++) {
            const seat = document.createElement("div");
            seat.classList.add("seat");
            seat.setAttribute("data-row", i);
            seat.setAttribute("data-col", j);
            seat.addEventListener("click", toggleSeat);
            auditorium.appendChild(seat);
        }
    }
    updateCount();
}
// Función de inicio de sesión
document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Verificamos las credenciales y asignamos el rol
    if (username === "admin" && password === "admin123") {
        currentRole = "admin";  // Rol de administrador
        alert("Bienvenido Administrador");
    } else {
        currentRole = "user";  // Rol de usuario normal
        alert("Bienvenido Usuario Regular");
    }

    // Guardamos el rol en localStorage para persistencia
    localStorage.setItem("role", currentRole);
    toggleFeatures();  // Actualizamos las funcionalidades disponibles según el rol
});

// Al cargar la página, obtenemos el rol almacenado en localStorage
window.onload = function () {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
        currentRole = storedRole;
        toggleFeatures();  // Actualizamos las funcionalidades según el rol
    }
};

// Función para habilitar o deshabilitar funcionalidades según el rol del usuario
function toggleFeatures() {
    const adminFeatures = ["fillRow", "fillColumn", "exportSeats", "reserveSeats"];
    adminFeatures.forEach((id) => {
        document.getElementById(id).disabled = currentRole !== "admin";  // Solo el admin puede usar estos botones
    });
    document.getElementById("currentRole").textContent = currentRole === "admin" ? "Administrador" : "Usuario Regular";  // Mostramos el rol actual
}

// Cambiar el estado de un asiento (ocupado o disponible)
function toggleSeat(event) {
    const seat = event.target;
    seat.classList.toggle("occupied");
    updateCount();
}

// Actualizar el conteo de ocupados y disponibles
function updateCount() {
    const occupiedSeats = document.querySelectorAll(".seat.occupied").length;
    const totalSeats = currentRows * currentCols;
    const availableSeats = totalSeats - occupiedSeats;
    document.getElementById("occupiedCount").textContent = occupiedSeats;
    document.getElementById("availableCount").textContent = availableSeats;
}
// Mostrar modal al cargar la página
window.onload = function () {
    document.getElementById('loginModal').style.display = 'flex';
};

// Cerrar modal (puedes agregar validación aquí)
function cerrarModal() {
    const usuario = document.getElementById("usuario").value;
    const clave = document.getElementById("clave").value;

    // Validación simple
    if (usuario && clave) {
        document.getElementById('loginModal').style.display = 'none';
    } else {
        alert("Por favor completa todos los campos.");
    }
}