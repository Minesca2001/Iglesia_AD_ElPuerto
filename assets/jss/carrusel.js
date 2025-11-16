let eventos = [];
let indice = 0;
let intervalo;

// Cargar JSON
fetch("assets/jss/eventos.json")
    .then(res => res.json())
    .then(data => {
        eventos = data;
        construirCarrusel();
        iniciarAuto();
    });

function construirCarrusel() {
    const slides = document.querySelector(".carrusel-slides");
    const indicadores = document.querySelector(".carrusel-indicadores");

    eventos.forEach((e, i) => {
        slides.innerHTML += `
            <div class="carrusel-slide ${i === 0 ? "active" : ""}">
                <img src="${e.imagen}">
                <div class="caption">
                    <h3>${e.titulo}</h3>
                    <p>${e.fecha} — ${e.hora}</p>
                    <p>${e.lugar}</p>
                </div>
            </div>
        `;

        indicadores.innerHTML += `
            <span data-indice="${i}" class="${i === 0 ? "activo" : ""}"></span>
        `;
    });

    document.querySelector(".prev").onclick = retroceder;
    document.querySelector(".next").onclick = avanzar;

    document.querySelectorAll(".carrusel-indicadores span")
        .forEach(ind => ind.onclick = () => irA(ind.dataset.indice));
}

function avanzar() {
    indice = (indice + 1) % eventos.length;
    actualizar();
}

function retroceder() {
    indice = (indice - 1 + eventos.length) % eventos.length;
    actualizar();
}

function irA(i) {
    indice = Number(i);
    actualizar();
}

function actualizar() {
    document.querySelectorAll(".carrusel-slide")
        .forEach((s, i) => s.classList.toggle("active", i === indice));

    document.querySelectorAll(".carrusel-indicadores span")
        .forEach((d, i) => d.classList.toggle("activo", i === indice));
}

function iniciarAuto() {
    intervalo = setInterval(avanzar, 5000);
}
