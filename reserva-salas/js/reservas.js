// 1. BASE DE DATOS SIMULADA 
const salas = [
    { id_sala: 1, nombre: "Sala de Estudio 1", ubicacion: "FEN - Primer Piso" },
    { id_sala: 2, nombre: "Sala de Estudio 2", ubicacion: "FEN - Primer Piso" },
    { id_sala: 3, nombre: "Arrayán 3", ubicacion: "Salas Arrayán" },
    { id_sala: 4, nombre: "Sala de Estudio 3", ubicacion: "FEN - Primer Piso" }
];

// Si no hay reservas guardadas, cargamos las de prueba
if (!localStorage.getItem('misReservas')) {
    const reservasBase = [
        { id_reserva: 1, id_sala: 1, fecha: "2026-06-01", hora_inicio: "10:00", hora_fin: "12:00", motivo: "Estudio individual" },
        { id_reserva: 2, id_sala: 3, fecha: "2026-06-10", hora_inicio: "14:00", hora_fin: "16:00", motivo: "Reunión de equipo" }
    ];
    localStorage.setItem('misReservas', JSON.stringify(reservasBase));
}

// Variable global para saber qué estamos mirando
let vistaActual = 'mes';


// 2. INICIALIZACIÓN (AL CARGAR LA PÁGINA)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Validar si el usuario pasó por el Login
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (!usuarioActivo) {
        window.location.href = 'index.html'; // Lo pateamos si no está logueado
        return;
    }

    // 2. Pintar datos del perfil en el Sidebar
    document.getElementById('user-name-display').innerText = usuarioActivo.nombre;
    document.getElementById('user-role-display').innerText = usuarioActivo.rol;
    document.getElementById('user-avatar-text').innerText = usuarioActivo.nombre.charAt(0).toUpperCase();

    // 3. Configurar Sidebar y Vistas
    configurarSidebar();
    configurarSelectoresVista();
    
    // 4. Pintar el calendario inicial
    renderizarEcosistema();
});


// 3. CONFIGURACIÓN DE INTERFAZ (SIDEBAR Y BOTONES)
function configurarSidebar() {
    const listaSalas = document.getElementById('lista-salas-sidebar');
    const selectSalas = document.getElementById('sala-select');
    
    salas.forEach((sala, index) => {
        // Pintar lista lateral
        listaSalas.innerHTML += `
            <li style="display: flex; align-items: center; gap: 10px; padding: 8px 0;">
                <div class="sala-color-indicator color-${(index % 6) + 1}"></div>
                <div style="display: flex; flex-direction: column;">
                    <span style="font-weight: 500; font-size: 0.9rem;">${sala.nombre}</span>
                    <span style="font-size: 0.75rem; color: var(--text-color-secondary);"><i class="fa-solid fa-location-dot"></i> ${sala.ubicacion}</span>
                </div>
            </li>
        `;
        // Pintar opciones del formulario
        selectSalas.innerHTML += `<option value="${sala.id_sala}">${sala.nombre}</option>`;
    });
}

function configurarSelectoresVista() {
    const botones = document.querySelectorAll('.btn-vista');
    
    botones.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Manejar clase CSS visual
            botones.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Ocultar todas las vistas
            document.querySelectorAll('.sub-vista').forEach(v => v.style.display = 'none');
            
            // Mostrar la correcta según el botón clickeado
            if (e.target.id === 'vista-mes') {
                vistaActual = 'mes';
                document.getElementById('contenedor-vista-mes').style.display = 'block';
            } else if (e.target.id === 'vista-semana') {
                vistaActual = 'semana';
                document.getElementById('contenedor-vista-semana').style.display = 'block';
            } else if (e.target.id === 'vista-dia') {
                vistaActual = 'dia';
                document.getElementById('contenedor-vista-dia').style.display = 'block';
            }
            // Volver a dibujar los datos
            renderizarEcosistema();
        });
    });
}

// 4. RENDERIZADO DE LAS 3 VISTAS DEL CALENDARIO
function renderizarEcosistema() {
    const reservas = JSON.parse(localStorage.getItem('misReservas')) || [];
    
    if (vistaActual === 'mes') renderizarMes(reservas);
    if (vistaActual === 'semana') renderizarSemana(reservas);
    if (vistaActual === 'dia') renderizarDia(reservas);
}

function renderizarMes(reservas) {
    const grid = document.getElementById('calendario-grid');
    grid.innerHTML = ''; 

    for (let dia = 1; dia <= 30; dia++) {
        const divDia = document.createElement('div');
        divDia.className = 'calendar-day';
        
        const diaTexto = dia.toString().padStart(2, '0');
        const fechaComprobar = `2026-06-${diaTexto}`;
        
        divDia.innerHTML = `<div class="day-number">${dia}</div>`;

        const reservasDelDia = reservas.filter(r => r.fecha === fechaComprobar);
        
        reservasDelDia.forEach(res => {
            const salaReserva = salas.find(s => s.id_sala == res.id_sala);
            divDia.innerHTML += `
                <div class="booking-item color-${res.id_sala}">
                    ${res.hora_inicio} - ${salaReserva ? salaReserva.nombre : 'Sala'}
                </div>
            `;
        });

        divDia.addEventListener('click', () => abrirModalReserva(fechaComprobar));
        grid.appendChild(divDia);
    }
}

function renderizarSemana(reservas) {
    const tbody = document.getElementById('grid-semana-body');
    tbody.innerHTML = '';

    for (let h = 7; h <= 20; h++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td><strong>${h}:00</strong></td>`;

        for (let d = 1; d <= 7; d++) {
            const fechaStr = `2026-06-${d.toString().padStart(2, '0')}`;
            const reserva = reservas.find(r => r.fecha === fechaStr && parseInt(r.hora_inicio.split(':')[0]) === h);
            
            if (reserva) {
                const sala = salas.find(s => s.id_sala == reserva.id_sala);
                tr.innerHTML += `
                    <td class="color-${reserva.id_sala}" style="color: #fff; padding: 5px; font-size: 0.8rem;">
                        <strong>${sala ? sala.nombre : 'Sala'}</strong><br>${reserva.motivo}
                    </td>
                `;
            } else {
                tr.innerHTML += `<td onclick="abrirModalReserva('${fechaStr}')" style="cursor: pointer;"></td>`;
            }
        }
        tbody.appendChild(tr);
    }
}

function renderizarDia(reservas) {
    const cabecera = document.getElementById('cabecera-salas-dia');
    const tbody = document.getElementById('grid-dia-body');

    cabecera.innerHTML = '<th style="width: 80px;">Hora</th>';
    salas.forEach(s => cabecera.innerHTML += `<th>${s.nombre}</th>`);

    tbody.innerHTML = '';
    const fechaFijaDia = "2026-06-01"; // Día de prueba para la vista diaria

    for (let h = 7; h <= 20; h++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td><strong>${h}:00</strong></td>`;

        salas.forEach(sala => {
            const reserva = reservas.find(r => r.fecha === fechaFijaDia && r.id_sala === sala.id_sala && parseInt(r.hora_inicio.split(':')[0]) === h);
            
            if (reserva) {
                tr.innerHTML += `
                    <td class="color-${reserva.id_sala}" style="color: #fff; padding: 5px; text-align: center; font-size: 0.8rem;">
                        ✅ Reservado
                    </td>
                `;
            } else {
                tr.innerHTML += `<td onclick="abrirModalReserva('${fechaFijaDia}')" style="cursor: pointer;"></td>`;
            }
        });
        tbody.appendChild(tr);
    }
}

// 5. LÓGICA DEL FORMULARIO Y MODALES
const modal = document.getElementById('modal-reserva');
const formReserva = document.getElementById('form-reserva');
const inputFecha = document.getElementById('fecha-reserva');
const toast = document.getElementById('notification-toast');
const toastText = document.getElementById('notification-text');

function abrirModalReserva(fecha) {
    inputFecha.value = fecha; 
    modal.style.display = 'flex';
}

document.getElementById('cancel-btn').addEventListener('click', () => {
    modal.style.display = 'none';
});

formReserva.addEventListener('submit', (e) => {
    e.preventDefault(); 

    // 1. Armar el objeto con los datos limpios
    const nuevaReserva = {
        id_reserva: Date.now(), 
        id_sala: parseInt(document.getElementById('sala-select').value),
        fecha: document.getElementById('fecha-reserva').value,
        hora_inicio: document.getElementById('hora-inicio').value,
        hora_fin: document.getElementById('hora-fin').value,
        motivo: document.getElementById('motivo').value
    };

    // 2. Validar horas (la hora de inicio debe ser menor a la hora de fin)
    if (nuevaReserva.hora_inicio >= nuevaReserva.hora_fin) {
        alert('La hora de inicio debe ser anterior a la hora de fin.');
        return;
    }

    // 3. Guardar en memoria
    const reservas = JSON.parse(localStorage.getItem('misReservas')) || [];
    reservas.push(nuevaReserva);
    localStorage.setItem('misReservas', JSON.stringify(reservas));

    // 4. Cerrar y redibujar
    modal.style.display = 'none';
    renderizarEcosistema();

    // 5. Consecuencia Visual (Toast)
    const selectSalas = document.getElementById('sala-select');
    const nombreSalaVisual = selectSalas.options[selectSalas.selectedIndex].text;
    
    toastText.innerText = `✨ Reserva confirmada en ${nombreSalaVisual} a las ${nuevaReserva.hora_inicio} hrs.`;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 4000);

    formReserva.reset(); 
});

// 6. UTILIDADES EXTRA (MODO OSCURO Y LOGOUT)
document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('usuarioActivo');
    window.location.href = 'index.html';
});

document.getElementById('theme-toggle').addEventListener('change', (e) => {
    if (e.target.checked) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});