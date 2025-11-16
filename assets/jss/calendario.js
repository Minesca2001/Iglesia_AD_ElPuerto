fetch("assets/jss/eventos.json")
    .then(res => res.json())
    .then(eventos => generarCalendario(eventos));

function generarCalendario(eventos) {
    const fecha = new Date();
    const mes = fecha.getMonth();
    const año = fecha.getFullYear();

    const primerDia = new Date(año, mes, 1).getDay();
    const diasMes = new Date(año, mes + 1, 0).getDate();

    let html = `
        <table class="calendario">
            <tr>
                <th colspan="7">${fecha.toLocaleString("es-ES", { month: "long" }).toUpperCase()} ${año}</th>
            </tr>
            <tr>
                <th>Dom</th><th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th><th>Sáb</th>
            </tr>
            <tr>
    `;

    let celda = 0;

    for (let i = 0; i < primerDia; i++) {
        html += "<td></td>";
        celda++;
    }

    for (let dia = 1; dia <= diasMes; dia++) {
        const fechaStr = `${año}-${(mes+1).toString().padStart(2,'0')}-${dia.toString().padStart(2,'0')}`;

        const tieneEvento = eventos.find(e => e.fecha === fechaStr);

        html += `
            <td class="${tieneEvento ? "evento" : ""}" data-fecha="${fechaStr}">
                ${dia}
            </td>
        `;

        celda++;
        if (celda % 7 === 0) html += "</tr><tr>";
    }

    html += "</tr></table>";

    document.getElementById("calendario-eventos").innerHTML = html;

    document.querySelectorAll("#calendario-eventos td.evento").forEach(celda =>
        celda.onclick = () => {
            const fecha = celda.dataset.fecha;
            const index = eventos.findIndex(e => e.fecha === fecha);
            irA(index);
        }
    );
}
