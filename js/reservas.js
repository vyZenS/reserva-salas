// 1. BASE DE DATOS SIMULADA 
const salas = [
    { id_sala: 1, nombre: "Sala de Estudio 1", ubicacion: "FEN - Primer Piso" },
    { id_sala: 2, nombre: "Sala de Estudio 2", ubicacion: "FEN - Primer Piso" },
    { id_sala: 3, nombre: "Sala de Estudio 3", ubicacion: "FEN - Primer Piso" },
    { id_sala: 4, nombre: "Arrayán 1", ubicacion: "Salas Arrayán" },
    { id_sala: 5, nombre: "Arrayán 2", ubicacion: "Salas Arrayán" },
    { id_sala: 6, nombre: "Arrayán 3", ubicacion: "Salas Arrayán" }
];

// Variables de estado global
let vistaActual = 'mes';
let fechaActual = new Date();
let mesActual = fechaActual.getMonth() + 1; 
let anoActual = fechaActual.getFullYear();
let diaSeleccionado = 1; 
let fechaReferenciaSemana = new Date();

const nombreMeses = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// 2. INICIALIZACIÓN 
document.addEventListener('DOMContentLoaded', () => {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (!usuarioActivo) {
        // Si no hay sesión, redirige al login
        window.location.href = 'index.html'; 
        return;
    }

    // Insertar datos del usuario en la interfaz (Sidebar)
    document.getElementById('user-name-display').innerText = usuarioActivo.nombre;
    document.getElementById('user-role-display').innerText = usuarioActivo.rol;
    document.getElementById('user-avatar-text').innerText = usuarioActivo.nombre.charAt(0).toUpperCase();

    configurarSidebar();
    configurarSelectoresVista();
    renderizarEcosistema();
});

// 3. CONFIGURACIÓN DE INTERFAZ
function configurarSidebar() {
    const listaSalas = document.getElementById('lista-salas-sidebar');
    const selectSalas = document.getElementById('sala-select');
    
    salas.forEach((sala, index) => {
        listaSalas.innerHTML += `
            <li style="display: flex; align-items: center; gap: 10px; padding: 8px 0;">
                <div class="sala-color-indicator color-${(index % 6) + 1}"></div>
                <div style="display: flex; flex-direction: column;">
                    <span style="font-weight: 500; font-size: 0.9rem;">${sala.nombre}</span>
                    <span style="font-size: 0.75rem; color: var(--text-color-secondary);"><i class="fa-solid fa-location-dot"></i> ${sala.ubicacion}</span>
                </div>
            </li>
        `;
        selectSalas.innerHTML += `<option value="${sala.id_sala}">${sala.nombre}</option>`;
    });
}

function configurarSelectoresVista() {
    const botones = document.querySelectorAll('.btn-vista');
    
    // Listener para cambiar entre las diferentes vistas del mes
    botones.forEach(btn => {
        btn.addEventListener('click', (e) => {
            botones.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            document.querySelectorAll('.sub-vista').forEach(v => v.style.display = 'none');
            
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
            renderizarEcosistema();
        });
    });
}

// 4. RENDERIZADO DEL CALENDARIO REAL 
function obtenerDiasDelMes(ano, mes) {
    // Retorna la cantidad exacta de días del mes considerando años bisiestos
    return new Date(ano, mes, 0).getDate();
}

// Llama a la función de renderizado según la vista específica 
function renderizarEcosistema() {
    const reservas = JSON.parse(localStorage.getItem('misReservas')) || [];
    const tituloCalendario = document.getElementById('mes-actual');
    
    // Extraemos los datos para el título directamente de la fecha referencia
    const mesNombre = nombreMeses[fechaReferenciaSemana.getMonth() + 1];
    const anio = fechaReferenciaSemana.getFullYear();

    if (vistaActual === 'mes') {
        tituloCalendario.innerText = `${mesNombre} ${anio}`;
        renderizarMes(reservas, fechaReferenciaSemana); // Pasamos la fecha
    } else if (vistaActual === 'semana') {
        // Cálculo del Lunes para el título
        const temp = new Date(fechaReferenciaSemana);
        const day = temp.getDay();
        const diff = (day === 0 ? -6 : 1 - day);
        temp.setDate(temp.getDate() + diff);
        tituloCalendario.innerText = `Semana del ${temp.getDate()} de ${nombreMeses[temp.getMonth() + 1]}`;
        
        renderizarSemana(reservas, fechaReferenciaSemana); // Pasamos la fecha
    } else if (vistaActual === 'dia') {
        tituloCalendario.innerText = `${fechaReferenciaSemana.getDate()} de ${mesNombre} ${anio}`;
        renderizarDia(reservas, fechaReferenciaSemana); // Pasamos la fecha
    }
}

// VISTA MENSUAL
function renderizarMes(reservas) {
    const grid = document.getElementById('calendario-grid');
    grid.innerHTML = ''; 

    // Usamos SIEMPRE fechaReferenciaSemana para obtener el mes y año
    const mes = fechaReferenciaSemana.getMonth(); 
    const ano = fechaReferenciaSemana.getFullYear();
    const mesStr = (mes + 1).toString().padStart(2, '0');

    const hoy = new Date();
    const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

    // 1. Cálculos de Calendario Real
    const diasDelMes = new Date(ano, mes + 1, 0).getDate();
    
    // Obtenemos en qué día de la semana cae el día 1 
    let primerDiaSemana = new Date(ano, mes, 1).getDay();
    // Ajustamos para que Lunes sea 0 y Domingo sea 6
    primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;

    // 2. Dibujar las cajas vacías
    for (let i = 0; i < primerDiaSemana; i++) {
        const divVacio = document.createElement('div');
        divVacio.style.border = 'none';
        divVacio.style.background = 'transparent';
        divVacio.style.cursor = 'default';
        grid.appendChild(divVacio);
    }

    // 3. Dibujar los días reales
    for (let dia = 1; dia <= diasDelMes; dia++) {
        const divDia = document.createElement('div');
        divDia.className = 'calendar-day';
        
        const diaTexto = dia.toString().padStart(2, '0');
        const fechaComprobar = `${ano}-${mesStr}-${diaTexto}`;
        
        if (fechaComprobar === hoyStr) {
            divDia.classList.add('today');
        }
        
        divDia.innerHTML = `<div class="day-number">${dia}</div>`;

        const reservasDelDia = reservas.filter(r => r.fecha === fechaComprobar);
        
        reservasDelDia.forEach(res => {
            const salaReserva = salas.find(s => s.id_sala == res.id_sala);
            divDia.innerHTML += `
                <div class="booking-item color-${res.id_sala}" onclick="abrirDetalleReserva(${res.id_reserva}, event)" style="padding: 4px 8px; margin-top: 4px; border-radius: 6px; font-size: 0.75rem; box-sizing: border-box; width: 100%; cursor: pointer;">
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block;">
                        <strong>${res.hora_inicio}</strong> - ${salaReserva ? salaReserva.nombre : 'Sala'}
                    </span>
                </div>
            `;
        });

        divDia.addEventListener('click', () => abrirModalReserva(fechaComprobar));
        grid.appendChild(divDia);
    }
}

// VISTA SEMANAL
function renderizarSemana(reservas) {
    const thead = document.getElementById('cabecera-semana');
    const tbody = document.getElementById('grid-semana-body');
    if (!thead || !tbody) return;

    thead.innerHTML = '<th style="width: 80px;">Hora</th>';
    const diasNombres = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    // Cálculo preciso del Lunes de la semana actual
    let tempDate = new Date(fechaReferenciaSemana);
    let day = tempDate.getDay(); 
    let diff = (day === 0 ? -6 : 1 - day); 
    let lunesSemana = new Date(tempDate);
    lunesSemana.setDate(tempDate.getDate() + diff);

    const fechasDeEstaSemana = [];

    // 1. Dibujar Cabecera
    for (let i = 0; i < 7; i++) {
        let fechaCol = new Date(lunesSemana);
        fechaCol.setDate(lunesSemana.getDate() + i);
        fechasDeEstaSemana.push(fechaCol);
        
        const diaStr = fechaCol.getDate().toString().padStart(2, '0');
        thead.innerHTML += `<th style="border: 1px solid var(--border-color);">${diasNombres[i]} ${diaStr}</th>`;
    }

    // 2. Dibujar Grilla
    tbody.innerHTML = '';
    let skipCells = [0, 0, 0, 0, 0, 0, 0];

    for (let h = 7; h <= 20; h++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td style="border: 1px solid var(--border-color); text-align: center;"><strong>${h}:00</strong></td>`;

        for (let i = 0; i < 7; i++) {
            if (skipCells[i] > 0) {
                skipCells[i]--;
                continue;
            }

            const fechaCol = fechasDeEstaSemana[i];
            const fechaStr = `${fechaCol.getFullYear()}-${(fechaCol.getMonth() + 1).toString().padStart(2, '0')}-${fechaCol.getDate().toString().padStart(2, '0')}`;

            const reserva = reservas.find(r => r.fecha === fechaStr && parseInt(r.hora_inicio.split(':')[0]) === h);

            if (reserva) {
                const sala = salas.find(s => s.id_sala === reserva.id_sala);
                const horaInicio = parseInt(reserva.hora_inicio.split(':')[0]);
                const horaFin = parseInt(reserva.hora_fin.split(':')[0]);
                let duracion = horaFin - horaInicio;
                if (duracion < 1) duracion = 1;
                skipCells[i] = duracion - 1; 

                tr.innerHTML += `
                    <td rowspan="${duracion}" onclick="abrirDetalleReserva(${reserva.id_reserva}, event)" class="color-${reserva.id_sala}" style="cursor: pointer; border: 1px solid var(--border-color); color: var(--text-color-primary); padding: 5px; font-size: 0.8rem; vertical-align: top;">
                        <strong style="display: block;">${sala ? sala.nombre : 'Reservado'}</strong>
                    </td>
                `;
            } else {
                tr.innerHTML += `<td onclick="abrirModalReserva('${fechaStr}')" style="cursor: pointer; border: 1px solid var(--border-color);"></td>`;
            }
        }
        tbody.appendChild(tr);
    }
}

// VISTA DIARIA (Detalle por Salas)
function renderizarDia(reservas) {
    const cabecera = document.getElementById('cabecera-salas-dia');
    const tbody = document.getElementById('grid-dia-body');

    cabecera.innerHTML = '<th style="width: 80px;">Hora</th>';
    salas.forEach(s => cabecera.innerHTML += `<th style="border: 1px solid var(--border-color);">${s.nombre}</th>`);

    tbody.innerHTML = '';

    // Extraemos fecha directamente de la variable global de referencia
    const mesStr = (fechaReferenciaSemana.getMonth() + 1).toString().padStart(2, '0');
    const diaStr = fechaReferenciaSemana.getDate().toString().padStart(2, '0');
    const fechaFijaDia = `${fechaReferenciaSemana.getFullYear()}-${mesStr}-${diaStr}`;
    
    let skipCells = Array(salas.length).fill(0); 

    for (let h = 7; h <= 20; h++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td style="border: 1px solid var(--border-color); text-align: center;"><strong>${h}:00</strong></td>`;

        salas.forEach((sala, index) => {
            if (skipCells[index] > 0) {
                skipCells[index]--;
                return;
            }

            const reserva = reservas.find(r => r.fecha === fechaFijaDia && r.id_sala === sala.id_sala && parseInt(r.hora_inicio.split(':')[0]) === h);

            if (reserva) {
                const horaInicio = parseInt(reserva.hora_inicio.split(':')[0]);
                const horaFin = parseInt(reserva.hora_fin.split(':')[0]);
                let duracion = horaFin - horaInicio;
                if (duracion < 1) duracion = 1;
                skipCells[index] = duracion - 1; 

                tr.innerHTML += `
                    <td rowspan="${duracion}" onclick="abrirDetalleReserva(${reserva.id_reserva}, event)" class="color-${reserva.id_sala}" style="cursor: pointer; border: 1px solid var(--border-color); color: var(--text-color-primary); padding: 5px; font-size: 0.8rem; box-shadow: inset 4px 0 0 rgba(0,0,0,0.2); vertical-align: top;">
                        <strong style="display: block; margin-bottom: 4px;">✅ Reservado</strong>${reserva.motivo}
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

// Referencias a los botones con los nuevos IDs
const saveBtn = document.getElementById('save-btn');
const deleteBtn = document.getElementById('delete-btn');
const cancelBtn = document.getElementById('cancel-btn');

let reservaActivaId = null;

// Para crear una reserva nueva
function abrirModalReserva(fecha) {
    reservaActivaId = null;
    formReserva.reset();
    inputFecha.value = fecha; 

    // Mostramos Guardar, ocultamos Eliminar
    if (saveBtn) {
        saveBtn.style.display = 'inline-block';
        saveBtn.innerText = 'Guardar';
    }
    if (deleteBtn) deleteBtn.style.display = 'none';

    modal.style.display = 'flex';
}

// Para VER/MODIFICAR/ELIMINAR una reserva existente
window.abrirDetalleReserva = function(idReserva, event) {
    event.stopPropagation(); // Evita que el clic traspase y abra una reserva nueva
    
    const reservas = JSON.parse(localStorage.getItem('misReservas')) || [];
    const reserva = reservas.find(r => r.id_reserva === idReserva);
    
    if (reserva) {
        reservaActivaId = idReserva;

        // Llenamos los campos con los datos existentes
        inputFecha.value = reserva.fecha;
        document.getElementById('sala-select').value = reserva.id_sala;
        document.getElementById('hora-inicio').value = reserva.hora_inicio;
        document.getElementById('hora-fin').value = reserva.hora_fin;
        document.getElementById('motivo').value = reserva.motivo;

        // Mostramos Guardar (como Actualizar) y mostramos Eliminar
        if (saveBtn) {
            saveBtn.style.display = 'inline-block';
            saveBtn.innerText = 'Actualizar';
        }
        if (deleteBtn) deleteBtn.style.display = 'inline-block';
        
        modal.style.display = 'flex';
    }
};

// Evento para cerrar el modal (Global, para que no se dupliquen listeners)
if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Lógica para GUARDAR o ACTUALIZAR
formReserva.addEventListener('submit', (e) => {
    e.preventDefault(); 

    // Recolectamos datos del formulario
    const id_sala = parseInt(document.getElementById('sala-select').value);
    const fecha = document.getElementById('fecha-reserva').value;
    const hora_inicio = document.getElementById('hora-inicio').value;
    const hora_fin = document.getElementById('hora-fin').value;
    const motivo = document.getElementById('motivo').value;

    const [hInicio, mInicio] = hora_inicio.split(':').map(Number);
    const [hFin, mFin] = hora_fin.split(':').map(Number);
    const decimalInicio = hInicio + (mInicio / 60);
    const decimalFin = hFin + (mFin / 60);

    if (decimalInicio >= decimalFin) {
        alert('La hora de inicio debe ser anterior a la hora de fin.');
        return;
    }

    if (decimalInicio < 7 || decimalFin > 23) {
        alert('Las reservas deben estar entre las 07:00 y las 23:00 horas.');
        return;
    }
    
    if (decimalFin - decimalInicio > 4) {
        alert('No se pueden reservar más de 4 horas consecutivas.');
        return;
    }

    const ahora = new Date();
    const hoyStr = `${ahora.getFullYear()}-${(ahora.getMonth() + 1).toString().padStart(2, '0')}-${ahora.getDate().toString().padStart(2, '0')}`;
    
    if (fecha === hoyStr) {
        const horaActualDecimal = ahora.getHours() + (ahora.getMinutes() / 60);
        if (decimalInicio < horaActualDecimal) {
            alert('No se pueden hacer reservas para horas pasadas del día actual.');
            return;
        }
    }

    let reservas = JSON.parse(localStorage.getItem('misReservas')) || [];
    const selectSalas = document.getElementById('sala-select');
    const nombreSalaVisual = selectSalas.options[selectSalas.selectedIndex].text;

    if (reservaActivaId) {
        // ACTUALIZAR reserva existente
        const index = reservas.findIndex(r => r.id_reserva === reservaActivaId);
        if (index !== -1) {
            reservas[index] = {
                id_reserva: reservaActivaId, 
                id_sala, fecha, hora_inicio, hora_fin, motivo
            };
            toastText.innerText = `Reserva en ${nombreSalaVisual} actualizada correctamente.`;
        }
    } else {
        // CREAR nueva reserva
        const nuevaReserva = {
            id_reserva: Date.now(), 
            id_sala, fecha, hora_inicio, hora_fin, motivo
        };
        reservas.push(nuevaReserva);
        toastText.innerText = `Reserva confirmada en ${nombreSalaVisual} a las ${hora_inicio} hrs.`;
    }

    // Guardamos y actualizamos la interfaz
    localStorage.setItem('misReservas', JSON.stringify(reservas));
    modal.style.display = 'none';
    renderizarEcosistema();
    
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 4000);

    formReserva.reset(); 
});

// 6. ELIMINAR RESERVAS
if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
        if (reservaActivaId && confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
            let reservas = JSON.parse(localStorage.getItem('misReservas')) || [];
            reservas = reservas.filter(r => r.id_reserva !== reservaActivaId);
            localStorage.setItem('misReservas', JSON.stringify(reservas));
            
            modal.style.display = 'none';
            renderizarEcosistema();
            
            toastText.innerText = `Reserva eliminada correctamente.`;
            toast.classList.add('show');
            setTimeout(() => { toast.classList.remove('show'); }, 4000);
        }
    });
}
// 7. UTILIDADES EXTRA
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

// 8. NAVEGACIÓN INTELIGENTE (MES, SEMANA, DÍA)
document.getElementById('btn-anterior').addEventListener('click', () => {
    if (vistaActual === 'semana') {
        fechaReferenciaSemana.setDate(fechaReferenciaSemana.getDate() - 7);
    } else if (vistaActual === 'dia') {
        fechaReferenciaSemana.setDate(fechaReferenciaSemana.getDate() - 1);
    } else if (vistaActual === 'mes') {
        fechaReferenciaSemana.setMonth(fechaReferenciaSemana.getMonth() - 1);
    }
    renderizarEcosistema();
});

document.getElementById('btn-siguiente').addEventListener('click', () => {
    if (vistaActual === 'semana') {
        fechaReferenciaSemana.setDate(fechaReferenciaSemana.getDate() + 7);
    } else if (vistaActual === 'dia') {
        fechaReferenciaSemana.setDate(fechaReferenciaSemana.getDate() + 1);
    } else if (vistaActual === 'mes') {
        fechaReferenciaSemana.setMonth(fechaReferenciaSemana.getMonth() + 1);
    }
    renderizarEcosistema();
});