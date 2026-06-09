// TUS DATOS SIMULADOS
const salas = [
    {id_sala: 1, nombre: "Sala de Estudio 1", ubicacion: "FEN - Primer Piso", capacidad: 6},
    {id_sala: 2, nombre: "Sala de Estudio 2", ubicacion: "FEN - Primer Piso", capacidad: 4},
    {id_sala: 3, nombre: "Arrayán 3", ubicacion: "Salas Arrayán", capacidad: 40},
    {id_sala: 4, nombre: "Sala de Estudio 3", ubicacion: "FEN - Primer Piso", capacidad: 5},
];

const reservas = [
    {id_reserva: 1, id_sala: 1, fecha: "2026-06-01", hora_inicio: "10:00", hora_fin: "12:00", motivo: "Estudio individual"},
    {id_reserva: 2, id_sala: 2, fecha: "2026-06-01", hora_inicio: "14:00", hora_fin: "16:00", motivo: "Reunión de equipo"},
    {id_reserva: 3, id_sala: 3, fecha: "2026-06-02", hora_inicio: "09:00", hora_fin: "11:00", motivo: "Presentación"},
];

// Simulamos que se pasa por el Login y se guarda el usuario activo en localStorage
if (!localStorage.getItem("usuarioActivo")) {
    localStorage.setItem("usuarioActivo", JSON.stringify({rut: "21589901-2", nombre: "Vicente Durán", rol: "estudiante"}));
}

// CONFIGURAR LA INTERFAZ
document.addEventListener('DOMContentLoaded', () => {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    
    // Pintar Perfil
    document.getElementById('user-name-display').innerText = usuarioActivo.nombre;
    document.getElementById('user-role-display').innerText = usuarioActivo.rol;
    document.getElementById('user-avatar-text').innerText = usuarioActivo.nombre.charAt(0).toUpperCase();

    // Pintar Sidebar Salas
    const listaSalas = document.getElementById('lista-salas-sidebar');
    const selectSalas = document.getElementById('sala-select');
    
    salas.forEach((sala, index) => {
        // Para el sidebar
        listaSalas.innerHTML += `
            <li style="display: flex; align-items: center; gap: 10px; padding: 8px 0;">
                <div class="sala-color-indicator color-${(index % 6) + 1}"></div>
                <div style="display: flex; flex-direction: column;">
                    <span style="font-weight: 500; font-size: 0.9rem;">${sala.nombre}</span>
                    <span style="font-size: 0.75rem; color: var(--text-color-secondary);"><i class="fa-solid fa-location-dot"></i> ${sala.ubicacion}</span>
                </div>
            </li>
        `;
        // Para el formulario del modal
        selectSalas.innerHTML += `<option value="${sala.id_sala}">${sala.nombre}</option>`;
    });

    // GENERAR EL GRID DEL CALENDARIO 
    const grid = document.getElementById('calendario-grid');
    
    // Simulamos 30 días del mes
    for (let dia = 1; dia <= 30; dia++) {
        const divDia = document.createElement('div');
        divDia.className = 'calendar-day';
        
        // Formatear la fecha a 'YYYY-MM-DD' para comparar con tus datos
        const diaTexto = dia.toString().padStart(2, '0');
        const fechaComprobar = `2026-06-${diaTexto}`;
        
        divDia.innerHTML = `<div class="day-number">${dia}</div>`;

        // Buscar si hay reservas en este día
        const reservasDelDia = reservas.filter(r => r.fecha === fechaComprobar);
        
        reservasDelDia.forEach(res => {
            const salaReserva = salas.find(s => s.id_sala == res.id_sala);
            // Inyectar la etiqueta visual de la reserva
            divDia.innerHTML += `
                <div class="booking-item color-${res.id_sala}">
                    ${res.hora_inicio} - ${salaReserva ? salaReserva.nombre : 'Sala'}
                </div>
            `;
        });

        // Al hacer clic en un día, abrir el modal de nueva reserva
        divDia.addEventListener('click', () => abrirModalReserva(fechaComprobar));
        grid.appendChild(divDia);
    }
});

// LÓGICA DEL MODAL Y FORMULARIO 
const modal = document.getElementById('modal-reserva');
const btnCancelar = document.getElementById('cancel-btn');
const formReserva = document.getElementById('form-reserva');
const inputFecha = document.getElementById('fecha-reserva');

const toast = document.getElementById('notification-toast');
const toastText = document.getElementById('notification-text');

function abrirModalReserva(fecha) {
    inputFecha.value = fecha; // Rellenar input con la fecha del grid
    modal.style.display = 'flex';
}

btnCancelar.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Capturar el formulario de reserva
formReserva.addEventListener('submit', (e) => {
    e.preventDefault(); // Evitar recarga

    const nombreSala = document.getElementById('sala-select').options[document.getElementById('sala-select').selectedIndex].text;
    const hora = document.getElementById('hora-inicio').value;

    // Cerrar modal
    modal.style.display = 'none';

    // Mostrar alerta verde
    toastText.innerText = `Reserva confirmada en ${nombreSala} a las ${hora} hrs.`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
});

// UTILIDADES 
// Botón salir
document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('usuarioActivo');
    window.location.href = 'index.html';
});

// Modo oscuro
document.getElementById('theme-toggle').addEventListener('change', (e) => {
    if (e.target.checked) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});
localStorage.setItem("usuarioActivo", JSON.stringify({rut: "21589901-2", nombre: "Vicente Durán", email: "vduran23@alumnos.utalca.cl", rol: "estudiante"}));