// 1. BASE DE DATOS SIMULADA 
const salas = [
    { id_sala: 1, nombre: "Sala de Estudio 1", ubicacion: "FEN - Primer Piso" },
    { id_sala: 2, nombre: "Sala de Estudio 2", ubicacion: "FEN - Primer Piso" },
    { id_sala: 3, nombre: "Arrayán 3", ubicacion: "Salas Arrayán" },
    { id_sala: 4, nombre: "Sala de Estudio 3", ubicacion: "FEN - Primer Piso" }
];

// Variables de estado global para controlar los meses
let vistaActual = 'mes';
let mesActual = 6; 
let anoActual = 2026;
const nombreMeses = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

let diaInicioSemana = 1; 
let diaSeleccionado = 1; 

// 2. INICIALIZACIÓN (AL CARGAR LA PÁGINA)
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

// 3. CONFIGURACIÓN DE INTERFAZ (SIDEBAR Y BOTONES)
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

// 4. RENDERIZADO DEL CALENDARIO REAL (CÁLCULO MATEMÁTICO DE FECHAS)
function obtenerDiasDelMes(ano, mes) {
    // Retorna la cantidad exacta de días (ej: Febrero 2026 = 28, Febrero 2028 = 29)
    return new Date(ano, mes, 0).getDate();
}

// Llama a la función de renderizado según la vista específica 
function renderizarEcosistema() {
    const reservas = JSON.parse(localStorage.getItem('misReservas')) || [];
    const tituloCalendario = document.getElementById('mes-actual');
    
    if (vistaActual === 'mes') {
        tituloCalendario.innerText = `${nombreMeses[mesActual]} ${anoActual}`;
        renderizarMes(reservas);
    } else if (vistaActual === 'semana') {
        tituloCalendario.innerText = `Semana del ${diaInicioSemana} de ${nombreMeses[mesActual]} ${anoActual}`;
        renderizarSemana(reservas);
    } else if (vistaActual === 'dia') {
        tituloCalendario.innerText = `${diaSeleccionado} de ${nombreMeses[mesActual]} ${anoActual}`;
        renderizarDia(reservas);
    }
}

// VISTA MENSUAL
function renderizarMes(reservas) {
    const grid = document.getElementById('calendario-grid');
    grid.innerHTML = ''; 

    const hoy = new Date();
    const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    const mesStr = mesActual.toString().padStart(2, '0');

    // 1. Cálculos de Calendario Real
    const diasDelMes = obtenerDiasDelMes(anoActual, mesActual);
    
    // Obtenemos en qué día de la semana cae el día 1 (0 = Domingo, 1 = Lunes...)
    let primerDiaSemana = new Date(anoActual, mesActual - 1, 1).getDay();
    // Ajustamos para que Lunes sea 0 y Domingo sea 6
    primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;

    // 2. Dibujar las cajas vacías para alinear el día 1 donde corresponde
    for (let i = 0; i < primerDiaSemana; i++) {
        const divVacio = document.createElement('div');
        divVacio.style.border = 'none';
        divVacio.style.background = 'transparent';
        divVacio.style.cursor = 'default';
        grid.appendChild(divVacio);
    }

    // 3. Dibujar los días reales del mes
    for (let dia = 1; dia <= diasDelMes; dia++) {
        const divDia = document.createElement('div');
        divDia.className = 'calendar-day';
        
        const diaTexto = dia.toString().padStart(2, '0');
        const fechaComprobar = `${anoActual}-${mesStr}-${diaTexto}`;
        
        if (fechaComprobar === hoyStr) {
            divDia.classList.add('today');
        }
        
        divDia.innerHTML = `<div class="day-number">${dia}</div>`;

        const reservasDelDia = reservas.filter(r => r.fecha === fechaComprobar);
        
        reservasDelDia.forEach(res => {
            const salaReserva = salas.find(s => s.id_sala == res.id_sala);
            divDia.innerHTML += `
                <div class="booking-item color-${res.id_sala}" style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${res.hora_inicio} - ${salaReserva ? salaReserva.nombre : 'Sala'}</span>
                    <i class="fa-solid fa-trash" style="cursor:pointer; opacity:0.6; margin-left: 5px;" onclick="eliminarReserva(${res.id_reserva}, event)" title="Eliminar reserva"></i>
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
    
    const hoy = new Date();
    const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    const mesStr = mesActual.toString().padStart(2, '0');
    
    const diasDelMes = obtenerDiasDelMes(anoActual, mesActual);

    for (let i = 0; i < 7; i++) {
        let diaActual = diaInicioSemana + i;
        if (diaActual > diasDelMes) break; 
        
        const fechaColumna = `${anoActual}-${mesStr}-${diaActual.toString().padStart(2, '0')}`;
        const esHoy = fechaColumna === hoyStr ? 'color: var(--primary-color); font-weight: 800; border-bottom: 2px solid var(--primary-color);' : '';
        
        thead.innerHTML += `<th style="${esHoy}">${diasNombres[i]} ${diaActual.toString().padStart(2, '0')}</th>`;
    }

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

            let diaActual = diaInicioSemana + i;
            if (diaActual > diasDelMes) {
                tr.innerHTML += `<td style="background-color: rgba(0,0,0,0.05); border: 1px solid var(--border-color);"></td>`;
                continue;
            }

            const fechaStr = `${anoActual}-${mesStr}-${diaActual.toString().padStart(2, '0')}`;
            const reserva = reservas.find(r => r.fecha === fechaStr && parseInt(r.hora_inicio.split(':')[0]) === h);

            if (reserva) {
                const sala = salas.find(s => s.id_sala === reserva.id_sala);
                const horaInicio = parseInt(reserva.hora_inicio.split(':')[0]);
                const horaFin = parseInt(reserva.hora_fin.split(':')[0]);
                let duracion = horaFin - horaInicio;
                if (duracion < 1) duracion = 1;
                skipCells[i] = duracion - 1; 

                tr.innerHTML += `
                    <td rowspan="${duracion}" class="color-${reserva.id_sala}" style="border: 1px solid var(--border-color); color: var(--text-color-primary); padding: 5px; font-size: 0.8rem; box-shadow: inset 4px 0 0 rgba(0,0,0,0.2); vertical-align: top; position: relative;">
                        <i class="fa-solid fa-trash" style="cursor:pointer; position:absolute; top:8px; right:8px; opacity:0.6;" onclick="eliminarReserva(${res.id_reserva}, event)" title="Eliminar reserva"></i>
                        <strong style="display: block; margin-bottom: 4px; padding-right: 15px;">${sala ? sala.nombre : 'Reservado'}</strong>${reserva.motivo}
                    </td>
                `;
            } else {
                tr.innerHTML += `<td onclick="abrirModalReserva('${fechaStr}')" style="cursor: pointer; border: 1px solid var(--border-color); transition: background 0.2s;"></td>`;
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
    const mesStr = mesActual.toString().padStart(2, '0');
    const fechaFijaDia = `${anoActual}-${mesStr}-${diaSeleccionado.toString().padStart(2, '0')}`;
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
                    <td rowspan="${duracion}" class="color-${reserva.id_sala}" style="border: 1px solid var(--border-color); color: var(--text-color-primary); padding: 5px; font-size: 0.8rem; box-shadow: inset 4px 0 0 rgba(0,0,0,0.2); vertical-align: top; position: relative;">
                        <i class="fa-solid fa-trash" style="cursor:pointer; position:absolute; top:8px; right:8px; opacity:0.6;" onclick="eliminarReserva(${res.id_reserva}, event)" title="Eliminar reserva"></i>
                        <strong style="display: block; margin-bottom: 4px; padding-right: 15px;">✅ Reservado</strong>${reserva.motivo}
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

    const nuevaReserva = {
        id_reserva: Date.now(), 
        id_sala: parseInt(document.getElementById('sala-select').value),
        fecha: document.getElementById('fecha-reserva').value,
        hora_inicio: document.getElementById('hora-inicio').value,
        hora_fin: document.getElementById('hora-fin').value,
        motivo: document.getElementById('motivo').value
    };

    const [hInicio, mInicio] = nuevaReserva.hora_inicio.split(':').map(Number);
    const [hFin, mFin] = nuevaReserva.hora_fin.split(':').map(Number);
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
    
    if (nuevaReserva.fecha === hoyStr) {
        const horaActualDecimal = ahora.getHours() + (ahora.getMinutes() / 60);
        if (decimalInicio < horaActualDecimal) {
            alert('No se pueden hacer reservas para horas pasadas del día actual.');
            return;
        }
    }

    const reservas = JSON.parse(localStorage.getItem('misReservas')) || [];
    reservas.push(nuevaReserva);
    localStorage.setItem('misReservas', JSON.stringify(reservas));

    modal.style.display = 'none';
    renderizarEcosistema();

    const selectSalas = document.getElementById('sala-select');
    const nombreSalaVisual = selectSalas.options[selectSalas.selectedIndex].text;
    
    toastText.innerText = `Reserva confirmada en ${nombreSalaVisual} a las ${nuevaReserva.hora_inicio} hrs.`;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 4000);

    formReserva.reset(); 
});

// 6. ELIMINAR RESERVAS
window.eliminarReserva = function(idReserva, event) {
    event.stopPropagation(); 
    
    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
        let reservas = JSON.parse(localStorage.getItem('misReservas')) || [];
        reservas = reservas.filter(r => r.id_reserva !== idReserva);
        localStorage.setItem('misReservas', JSON.stringify(reservas));
        
        renderizarEcosistema();
        
        toastText.innerText = `Reserva eliminada correctamente.`;
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 4000);
    }
};

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
        diaInicioSemana -= 7;
        if(diaInicioSemana < 1) diaInicioSemana = 1;
    } else if (vistaActual === 'dia') {
        diaSeleccionado--;
        if(diaSeleccionado < 1) diaSeleccionado = 1;
    } else if (vistaActual === 'mes') {
        mesActual--;
        if (mesActual < 1) {
            mesActual = 12;
            anoActual--;
        }
        // Ajustamos la semana y el día al retroceder de mes
        const diasDelMesNuevo = obtenerDiasDelMes(anoActual, mesActual);
        if (diaInicioSemana > diasDelMesNuevo) diaInicioSemana = diasDelMesNuevo - 6;
        if (diaSeleccionado > diasDelMesNuevo) diaSeleccionado = diasDelMesNuevo;
    }
    renderizarEcosistema();
});

document.getElementById('btn-siguiente').addEventListener('click', () => {
    const diasDelMes = obtenerDiasDelMes(anoActual, mesActual);
    
    if (vistaActual === 'semana') {
        diaInicioSemana += 7;
        if(diaInicioSemana > diasDelMes) diaInicioSemana = diasDelMes; 
    } else if (vistaActual === 'dia') {
        diaSeleccionado++;
        if(diaSeleccionado > diasDelMes) diaSeleccionado = diasDelMes;
    } else if (vistaActual === 'mes') {
        mesActual++;
        if (mesActual > 12) {
            mesActual = 1;
            anoActual++;
        }
        const diasDelMesNuevo = obtenerDiasDelMes(anoActual, mesActual);
        if (diaInicioSemana > diasDelMesNuevo) diaInicioSemana = diasDelMesNuevo - 6;
        if (diaSeleccionado > diasDelMesNuevo) diaSeleccionado = diasDelMesNuevo;
    }
    renderizarEcosistema();
});