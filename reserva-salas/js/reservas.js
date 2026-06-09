// 1. BASE DE DATOS SIMULADA 
const salas = [
    { id_sala: 1, nombre: "Sala de Estudio 1", ubicacion: "FEN - Primer Piso" },
    { id_sala: 2, nombre: "Sala de Estudio 2", ubicacion: "FEN - Primer Piso" },
    { id_sala: 3, nombre: "Arrayán 3", ubicacion: "Salas Arrayán" },
    { id_sala: 4, nombre: "Sala de Estudio 3", ubicacion: "FEN - Primer Piso" }
];

// Variable global para saber qué estamos mirando
let vistaActual = 'mes';


// 2. INICIALIZACIÓN (AL CARGAR LA PÁGINA)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Validar si el usuario pasó por el Login
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (!usuarioActivo) {
        window.location.href = 'index.html'; 
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

let diaInicioSemana = 1; // Variable global para controlar el día que se muestra en la vista semanal (1 a 7)
let diaSeleccionado = 1; // Variable global para controlar el día que se muestra en la vista diaria (1 a 30)

// 4. RENDERIZADO DE LAS 3 VISTAS DEL CALENDARIO
function renderizarEcosistema() {
    const reservas = JSON.parse(localStorage.getItem('misReservas')) || [];
    const tituloCalendario = document.getElementById('mes-actual');
    
    if (vistaActual === 'mes') {
        tituloCalendario.innerText = 'Junio 2026';
        renderizarMes(reservas);
    }

    if (vistaActual === 'semana') {
        tituloCalendario.innerText = `Semana del ${diaInicioSemana} de Junio`;
        renderizarSemana(reservas);
    }

    if (vistaActual === 'dia') {
        tituloCalendario.innerText = `${diaSeleccionado} de Junio`;
        renderizarDia(reservas);
    }
};

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
    const thead = document.getElementById('cabecera-semana');
    const tbody = document.getElementById('grid-semana-body');

    if (!thead || !tbody) return;

    thead.innerHTML = '<tr><th style="width: 80px;">Hora</th>';
    const diasNombres = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    for (let i = 0; i < 7; i++) {
        let diaActual = diaInicioSemana + i;
        if (diaActual > 30) break; // Evitar pasar de junio
        thead.innerHTML += `<th>${diasNombres[i]} ${diaActual.toString().padStart(2, '0')}</th>`;

        tbody.innerHTML = '';
        let skipCells = [0, 0, 0, 0, 0]; // Para controlar si se deben saltar celdas por reservas de varias horasx  

        for (let h = 7; h <=20; h++) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td style="border: 1px solid var(--border-color); text-align: center;"><strong>${h}:00</strong></td>`;

            for (let i = 0; i < 7; i++) {
                if (skipCells[i] > 0) {
                    skipCells[i]--;
                    continue;
                }

                let diaActual = diaInicioSemana + i;
                if (diaActual > 30) {
                    tr.innerHTML += `<td style="background-color: rgba(0,0,0,0.05); border: 1px solid var(--border-color);"></td>`;
                    continue;
                }

                const fechaStr = `2026-06-${diaActual.toString().padStart(2, '0')}`;
                const reserva = reservas.find(r => r.fecha === fechaStr && parseInt(r.hora_inicio.split(':')[0]) === h);

                if (reserva) {
                    const sala = salas.find(s => s.id_sala === reserva.id_sala);

                    // Calcular cuántas horas ocupa la reserva para saltar las celdas correspondientes
                    const horaInicio = parseInt(reserva.hora_inicio.split(':')[0]);
                    const horaFin = parseInt(reserva.hora_fin.split(':')[0]);
                    const duracion = horaFin - horaInicio;
                    if (duracion < 1) duracion = 1;

                    // Marcar las celdas que deben ser saltadas
                    skipCells[i] = duracion - 1; // Restamos 1 porque la celda actual ya se está usando

                    tr.innerHTML += `
                        <td rowspan="${duracion}" class="color-${reserva.id_sala}" style="border: 1px solid var(--border-color); color: var(--text-color-primary); padding: 5px; font-size: 0.8rem; box-shadow: inset 4px 0 0 rgba(0,0,0,0.2); vertical-align: top;">
                            <strong style="display: block; margin-bottom: 4 px;">${sala ? sala.nombre : 'Reservado'}</strong><br>${reserva.motivo}
                        </td>
                    `;
                } else {
                    tr.innerHTML += `<td onclick="abrirModalReserva('${fechaStr}')" style="cursor: pointer; border: 1px solid var(--border-color); transition: background 0.2s;"></td>`;
                }
            }
            tbody.appendChild(tr);
        }
    }
}

function renderizarDia(reservas) {
        const cabecera = document.getElementById('cabecera-salas-dia');
        const tbody = document.getElementById('grid-dia-body');

        cabecera.innerHTML = '<th style="width: 80px;">Hora</th>';
        salas.forEach(s => cabecera.innerHTML += `<th style="border: 1px solid var(--border-color);">${s.nombre}</th>`);

        tbody.innerHTML = '';
        const fechaFijaDia = `2026-06-${diaSeleccionado.toString().padStart(2, '0')}`;

        let skipCells = Array(salas.length).fill(0); // Para controlar si se deben saltar celdas por reservas de varias horas

        for (let h = 7; h <= 20; h++) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td style="border: 1px solid var(--border-color); text-align: center;"><strong>${h}:00</strong></td>`;

            salas.forEach((sala, index) => {
                // Si la sala actual está ocupada por una reserva de varias horas, saltamos la celda
                if (skipCells[index] > 0) {
                    skipCells[index]--;
                    return;
                }

                const reserva = reservas.find(r => r.fecha === fechaFijaDia && r.id_sala === sala.id_sala && parseInt(r.hora_inicio.split(':')[0]) === h);

                if (reserva) {
                    // Calcular duración para saltar celdas
                    const horaInicio = parseInt(reserva.hora_inicio.split(':')[0]);
                    const horaFin = parseInt(reserva.hora_fin.split(':')[0]);
                    let duracion = horaFin - horaInicio;
                    if (duracion < 1) duracion = 1;

                    skipCells[index] = duracion - 1; // Restamos 1 porque la celda actual ya se está usando

                    tr.innerHTML += `
                        <td class="color-${reserva.id_sala}" style="border: 1px solid var(--border-color); color: var(--text-color-primary); padding: 5px; font-size: 0.8rem; box-shadow: inset 4px 0 0 rgba(0,0,0,0.2);">
                            ${reserva.motivo}
                        </td>
                    `;
                } else {
                    tr.innerHTML += `<td onclick="abrirModalReserva('${fechaFijaDia}')" style="cursor: pointer; border: 1px solid var(--border-color); transition: background 0.2s;"></td>`;
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

    // Reglas de Negocio:
    // 1. Transformar horas a números decimales para facilitar validaciones (ej: 14:30 -> 14.5)
    const [hInicio, mInicio] = nuevaReserva.hora_inicio.split(':').map(Number);
    const [hFin, mFin] = nuevaReserva.hora_fin.split(':').map(Number);

    const decimalInicio = hInicio + (mInicio / 60);
    const decimalFin = hFin + (mFin / 60);

    // 2. Validar horas de inicio y fin
    if (decimalInicio >= decimalFin) {
        alert('La hora de inicio debe ser anterior a la hora de fin.');
        return;
    }

    // 3. Validar el rango permitido (7:00 a 23:00)
    if (decimalInicio < 7 || decimalFin > 23) {
        alert('Las reservas deben estar entre las 07:00 y las 23:00 horas.');
        return;
    }
    
    // 4. Validar el máximo de horas consecutivas (máximo 4 horas)
    if (decimalFin - decimalInicio > 4) {
        alert('No se pueden reservar más de 4 horas consecutivas.');
        return;
    }

    // Guardar en memoria
    const reservas = JSON.parse(localStorage.getItem('misReservas')) || [];
    reservas.push(nuevaReserva);
    localStorage.setItem('misReservas', JSON.stringify(reservas));

    // Cerrar y redibujar
    modal.style.display = 'none';
    renderizarEcosistema();

    // Notificación de éxito
    const selectSalas = document.getElementById('sala-select');
    const nombreSalaVisual = selectSalas.options[selectSalas.selectedIndex].text;
    
    toastText.innerText = `Reserva confirmada en ${nombreSalaVisual} a las ${nuevaReserva.hora_inicio} hrs.`;
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

// 7. NAVEGACIÓN ENTRE SEMANA Y DÍA
document.getElementById('btn-anterior').addEventListener('click', () => {
    if (vistaActual === 'semana') {
        diaInicioSemana = Math.max(diaInicioSemana - 7, 1);
        renderizarEcosistema();
    } else if (vistaActual === 'dia') {
        diaSeleccionado = Math.max(diaSeleccionado - 1, 1);
        renderizarEcosistema();
    } else {
        renderizarEcosistema(); // En vista mes, simplemente se vuelve a renderizar
    }
});

document.getElementById('btn-siguiente').addEventListener('click', () => {
    if (vistaActual === 'semana') {
        // Limitamos para que no avance más allá del inicio de la última semana de Junio
        diaInicioSemana = Math.min(diaInicioSemana + 7, 29);
        renderizarEcosistema();
    } else if (vistaActual === 'dia') {
        diaSeleccionado = Math.min(diaSeleccionado + 1, 30);
        renderizarEcosistema();
    } else {
        renderizarEcosistema(); // En vista mes, simplemente se vuelve a renderizar 
    }
});